const axios = require('axios');
const QRCode = require('qrcode');
const crypto = require('crypto');

// In-memory storage (use database in production)
const transactions = new Map();

// PagSeguro API Configuration
const PAGSEGURO_API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://api.pagseguro.com' 
    : 'https://sandbox.api.pagseguro.com';

const PAGSEGURO_EMAIL = process.env.PAGSEGURO_EMAIL;
const PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN;

/**
 * Create PIX Charge
 * POST /pix/create
 */
exports.createPixCharge = async (req, res) => {
    try {
        const { amount, description, customerName, customerPhone, orderNumber } = req.body;

        // Validate input
        if (!amount || amount <= 0) {
            return res.status(400).json({ 
                error: 'Invalid amount',
                message: 'Amount must be greater than 0'
            });
        }

        // Generate unique transaction ID
        const transactionId = `PIX_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        // Create PIX charge with PagSeguro
        const pixData = {
            reference_id: transactionId,
            customer: {
                name: customerName || 'Cliente',
                email: customerPhone ? `${customerPhone}@temp.com` : 'cliente@temp.com',
                tax_id: '00000000000' // CPF - use real data in production
            },
            items: [{
                reference_id: orderNumber || 'PEDIDO',
                name: description || 'Pedido O Puro Açaí',
                quantity: 1,
                unit_amount: Math.round(amount * 100) // Convert to cents
            }],
            qr_codes: [{
                amount: {
                    value: Math.round(amount * 100)
                },
                expiration_date: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
            }],
            notification_urls: [
                process.env.WEBHOOK_URL || 'https://seu-dominio.com/pix/webhook'
            ]
        };

        // Call PagSeguro API
        const response = await axios.post(
            `${PAGSEGURO_API_URL}/orders`,
            pixData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${PAGSEGURO_TOKEN}`
                }
            }
        );

        const pixCharge = response.data;
        const qrCodeData = pixCharge.qr_codes[0];

        // Generate QR Code image
        const qrCodeImage = await QRCode.toDataURL(qrCodeData.text);

        // Store transaction
        transactions.set(transactionId, {
            id: transactionId,
            pagseguroId: pixCharge.id,
            amount: amount,
            status: 'PENDING',
            qrCodeText: qrCodeData.text,
            qrCodeImage: qrCodeImage,
            expiresAt: qrCodeData.expiration_date,
            createdAt: new Date().toISOString(),
            orderNumber: orderNumber,
            customerName: customerName,
            customerPhone: customerPhone
        });

        // Return response
        res.json({
            success: true,
            transaction_id: transactionId,
            qr_code_image: qrCodeImage,
            qr_code_payload: qrCodeData.text,
            amount: amount,
            expires_at: qrCodeData.expiration_date,
            status: 'PENDING'
        });

    } catch (error) {
        console.error('Error creating PIX charge:', error.response?.data || error.message);
        
        res.status(500).json({
            error: 'Failed to create PIX charge',
            message: error.response?.data?.error_messages?.[0]?.description || error.message,
            details: error.response?.data
        });
    }
};

/**
 * Check Payment Status
 * GET /pix/status/:transactionId
 */
exports.checkPaymentStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;

        // Get transaction from storage
        const transaction = transactions.get(transactionId);

        if (!transaction) {
            return res.status(404).json({
                error: 'Transaction not found',
                message: 'Invalid transaction ID'
            });
        }

        // Check if expired
        if (new Date(transaction.expiresAt) < new Date()) {
            transaction.status = 'EXPIRED';
            transactions.set(transactionId, transaction);
        }

        // If still pending, check with PagSeguro
        if (transaction.status === 'PENDING') {
            try {
                const response = await axios.get(
                    `${PAGSEGURO_API_URL}/orders/${transaction.pagseguroId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${PAGSEGURO_TOKEN}`
                        }
                    }
                );

                const orderStatus = response.data.charges[0]?.status;
                
                if (orderStatus === 'PAID') {
                    transaction.status = 'PAID';
                    transaction.paidAt = new Date().toISOString();
                    transactions.set(transactionId, transaction);
                }
            } catch (error) {
                console.error('Error checking PagSeguro status:', error.message);
            }
        }

        res.json({
            transaction_id: transactionId,
            status: transaction.status,
            amount: transaction.amount,
            paid_at: transaction.paidAt || null,
            expires_at: transaction.expiresAt
        });

    } catch (error) {
        console.error('Error checking payment status:', error.message);
        res.status(500).json({
            error: 'Failed to check payment status',
            message: error.message
        });
    }
};

/**
 * Handle PagSeguro Webhook
 * POST /pix/webhook
 */
exports.handleWebhook = async (req, res) => {
    try {
        console.log('Webhook received:', req.body);

        const notification = req.body;

        // Validate PagSeguro signature (implement proper validation in production)
        // const signature = req.headers['x-pagseguro-signature'];
        // if (!validateSignature(signature, req.body)) {
        //     return res.status(401).json({ error: 'Invalid signature' });
        // }

        // Get order details from PagSeguro
        const orderId = notification.id;
        
        const response = await axios.get(
            `${PAGSEGURO_API_URL}/orders/${orderId}`,
            {
                headers: {
                    'Authorization': `Bearer ${PAGSEGURO_TOKEN}`
                }
            }
        );

        const order = response.data;
        const charge = order.charges[0];
        const referenceId = order.reference_id;

        // Find transaction
        const transaction = transactions.get(referenceId);

        if (transaction && charge.status === 'PAID') {
            transaction.status = 'PAID';
            transaction.paidAt = new Date().toISOString();
            transaction.pagseguroChargeId = charge.id;
            transactions.set(referenceId, transaction);

            console.log(`✅ Payment confirmed for transaction ${referenceId}`);

            // Here you can:
            // - Update database
            // - Send confirmation email
            // - Unlock user access
            // - Notify frontend via WebSocket
        }

        // Always return 200 to acknowledge receipt
        res.status(200).json({ received: true });

    } catch (error) {
        console.error('Error handling webhook:', error.message);
        // Still return 200 to avoid PagSeguro retries
        res.status(200).json({ received: true, error: error.message });
    }
};

// Helper function to validate PagSeguro signature
function validateSignature(signature, body) {
    // Implement PagSeguro signature validation
    // See: https://dev.pagseguro.uol.com.br/reference/webhooks
    return true; // Placeholder
}
