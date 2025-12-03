const express = require('express');
const router = express.Router();
const pixController = require('../controllers/pixController');

// Create PIX charge
router.post('/create', pixController.createPixCharge);

// Check payment status
router.get('/status/:transactionId', pixController.checkPaymentStatus);

// Webhook for PagSeguro notifications
router.post('/webhook', pixController.handleWebhook);

module.exports = router;
