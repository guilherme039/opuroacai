// Integração do Sistema de Carteira com Pedidos
// Este arquivo adiciona cashback automaticamente quando um pedido é criado

(function() {
    // Aguardar o carregamento do sistema de carteira
    function waitForWallet(callback) {
        if (window.acaiWallet) {
            callback();
        } else {
            setTimeout(() => waitForWallet(callback), 100);
        }
    }

    // Interceptar salvamento de pedidos para adicionar cashback
    function integrateWithOrders() {
        // Verificar se a função saveOrderToSystem existe
        if (typeof saveOrderToSystem === 'function') {
            // Salvar a função original
            const originalSaveOrder = saveOrderToSystem;
            
            // Substituir com versão que adiciona cashback
            window.saveOrderToSystem = function(orderData) {
                // Chamar função original
                const order = originalSaveOrder(orderData);
                
                // Adicionar cashback se o sistema estiver ativo
                if (window.acaiWallet && window.acaiWallet.settings().active) {
                    const cashbackAmount = window.acaiWallet.calculateCashback(order.total);
                    
                    if (cashbackAmount > 0) {
                        window.acaiWallet.addCashback(
                            order.customerPhone,
                            order.customerName,
                            cashbackAmount,
                            `Cashback do pedido #${order.orderNumber}`
                        );
                        
                        console.log(`💰 Cashback de R$ ${cashbackAmount.toFixed(2)} adicionado para ${order.customerName}`);
                    }
                }
                
                return order;
            };
        }
    }

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', integrateWithOrders);
    } else {
        integrateWithOrders();
    }
})();
