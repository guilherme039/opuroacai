// Sistema de Acompanhamento de Pedidos

let currentOrderId = null;
let updateInterval = null;

// Status configurations
const statusConfig = {
    'pending': {
        icon: '📦',
        text: 'PEDIDO RECEBIDO',
        color: 'bg-blue-500 text-white',
        description: 'Seu pedido foi recebido e está aguardando confirmação'
    },
    'preparing': {
        icon: '👨‍🍳',
        text: 'PREPARANDO',
        color: 'bg-yellow-500 text-white',
        description: 'Estamos preparando seu pedido com carinho'
    },
    'out_for_delivery': {
        icon: '🛵',
        text: 'SAIU PARA ENTREGA',
        color: 'bg-purple-500 text-white',
        description: 'Seu pedido está a caminho'
    },
    'ready_for_pickup': {
        icon: '✅',
        text: 'PRONTO PARA RETIRADA',
        color: 'bg-green-500 text-white',
        description: 'Seu pedido está pronto! Pode vir buscar'
    },
    'completed': {
        icon: '🎉',
        text: 'FINALIZADO',
        color: 'bg-green-600 text-white',
        description: 'Pedido entregue com sucesso!'
    },
    'cancelled': {
        icon: '❌',
        text: 'CANCELADO',
        color: 'bg-red-500 text-white',
        description: 'Pedido cancelado'
    }
};

// Payment method names
const paymentMethods = {
    'money': 'Dinheiro',
    'pix': 'PIX',
    'card': 'Cartão (Débito/Crédito)'
};

// Initialize page
function init() {
    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentOrderId = urlParams.get('pedido');
    
    if (!currentOrderId) {
        showError();
        return;
    }
    
    // Load order details
    loadOrderDetails();
    
    // Set up auto-update every 5 seconds
    updateInterval = setInterval(loadOrderDetails, 5000);
}

// Load order details from localStorage
function loadOrderDetails() {
    try {
        const ordersData = localStorage.getItem('acai_orders');
        
        if (!ordersData) {
            showError();
            return;
        }
        
        const orders = JSON.parse(ordersData);
        const order = orders.find(o => o.orderNumber === currentOrderId || o.id === currentOrderId);
        
        if (!order) {
            showError();
            return;
        }
        
        displayOrder(order);
        
    } catch (error) {
        console.error('Error loading order:', error);
        showError();
    }
}

// Display order details
function displayOrder(order) {
    // Hide loading, show details
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('error-state').classList.add('hidden');
    document.getElementById('order-details').classList.remove('hidden');
    
    // Order number
    document.getElementById('order-number').textContent = `#${order.orderNumber}`;
    
    // Status
    const status = order.status || 'pending';
    const config = statusConfig[status] || statusConfig['pending'];
    
    document.getElementById('status-icon').textContent = config.icon;
    
    const statusBadge = document.getElementById('status-badge');
    statusBadge.textContent = config.text;
    statusBadge.className = `inline-block px-4 py-2 rounded-full text-sm font-bold mt-2 ${config.color}`;
    
    // Customer info
    document.getElementById('customer-name').textContent = order.customerName;
    document.getElementById('customer-phone').textContent = order.customerPhone;
    
    // Delivery info
    if (order.deliveryType === 'delivery') {
        document.getElementById('delivery-info').classList.remove('hidden');
        document.getElementById('delivery-type').textContent = 'Delivery';
        
        if (order.addressStreet) {
            const addressDiv = document.getElementById('delivery-address');
            addressDiv.classList.remove('hidden');
            
            let address = `${order.addressStreet}, ${order.addressNumber}`;
            if (order.addressComplement) {
                address += ` - ${order.addressComplement}`;
            }
            if (order.neighborhood) {
                address += ` - ${order.neighborhood}`;
            }
            
            document.getElementById('address-text').textContent = address;
        }
    } else {
        document.getElementById('delivery-info').classList.remove('hidden');
        document.getElementById('delivery-type').textContent = 'Retirada no Local';
    }
    
    // Items
    const itemsContainer = document.getElementById('order-items');
    itemsContainer.innerHTML = '';
    
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'border-b border-gray-200 pb-3 last:border-0';
            
            let itemHTML = `
                <div class="font-medium text-gray-800">${item.category}</div>
            `;
            
            if (item.description && item.description !== 'Conforme pedido') {
                itemHTML += `<div class="text-sm text-gray-600 mt-1">${item.description}</div>`;
            }
            
            itemHTML += `<div class="text-sm text-primary font-medium mt-1">R$ ${item.total.toFixed(2).replace('.', ',')}</div>`;
            
            itemDiv.innerHTML = itemHTML;
            itemsContainer.appendChild(itemDiv);
        });
    } else {
        itemsContainer.innerHTML = '<p class="text-gray-600 text-sm">Itens não disponíveis</p>';
    }
    
    // Payment
    const paymentMethodText = paymentMethods[order.paymentMethod] || order.paymentMethod;
    document.getElementById('payment-method').textContent = paymentMethodText;
    
    // Total
    const total = order.total || 0;
    document.getElementById('order-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Show error state
function showError() {
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('error-state').classList.remove('hidden');
    document.getElementById('order-details').classList.add('hidden');
    
    // Stop auto-update
    if (updateInterval) {
        clearInterval(updateInterval);
    }
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

// Start when page loads
document.addEventListener('DOMContentLoaded', init);
