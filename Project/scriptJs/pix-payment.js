// Sistema de Pagamento PIX - Chave Direta

// PIX Key Configuration
const PIX_KEY = '13992065245';
const PIX_KEY_FORMATTED = '(13) 9 9206-5245';
const PIX_RECEIVER_NAME = 'Luiz Gustavo Barros da Silva';

// Mostrar modal de pagamento PIX
function showPixPaymentModal(orderTotal, orderNumber = null, orderData = null) {
    // Store order data globally for confirmation
    if (orderData) {
        window.pendingPixOrderData = orderData;
        window.pendingPixTotal = orderTotal;
    }
    
    const pixKey = '(13) 9 9206-5245';
    const pixKeyNumbers = '13992065245';
    
    const modal = document.createElement('div');
    modal.id = 'pix-payment-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 max-w-md w-full my-8 max-h-screen overflow-y-auto">
            <!-- Header -->
            <div class="text-center mb-6">
                <div class="text-6xl mb-3">📱</div>
                <h2 class="text-2xl font-bold text-primary mb-1">Pagamento PIX</h2>
                <p class="text-gray-600">${orderNumber ? `Pedido #${orderNumber}` : 'Finalize seu pagamento'}</p>
            </div>
            
            <!-- Valor -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6 text-center border-2 border-primary/20">
                <div class="text-sm text-gray-600 mb-2 font-medium">Valor a pagar</div>
                <div class="text-5xl font-bold text-primary mb-2">R$ ${orderTotal.toFixed(2).replace('.', ',')}</div>
                <div class="text-xs text-gray-500">Desconto de 2% já aplicado</div>
            </div>
            
            <!-- Chave PIX - Destaque Principal -->
            <div class="bg-gradient-to-br from-primary to-purple-800 rounded-2xl p-6 mb-6 text-center shadow-xl">
                <div class="text-white mb-3">
                    <div class="text-sm font-medium mb-2 opacity-90">📱 Chave PIX (Celular)</div>
                    <div class="text-4xl font-bold mb-3 tracking-wider">${pixKey}</div>
                    <div class="text-xs opacity-75">Luiz Gustavo Barros da Silva</div>
                </div>
                <button onclick="copyPixKey('${pixKeyNumbers}')" 
                        class="w-full bg-white text-primary font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                    📋 Copiar Chave PIX
                </button>
            </div>
            
            <!-- Instruções -->
            <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
                <h4 class="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span class="text-xl">📱</span>
                    <span>Como pagar:</span>
                </h4>
                <ol class="text-sm text-blue-800 space-y-2">
                    <li class="flex items-start gap-2">
                        <span class="font-bold min-w-[20px]">1.</span>
                        <span>Abra o app do seu banco</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-bold min-w-[20px]">2.</span>
                        <span>Escolha <strong>"Pagar com PIX"</strong></span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-bold min-w-[20px]">3.</span>
                        <span>Selecione <strong>"Chave PIX"</strong></span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-bold min-w-[20px]">4.</span>
                        <span>Cole a chave: <strong>${pixKey}</strong></span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-bold min-w-[20px]">5.</span>
                        <span>Confirme o valor de <strong>R$ ${orderTotal.toFixed(2).replace('.', ',')}</strong></span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-bold min-w-[20px]">6.</span>
                        <span>Finalize o pagamento</span>
                    </li>
                </ol>
            </div>
            
            <!-- Informações do Recebedor -->
            <div class="bg-gray-50 rounded-xl p-4 mb-6 text-center border border-gray-200">
                <div class="text-xs text-gray-500 mb-1">Você está pagando para:</div>
                <div class="font-bold text-gray-800">Luiz Gustavo Barros da Silva</div>
                <div class="text-sm text-gray-600 mt-1">Chave: ${pixKey}</div>
            </div>
            
            <!-- Botão Copiar Pedido -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
                <div class="text-center mb-3">
                    <div class="text-sm font-bold text-gray-700 mb-1">📋 Informações do Pedido</div>
                    <div class="text-xs text-gray-600">Copie e envie para o WhatsApp do estabelecimento</div>
                </div>
                <button onclick="copyOrderDetails()" 
                        class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                    <div class="flex items-center justify-center gap-2">
                        <span class="text-xl">📋</span>
                        <span>Copiar Detalhes do Pedido</span>
                    </div>
                </button>
                <div class="text-xs text-center text-gray-500 mt-2">
                    Após copiar, cole no WhatsApp: <strong>(13) 99194-5381</strong>
                </div>
            </div>
            
            <!-- Botões -->
            <div class="flex gap-3">
                <button onclick="confirmPixPayment()" 
                        class="flex-1 bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                    ✅ Já Paguei
                </button>
                <button onclick="closePixModal()" 
                        class="px-6 bg-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-300 transition-all">
                    Cancelar
                </button>
            </div>
            
            <!-- Aviso -->
            <div class="mt-4 text-center">
                <p class="text-xs text-gray-500">⏰ Após realizar o pagamento, clique em "Já Paguei"</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// No QR Code library needed - using direct PIX key

// Copiar chave PIX
function copyPixKey(pixKey) {
    // Create temporary input
    const tempInput = document.createElement('input');
    tempInput.value = pixKey;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    const btn = event.target;
    const originalText = btn.textContent;
    const originalClasses = btn.className;
    
    btn.textContent = '✅ Chave Copiada!';
    btn.className = 'w-full bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.className = originalClasses;
    }, 2000);
}

// Copiar detalhes do pedido
function copyOrderDetails() {
    if (!window.pendingPixOrderData) {
        alert('Erro: Dados do pedido não encontrados');
        return;
    }
    
    const orderData = window.pendingPixOrderData;
    const orderTotal = window.pendingPixTotal || 0;
    
    // Montar mensagem formatada
    let message = `🥄 *PEDIDO - O PURO AÇAÍ*\n\n`;
    
    // Cliente
    message += `👤 *CLIENTE*\n`;
    message += `Nome: ${orderData.customerName}\n`;
    message += `WhatsApp: ${orderData.customerPhone}\n\n`;
    
    // Entrega
    message += `🚚 *ENTREGA*\n`;
    if (orderData.deliveryType === 'delivery') {
        message += `Tipo: Delivery\n`;
        if (orderData.neighborhood) {
            const neighborhoodData = orderData.neighborhood.split('-');
            const neighborhoodName = neighborhoodData[0];
            const deliveryFee = parseFloat(neighborhoodData[1] || 0);
            message += `Bairro: ${neighborhoodName}`;
            if (deliveryFee > 0) {
                message += ` (+R$ ${deliveryFee.toFixed(2).replace('.', ',')})\n`;
            } else {
                message += ` (Grátis)\n`;
            }
        }
        if (orderData.addressStreet && orderData.addressNumber) {
            message += `Endereço: ${orderData.addressStreet}, ${orderData.addressNumber}`;
            if (orderData.addressComplement) {
                message += ` - ${orderData.addressComplement}`;
            }
            message += `\n`;
        }
        if (orderData.addressReference) {
            message += `Referência: ${orderData.addressReference}\n`;
        }
    } else {
        message += `Tipo: Retirada no Local\n`;
    }
    message += '\n';
    
    // Pagamento
    message += `💳 *PAGAMENTO*\n`;
    message += `Forma: PIX (com desconto de 2%)\n`;
    message += `Valor: R$ ${orderTotal.toFixed(2).replace('.', ',')}\n\n`;
    
    // Itens do pedido (se disponível no carrinho)
    if (typeof cartItems !== 'undefined' && cartItems.length > 0) {
        message += `🛒 *ITENS DO PEDIDO*\n\n`;
        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.category}\n`;
            if (item.selections && item.selections.length > 0) {
                item.selections.forEach(sel => {
                    if (sel.text) {
                        message += `   • ${sel.text}\n`;
                    }
                });
            }
            message += `   Subtotal: R$ ${item.total.toFixed(2).replace('.', ',')}\n\n`;
        });
    }
    
    // Descartáveis
    if (orderData.disposables) {
        message += `🥄 *DESCARTÁVEIS*\n`;
        message += orderData.disposables === 'yes' ? 'Sim, preciso de descartáveis\n\n' : 'Não preciso\n\n';
    }
    
    // Observações
    if (orderData.orderNotes) {
        message += `📝 *OBSERVAÇÕES*\n${orderData.orderNotes}\n\n`;
    }
    
    // Total
    message += `💰 *TOTAL A PAGAR*\n`;
    message += `R$ ${orderTotal.toFixed(2).replace('.', ',')}\n\n`;
    
    // Data e hora
    message += `⏰ ${new Date().toLocaleString('pt-BR')}`;
    
    // Copiar para clipboard
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = message;
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.left = '-9999px';
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    
    // Feedback visual
    const btn = event.target.closest('button');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = `
        <div class="flex items-center justify-center gap-2">
            <span class="text-xl">✅</span>
            <span>Pedido Copiado!</span>
        </div>
    `;
    btn.className = 'w-full bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md';
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.className = 'w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105';
    }, 2000);
}

// Confirmar pagamento PIX
function confirmPixPayment() {
    closePixModal();
    
    // Check if we have pending order data (new flow)
    if (window.pendingPixOrderData) {
        const orderData = window.pendingPixOrderData;
        
        // Process the order NOW (after PIX confirmation)
        if (typeof window.sendWhatsAppWithData === 'function') {
            window.sendWhatsAppWithData(orderData);
        } else {
            console.error('sendWhatsAppWithData function not found');
            showMessage('Erro ao processar pedido. Por favor, tente novamente.');
        }
        
        // Clean up
        delete window.pendingPixOrderData;
        delete window.pendingPixTotal;
        
    } else {
        // Old flow - just show success (for backwards compatibility)
        console.warn('No pending order data found - using old flow');
        showMessage('Pagamento confirmado! Seu pedido foi registrado.');
    }
}

// Fechar modal PIX
function closePixModal() {
    const modal = document.getElementById('pix-payment-modal');
    if (modal) modal.remove();
}

// Exportar funções
window.pixPayment = {
    show: showPixPaymentModal,
    close: closePixModal
};
