// Admin Panel JavaScript

let allOrders = [];

// Load orders from localStorage
function loadOrders() {
    const ordersData = localStorage.getItem('acai_orders');
    allOrders = ordersData ? JSON.parse(ordersData) : [];
    displayOrders();
    updateTotalCount();
}

// Display orders
function displayOrders() {
    const container = document.getElementById('orders-container');
    const emptyState = document.getElementById('empty-state');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;

    // Filter orders
    let filteredOrders = allOrders.filter(order => {
        const matchesSearch = 
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.customerPhone.includes(searchTerm) ||
            order.orderNumber.toString().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredOrders.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    emptyState.classList.add('hidden');

    container.innerHTML = filteredOrders.map(order => createOrderCard(order)).join('');
}

// Create order card HTML - REDESIGNED
function createOrderCard(order) {
    const statusColors = {
        pending: 'bg-blue-100 text-blue-800 border-blue-300',
        preparing: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-300',
        ready_for_pickup: 'bg-green-100 text-green-800 border-green-300',
        completed: 'bg-green-100 text-green-800 border-green-300',
        cancelled: 'bg-red-100 text-red-800 border-red-300'
    };

    const statusLabels = {
        pending: '📦 Recebido',
        preparing: '👨‍🍳 Preparando',
        out_for_delivery: '🛵 Saiu para Entrega',
        ready_for_pickup: '✅ Pronto para Retirada',
        completed: '🎉 Finalizado',
        cancelled: '❌ Cancelado'
    };

    const statusColor = statusColors[order.status] || statusColors.pending;
    const statusLabel = statusLabels[order.status] || statusLabels.pending;

    return `
        <div class="modern-order-card bg-white rounded-xl card-shadow p-6">
            <!-- Order Header -->
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h3 class="text-xl font-bold text-primary">Pedido #${order.orderNumber}</h3>
                    <p class="text-sm text-gray-500">${formatDate(order.date)}</p>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-primary">R$ ${order.total.toFixed(2).replace('.', ',')}</div>
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor} mt-2">
                        ${statusLabel}
                    </span>
                </div>
            </div>

            <!-- Content -->
            <div class="space-y-4">
                <!-- Customer Info -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-primary mb-2">👤 Cliente</h4>
                    <p class="text-sm"><strong>Nome:</strong> ${order.customerName}</p>
                    <p class="text-sm"><strong>WhatsApp:</strong> ${order.customerPhone}</p>
                </div>

                <!-- Delivery Info -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-primary mb-2">🚚 Entrega</h4>
                    <p class="text-sm"><strong>Tipo:</strong> ${order.deliveryType === 'delivery' ? 'Delivery' : 'Retirada no Local'}</p>
                    ${order.deliveryType === 'delivery' ? `
                        <p class="text-sm"><strong>Bairro:</strong> ${order.neighborhood}</p>
                        <p class="text-sm"><strong>Endereço:</strong> ${order.addressStreet}, ${order.addressNumber}</p>
                        ${order.addressComplement ? `<p class="text-sm"><strong>Complemento:</strong> ${order.addressComplement}</p>` : ''}
                        ${order.addressReference ? `<p class="text-sm"><strong>Referência:</strong> ${order.addressReference}</p>` : ''}
                        ${order.deliveryFee > 0 ? `<p class="text-sm"><strong>Taxa:</strong> R$ ${order.deliveryFee.toFixed(2).replace('.', ',')}</p>` : '<p class="text-sm"><strong>Taxa:</strong> Grátis</p>'}
                    ` : ''}
                </div>

                <!-- Payment Info -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-primary mb-2">💳 Pagamento</h4>
                    <p class="text-sm"><strong>Forma:</strong> ${getPaymentMethodLabel(order.paymentMethod)}</p>
                    ${order.paymentMethod === 'money' && order.changeAmount ? `
                        <p class="text-sm"><strong>Troco para:</strong> R$ ${order.changeAmount.toFixed(2).replace('.', ',')}</p>
                        <p class="text-sm text-green-600"><strong>Troco a dar:</strong> R$ ${(order.changeAmount - order.total).toFixed(2).replace('.', ',')}</p>
                    ` : ''}
                    ${order.pixDiscount > 0 ? `<p class="text-sm text-green-600"><strong>Desconto PIX:</strong> -R$ ${order.pixDiscount.toFixed(2).replace('.', ',')}</p>` : ''}
                </div>

                <!-- Items -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-primary mb-2">🛒 Itens do Pedido</h4>
                    ${order.items.map(item => `
                        <div class="mb-3 pb-3 border-b border-gray-200 last:border-b-0">
                            <p class="font-medium">${item.category}</p>
                            <p class="text-sm text-gray-600">${item.description}</p>
                            <p class="text-sm font-bold text-primary">R$ ${item.total.toFixed(2).replace('.', ',')}</p>
                        </div>
                    `).join('')}
                </div>

                ${order.orderNotes ? `
                    <div class="bg-yellow-50 rounded-lg p-4">
                        <h4 class="font-bold text-primary mb-2">📝 Observações</h4>
                        <p class="text-sm">${order.orderNotes}</p>
                    </div>
                ` : ''}
            </div>

            <!-- Actions -->
            <div class="px-6 pb-6">
                <div class="flex flex-wrap gap-3">
                    <select onchange="updateOrderStatus('${order.id}', this.value)" 
                            class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary font-medium text-gray-700">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>📦 Recebido</option>
                        <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>👨‍🍳 Preparando</option>
                        <option value="out_for_delivery" ${order.status === 'out_for_delivery' ? 'selected' : ''}>🛵 Saiu para Entrega</option>
                        <option value="ready_for_pickup" ${order.status === 'ready_for_pickup' ? 'selected' : ''}>✅ Pronto para Retirada</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>🎉 Finalizado</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>❌ Cancelado</option>
                    </select>
                    <button onclick="sendToWhatsApp('${order.id}')" 
                            class="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-bold shadow-md hover:shadow-lg">
                        📱 WhatsApp
                    </button>
                    <button onclick="deleteOrder('${order.id}')" 
                            class="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-bold shadow-md hover:shadow-lg">
                        🗑️ Excluir
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get payment method label
function getPaymentMethodLabel(method) {
    const labels = {
        money: 'Dinheiro',
        pix: 'PIX (com desconto)',
        card: 'Cartão (Débito/Crédito)'
    };
    return labels[method] || method;
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        allOrders[orderIndex].status = newStatus;
        localStorage.setItem('acai_orders', JSON.stringify(allOrders));
        displayOrders();
        showToast(`Status atualizado para: ${newStatus}`);
    }
}

// Delete order
function deleteOrder(orderId) {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
        allOrders = allOrders.filter(o => o.id !== orderId);
        localStorage.setItem('acai_orders', JSON.stringify(allOrders));
        displayOrders();
        updateTotalCount();
        showToast('Pedido excluído com sucesso!');
    }
}

// Clear all orders
function clearAllOrders() {
    const totalOrders = allOrders.length;
    const confirmMessage = `⚠️ ATENÇÃO!\n\nVocê está prestes a EXCLUIR PERMANENTEMENTE todos os ${totalOrders} pedidos!\n\nEsta ação NÃO PODE ser desfeita!\n\nDeseja realmente continuar?`;
    
    if (confirm(confirmMessage)) {
        // Remove all orders from localStorage
        localStorage.removeItem('acai_orders');
        
        // Clear the array
        allOrders = [];
        
        // Update display
        displayOrders();
        updateTotalCount();
        
        // Show confirmation
        showToast(`✅ Todos os ${totalOrders} pedidos foram excluídos permanentemente!`);
    }
}

// Send to WhatsApp
function sendToWhatsApp(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    let message = `🥄 *O PURO AÇAÍ - PEDIDO #${order.orderNumber}*\n\n`;
    message += `👤 *CLIENTE*\n`;
    message += `Nome: ${order.customerName}\n`;
    message += `WhatsApp: ${order.customerPhone}\n\n`;
    message += `🚚 *ENTREGA*\n`;
    message += `Tipo: ${order.deliveryType === 'delivery' ? 'Delivery' : 'Retirada no Local'}\n`;
    
    if (order.deliveryType === 'delivery') {
        message += `Bairro: ${order.neighborhood}\n`;
        message += `Endereço: ${order.addressStreet}, ${order.addressNumber}\n`;
        if (order.addressComplement) message += `Complemento: ${order.addressComplement}\n`;
        if (order.addressReference) message += `Referência: ${order.addressReference}\n`;
    }
    
    message += `\n💳 *PAGAMENTO*\n`;
    message += `Forma: ${getPaymentMethodLabel(order.paymentMethod)}\n`;
    
    if (order.paymentMethod === 'money' && order.changeAmount) {
        message += `Troco para: R$ ${order.changeAmount.toFixed(2).replace('.', ',')}\n`;
        message += `💰 *TROCO A DAR: R$ ${(order.changeAmount - order.total).toFixed(2).replace('.', ',')}*\n`;
    }
    
    message += `\n🛒 *PEDIDO*\n\n`;
    order.items.forEach(item => {
        message += `*${item.category}*\n`;
        message += `${item.description}\n`;
        message += `*Subtotal: R$ ${item.total.toFixed(2).replace('.', ',')}*\n\n`;
    });
    
    message += `*TOTAL GERAL: R$ ${order.total.toFixed(2).replace('.', ',')}*\n\n`;
    
    if (order.orderNotes) {
        message += `📝 *OBSERVAÇÕES*\n${order.orderNotes}\n\n`;
    }
    
    message += `⏰ Pedido realizado em: ${formatDate(order.date)}`;
    
    const whatsappUrl = `https://wa.me/5513991945381?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Update total count
function updateTotalCount() {
    document.getElementById('total-orders').textContent = allOrders.length;
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-secondary text-primary px-6 py-3 rounded-lg shadow-lg z-50 font-medium';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Event listeners
document.getElementById('search-input').addEventListener('input', displayOrders);
document.getElementById('status-filter').addEventListener('change', displayOrders);

// Initialize
loadOrders();

// Auto-refresh every 30 seconds
setInterval(loadOrders, 30000);
