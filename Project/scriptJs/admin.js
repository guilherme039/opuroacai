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
        pending: 'Recebido',
        preparing: 'Preparando',
        out_for_delivery: 'Saiu para Entrega',
        ready_for_pickup: 'Pronto para Retirada',
        completed: 'Finalizado',
        cancelled: 'Cancelado'
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
                    <h4 class="font-bold text-primary mb-2">Cliente</h4>
                    <p class="text-sm"><strong>Nome:</strong> ${order.customerName}</p>
                    <p class="text-sm"><strong>WhatsApp:</strong> ${order.customerPhone}</p>
                </div>

                <!-- Delivery Info -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-primary mb-2">Entrega</h4>
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
                    <h4 class="font-bold text-primary mb-2">Pagamento</h4>
                    <p class="text-sm"><strong>Forma:</strong> ${getPaymentMethodLabel(order.paymentMethod)}</p>
                    ${order.paymentMethod === 'money' && order.changeAmount ? `
                        <p class="text-sm"><strong>Troco para:</strong> R$ ${order.changeAmount.toFixed(2).replace('.', ',')}</p>
                        <p class="text-sm text-green-600"><strong>Troco a dar:</strong> R$ ${(order.changeAmount - order.total).toFixed(2).replace('.', ',')}</p>
                    ` : ''}
                    ${order.pixDiscount > 0 ? `<p class="text-sm text-green-600"><strong>Desconto PIX:</strong> -R$ ${order.pixDiscount.toFixed(2).replace('.', ',')}</p>` : ''}
                </div>

                <!-- Items -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-primary mb-2">Itens do Pedido</h4>
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
                        <h4 class="font-bold text-primary mb-2">Observações</h4>
                        <p class="text-sm">${order.orderNotes}</p>
                    </div>
                ` : ''}
            </div>

            <!-- Actions -->
            <div class="px-6 pb-6">
                <div class="flex flex-wrap gap-3">
                    <select onchange="updateOrderStatus('${order.id}', this.value)" 
                            class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary font-medium text-gray-700">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Recebido</option>
                        <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparando</option>
                        <option value="out_for_delivery" ${order.status === 'out_for_delivery' ? 'selected' : ''}>Saiu para Entrega</option>
                        <option value="ready_for_pickup" ${order.status === 'ready_for_pickup' ? 'selected' : ''}>Pronto para Retirada</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Finalizado</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                    </select>
                    <button onclick="editOrder('${order.id}')" 
                            class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-bold shadow-md hover:shadow-lg">
                        Editar
                    </button>
                    <button onclick="sendToWhatsApp('${order.id}')" 
                            class="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-bold shadow-md hover:shadow-lg">
                        WhatsApp
                    </button>
                    <button onclick="deleteOrder('${order.id}')" 
                            class="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-bold shadow-md hover:shadow-lg">
                        Excluir
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
        showToast(`Todos os ${totalOrders} pedidos foram excluídos permanentemente!`);
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


// ============================================
// FUNCIONALIDADE DE EDIÇÃO DE PEDIDOS
// ============================================

let currentEditingOrder = null;

// Abrir modal de edição
function editOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    currentEditingOrder = { ...order }; // Clone do pedido
    
    // Preencher o modal com os dados do pedido
    document.getElementById('edit-order-number').textContent = order.orderNumber;
    document.getElementById('edit-customer-name').value = order.customerName;
    document.getElementById('edit-customer-phone').value = order.customerPhone;
    document.getElementById('edit-delivery-type').value = order.deliveryType;
    document.getElementById('edit-payment-method').value = order.paymentMethod;
    document.getElementById('edit-order-notes').value = order.orderNotes || '';
    
    // Campos de delivery
    if (order.deliveryType === 'delivery') {
        document.getElementById('edit-neighborhood').value = order.neighborhood || '';
        document.getElementById('edit-address-street').value = order.addressStreet || '';
        document.getElementById('edit-address-number').value = order.addressNumber || '';
        document.getElementById('edit-address-complement').value = order.addressComplement || '';
        document.getElementById('edit-address-reference').value = order.addressReference || '';
        document.getElementById('edit-delivery-fee').value = order.deliveryFee || 0;
        document.getElementById('edit-delivery-fields').classList.remove('hidden');
    } else {
        document.getElementById('edit-delivery-fields').classList.add('hidden');
    }
    
    // Campos de pagamento em dinheiro
    if (order.paymentMethod === 'money') {
        document.getElementById('edit-change-amount').value = order.changeAmount || 0;
        document.getElementById('edit-money-fields').classList.remove('hidden');
    } else {
        document.getElementById('edit-money-fields').classList.add('hidden');
    }
    
    // Renderizar itens
    renderEditItems(order.items);
    
    // Calcular e mostrar total
    updateEditTotal();
    
    // Mostrar modal
    document.getElementById('edit-order-modal').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('edit-modal-content').classList.remove('translate-y-full');
    }, 10);
}

// Fechar modal de edição
function closeEditModal() {
    document.getElementById('edit-modal-content').classList.add('translate-y-full');
    setTimeout(() => {
        document.getElementById('edit-order-modal').classList.add('hidden');
        currentEditingOrder = null;
    }, 300);
}

// Renderizar itens para edição
function renderEditItems(items) {
    const container = document.getElementById('edit-items-list');
    container.innerHTML = items.map((item, index) => `
        <div class="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
            <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                    <input type="text" 
                           value="${item.category}" 
                           onchange="updateEditItem(${index}, 'category', this.value)"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold mb-2"
                           placeholder="Categoria">
                    <textarea 
                           onchange="updateEditItem(${index}, 'description', this.value)"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                           rows="3"
                           placeholder="Descrição">${item.description}</textarea>
                </div>
                <button onclick="removeEditItem(${index})" 
                        class="ml-3 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Remover
                </button>
            </div>
            <div class="flex gap-3">
                <div class="flex-1">
                    <label class="text-xs text-gray-600 block mb-1">Preço Unitário</label>
                    <input type="number" 
                           step="0.01" 
                           value="${item.price || 0}" 
                           onchange="updateEditItem(${index}, 'price', parseFloat(this.value))"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                           placeholder="0.00">
                </div>
                <div class="flex-1">
                    <label class="text-xs text-gray-600 block mb-1">Quantidade</label>
                    <input type="number" 
                           value="${item.quantity || 1}" 
                           onchange="updateEditItem(${index}, 'quantity', parseInt(this.value))"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                           placeholder="1">
                </div>
                <div class="flex-1">
                    <label class="text-xs text-gray-600 block mb-1">Subtotal</label>
                    <input type="number" 
                           step="0.01" 
                           value="${item.total}" 
                           onchange="updateEditItem(${index}, 'total', parseFloat(this.value))"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold"
                           placeholder="0.00">
                </div>
            </div>
        </div>
    `).join('');
}

// Atualizar item em edição
function updateEditItem(index, field, value) {
    if (!currentEditingOrder) return;
    
    currentEditingOrder.items[index][field] = value;
    
    // Recalcular subtotal se preço ou quantidade mudou
    if (field === 'price' || field === 'quantity') {
        const item = currentEditingOrder.items[index];
        item.total = (item.price || 0) * (item.quantity || 1);
        renderEditItems(currentEditingOrder.items);
    }
    
    updateEditTotal();
}

// Remover item em edição
function removeEditItem(index) {
    if (!currentEditingOrder) return;
    if (currentEditingOrder.items.length <= 1) {
        alert('O pedido deve ter pelo menos 1 item!');
        return;
    }
    
    if (confirm('Deseja remover este item?')) {
        currentEditingOrder.items.splice(index, 1);
        renderEditItems(currentEditingOrder.items);
        updateEditTotal();
    }
}

// Adicionar novo item
function addEditItem() {
    if (!currentEditingOrder) return;
    
    currentEditingOrder.items.push({
        category: 'Novo Item',
        description: 'Descrição do item',
        price: 0,
        quantity: 1,
        total: 0
    });
    
    renderEditItems(currentEditingOrder.items);
    updateEditTotal();
}

// Atualizar total do pedido
function updateEditTotal() {
    if (!currentEditingOrder) return;
    
    // Somar todos os itens
    const itemsTotal = currentEditingOrder.items.reduce((sum, item) => sum + (item.total || 0), 0);
    
    // Adicionar taxa de entrega se houver
    const deliveryFee = parseFloat(document.getElementById('edit-delivery-fee').value) || 0;
    
    // Calcular desconto PIX se aplicável
    const paymentMethod = document.getElementById('edit-payment-method').value;
    let pixDiscount = 0;
    if (paymentMethod === 'pix') {
        pixDiscount = itemsTotal * 0.10; // 10% de desconto
    }
    
    // Total final
    const total = itemsTotal + deliveryFee - pixDiscount;
    
    // Atualizar no objeto
    currentEditingOrder.deliveryFee = deliveryFee;
    currentEditingOrder.pixDiscount = pixDiscount;
    currentEditingOrder.total = total;
    
    // Mostrar na tela
    document.getElementById('edit-items-total').textContent = `R$ ${itemsTotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('edit-delivery-fee-display').textContent = `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
    document.getElementById('edit-pix-discount-display').textContent = pixDiscount > 0 ? `-R$ ${pixDiscount.toFixed(2).replace('.', ',')}` : 'R$ 0,00';
    document.getElementById('edit-total-display').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Mostrar/ocultar desconto PIX
    if (pixDiscount > 0) {
        document.getElementById('edit-pix-discount-row').classList.remove('hidden');
    } else {
        document.getElementById('edit-pix-discount-row').classList.add('hidden');
    }
}

// Alternar campos de delivery
function toggleEditDeliveryFields() {
    const deliveryType = document.getElementById('edit-delivery-type').value;
    if (deliveryType === 'delivery') {
        document.getElementById('edit-delivery-fields').classList.remove('hidden');
    } else {
        document.getElementById('edit-delivery-fields').classList.add('hidden');
        document.getElementById('edit-delivery-fee').value = 0;
    }
    updateEditTotal();
}

// Alternar campos de dinheiro
function toggleEditMoneyFields() {
    const paymentMethod = document.getElementById('edit-payment-method').value;
    if (paymentMethod === 'money') {
        document.getElementById('edit-money-fields').classList.remove('hidden');
    } else {
        document.getElementById('edit-money-fields').classList.add('hidden');
    }
    updateEditTotal();
}

// Salvar alterações do pedido
function saveEditOrder() {
    if (!currentEditingOrder) return;
    
    // Validar campos obrigatórios
    const customerName = document.getElementById('edit-customer-name').value.trim();
    const customerPhone = document.getElementById('edit-customer-phone').value.trim();
    
    if (!customerName) {
        alert('Por favor, preencha o nome do cliente!');
        return;
    }
    
    if (!customerPhone) {
        alert('Por favor, preencha o telefone do cliente!');
        return;
    }
    
    // Atualizar dados do pedido
    currentEditingOrder.customerName = customerName;
    currentEditingOrder.customerPhone = customerPhone;
    currentEditingOrder.deliveryType = document.getElementById('edit-delivery-type').value;
    currentEditingOrder.paymentMethod = document.getElementById('edit-payment-method').value;
    currentEditingOrder.orderNotes = document.getElementById('edit-order-notes').value;
    
    // Dados de delivery
    if (currentEditingOrder.deliveryType === 'delivery') {
        currentEditingOrder.neighborhood = document.getElementById('edit-neighborhood').value;
        currentEditingOrder.addressStreet = document.getElementById('edit-address-street').value;
        currentEditingOrder.addressNumber = document.getElementById('edit-address-number').value;
        currentEditingOrder.addressComplement = document.getElementById('edit-address-complement').value;
        currentEditingOrder.addressReference = document.getElementById('edit-address-reference').value;
    }
    
    // Dados de pagamento em dinheiro
    if (currentEditingOrder.paymentMethod === 'money') {
        currentEditingOrder.changeAmount = parseFloat(document.getElementById('edit-change-amount').value) || 0;
    }
    
    // Encontrar e atualizar o pedido no array
    const orderIndex = allOrders.findIndex(o => o.id === currentEditingOrder.id);
    if (orderIndex !== -1) {
        allOrders[orderIndex] = currentEditingOrder;
        localStorage.setItem('acai_orders', JSON.stringify(allOrders));
        displayOrders();
        closeEditModal();
        showToast('Pedido atualizado com sucesso!');
    }
}
