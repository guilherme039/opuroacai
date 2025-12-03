// Sistema de Pagamento PIX REAL via PagSeguro

const PIX_BACKEND_URL = 'http://localhost:3000'; // Change to your backend URL

// Store current transaction
let currentPixTransaction = null;
let statusCheckInterval = null;

/**
 * Create PIX charge via backend
 */
async function createPixCharge(amount, orderData) {
    try {
        const response = await fetch(`${PIX_BACKEND_URL}/pix/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                description: `Pedido O Puro Açaí`,
                customerName: orderData.customerName,
                customerPhone: orderData.customerPhone,
                orderNumber: 'TEMP' // Will be generated after payment
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create PIX charge');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error creating PIX charge:', error);
        throw error;
    }
}

/**
 * Check payment status
 */
async function checkPaymentStatus(transactionId) {
    try {
        const response = await fetch(`${PIX_BACKEND_URL}/pix/status/${transactionId}`);
        
        if (!response.ok) {
            throw new Error('Failed to check payment status');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error checking payment status:', error);
        return null;
    }
}

/**
 * Show PIX payment modal with real QR Code
 */
async function showRealPixPaymentModal(orderTotal, orderData) {
    // Show loading
    const loadingModal = document.createElement('div');
    loadingModal.id = 'pix-loading-modal';
    loadingModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    loadingModal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div class="text-4xl mb-4">⏳</div>
            <h2 class="text-2xl font-bold text-primary mb-2">Gerando PIX...</h2>
            <p class="text-gray-600">Aguarde enquanto criamos seu pagamento</p>
        </div>
    `;
    document.body.appendChild(loadingModal);

    try {
        // Create PIX charge
        const pixData = await createPixCharge(orderTotal, orderData);
        currentPixTransaction = pixData;

        // Remove loading
        loadingModal.remove();

        // Show PIX modal
        const modal = document.createElement('div');
        modal.id = 'pix-payment-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-md w-full">
                <!-- Header -->
                <div class="text-center mb-6">
                    <div class="text-4xl mb-2">💳</div>
                    <h2 class="text-2xl font-bold text-primary mb-1">Pagamento PIX</h2>
                    <p class="text-gray-600">Escaneie o QR Code para pagar</p>
                </div>
                
                <!-- Valor -->
                <div class="bg-primary/5 rounded-xl p-4 mb-6 text-center">
                    <div class="text-sm text-gray-600 mb-1">Valor a pagar</div>
                    <div class="text-4xl font-bold text-primary">R$ ${orderTotal.toFixed(2).replace('.', ',')}</div>
                </div>
                
                <!-- QR Code -->
                <div class="bg-white border-4 border-primary rounded-xl p-4 mb-4 flex items-center justify-center">
                    <img src="${pixData.qr_code_image}" alt="QR Code PIX" class="w-64 h-64">
                </div>
                
                <!-- Copiar e Colar -->
                <div class="mb-6">
                    <label class="block text-sm font-bold text-gray-700 mb-2">Código PIX (Copiar e Colar)</label>
                    <div class="flex gap-2">
                        <input type="text" 
                               id="pix-code-input" 
                               value="${pixData.qr_code_payload}" 
                               readonly 
                               class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono bg-gray-50">
                        <button onclick="copyRealPixCode()" 
                                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-800 transition-colors font-bold">
                            📋 Copiar
                        </button>
                    </div>
                </div>
                
                <!-- Status -->
                <div id="pix-status" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
                    <div class="flex items-center justify-center gap-2 mb-2">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                        <span class="font-bold text-yellow-800">Aguardando pagamento...</span>
                    </div>
                    <p class="text-sm text-yellow-700">Verificando automaticamente a cada 3 segundos</p>
                </div>
                
                <!-- Instruções -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 class="font-bold text-blue-900 mb-2">📱 Como pagar:</h4>
                    <ol class="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Abra o app do seu banco</li>
                        <li>Escolha "Pagar com PIX"</li>
                        <li>Escaneie o QR Code ou cole o código</li>
                        <li>Confirme o pagamento</li>
                        <li>Aguarde a confirmação automática</li>
                    </ol>
                </div>
                
                <!-- Receiver Info -->
                <div class="text-center text-sm text-gray-600 mb-6">
                    <p class="font-bold">Recebedor:</p>
                    <p>Luiz Gustavo Barros da Silva</p>
                    <p>Pagseguro Internet S.A.</p>
                    <p class="text-primary font-medium">(13) 9 9206-5245</p>
                </div>
                
                <!-- Botão Cancelar -->
                <button onclick="cancelRealPixPayment()" 
                        class="w-full bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400 transition-colors">
                    Cancelar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);

        // Start checking payment status
        startPaymentStatusCheck(pixData.transaction_id, orderData);

    } catch (error) {
        loadingModal.remove();
        alert(`Erro ao gerar PIX: ${error.message}\n\nPor favor, tente novamente ou escolha outra forma de pagamento.`);
        console.error('PIX Error:', error);
    }
}

/**
 * Start checking payment status periodically
 */
function startPaymentStatusCheck(transactionId, orderData) {
    // Check immediately
    checkAndUpdateStatus(transactionId, orderData);

    // Then check every 3 seconds
    statusCheckInterval = setInterval(() => {
        checkAndUpdateStatus(transactionId, orderData);
    }, 3000);
}

/**
 * Check and update payment status
 */
async function checkAndUpdateStatus(transactionId, orderData) {
    const status = await checkPaymentStatus(transactionId);
    
    if (!status) return;

    const statusDiv = document.getElementById('pix-status');
    if (!statusDiv) {
        // Modal was closed
        stopPaymentStatusCheck();
        return;
    }

    if (status.status === 'PAID') {
        // Payment confirmed!
        stopPaymentStatusCheck();
        
        statusDiv.className = 'bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center';
        statusDiv.innerHTML = `
            <div class="flex items-center justify-center gap-2 mb-2">
                <span class="text-2xl">✅</span>
                <span class="font-bold text-green-800">Pagamento Confirmado!</span>
            </div>
            <p class="text-sm text-green-700">Processando seu pedido...</p>
        `;

        // Process the order now
        setTimeout(() => {
            closeRealPixModal();
            processOrderAfterPixPayment(orderData);
        }, 2000);

    } else if (status.status === 'EXPIRED') {
        stopPaymentStatusCheck();
        
        statusDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center';
        statusDiv.innerHTML = `
            <div class="flex items-center justify-center gap-2 mb-2">
                <span class="text-2xl">❌</span>
                <span class="font-bold text-red-800">PIX Expirado</span>
            </div>
            <p class="text-sm text-red-700">Por favor, gere um novo PIX</p>
        `;
    }
}

/**
 * Stop checking payment status
 */
function stopPaymentStatusCheck() {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
    }
}

/**
 * Process order after PIX payment confirmation
 */
function processOrderAfterPixPayment(orderData) {
    // Call the existing sendWhatsAppWithData function
    if (typeof sendWhatsAppWithData === 'function') {
        sendWhatsAppWithData(orderData);
    } else {
        console.error('sendWhatsAppWithData function not found');
        showMessage('Pagamento confirmado! Seu pedido foi registrado.');
    }
}

/**
 * Copy PIX code to clipboard
 */
function copyRealPixCode() {
    const input = document.getElementById('pix-code-input');
    input.select();
    document.execCommand('copy');
    
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✅ Copiado!';
    btn.classList.add('bg-green-500');
    btn.classList.remove('bg-primary');
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('bg-green-500');
        btn.classList.add('bg-primary');
    }, 2000);
}

/**
 * Cancel PIX payment
 */
function cancelRealPixPayment() {
    stopPaymentStatusCheck();
    closeRealPixModal();
    showMessage('Pagamento PIX cancelado');
}

/**
 * Close PIX modal
 */
function closeRealPixModal() {
    const modal = document.getElementById('pix-payment-modal');
    if (modal) modal.remove();
    
    stopPaymentStatusCheck();
}

// Export functions
window.pixPaymentReal = {
    show: showRealPixPaymentModal,
    close: closeRealPixModal
};
