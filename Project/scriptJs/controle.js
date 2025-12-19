// Controle de Cardápio - Sistema de Gerenciamento

// Estrutura de dados padrão do cardápio
const defaultMenuData = {
    tamanhos: {
        tigela: [
            { id: 'tigela-350', name: '350ml', price: 12.00, active: true, stock: 'unlimited' },
            { id: 'tigela-500', name: '500ml', price: 14.00, active: true, stock: 'unlimited' },
            { id: 'tigela-750', name: '750ml', price: 17.00, active: true, stock: 'unlimited' }
        ],
        copo: [
            { id: 'copo-300', name: '300ml', price: 12.00, active: true, stock: 'unlimited' },
            { id: 'copo-500', name: '500ml', price: 14.00, active: true, stock: 'unlimited' },
            { id: 'copo-700', name: '700ml', price: 17.00, active: true, stock: 'unlimited' }
        ],
        batido: [
            { id: 'batido-300', name: '300ml', price: 9.00, active: true, stock: 'unlimited' },
            { id: 'batido-500', name: '500ml', price: 11.00, active: true, stock: 'unlimited' }
        ],
        maisPedidos: [
            { id: 'mais-350', name: '350ml', price: 26.00, active: true, stock: 'unlimited' },
            { id: 'mais-500', name: '500ml', price: 29.00, active: true, stock: 'unlimited' },
            { id: 'mais-700', name: '700ml', price: 33.00, active: true, stock: 'unlimited' }
        ]
    },
    prontas: [
        { id: 'batido-ready', name: 'Batido', price: 15.00, size: '500ml', active: true, stock: 'unlimited' },
        { id: 'tradicional-ready', name: 'Tradicional', price: 25.00, size: '500ml', active: true, stock: 'unlimited' },
        { id: 'kids-ready', name: 'Kids', price: 29.00, size: '500ml', active: true, stock: 'unlimited' },
        { id: 'especial-ready', name: 'Especial', price: 30.00, size: '500ml', active: true, stock: 'unlimited' },
        { id: 'tropical-ready', name: 'Tropical', price: 32.00, size: '500ml', active: true, stock: 'unlimited' },
        { id: 'premium-ready', name: 'Premium', price: 40.00, size: '500ml', active: true, stock: 'unlimited' }
    ],
    complementos: {
        frutas: [
            { id: 'banana', name: 'Banana', price: 2.00, active: true, stock: 'unlimited' },
            { id: 'morango', name: 'Morango', price: 2.00, active: true, stock: 'unlimited' },
            { id: 'uva', name: 'Uva', price: 2.00, active: true, stock: 'unlimited' },
            { id: 'abacaxi', name: 'Abacaxi', price: 2.00, active: true, stock: 'unlimited' },
            { id: 'kiwi', name: 'Kiwi', price: 2.00, active: true, stock: 'unlimited' }
        ],
        complementos: [
            { id: 'granola', name: 'Granola', price: 2.00, active: true, stock: 'unlimited' },
            { id: 'aveia', name: 'Aveia', price: 2.00, active: true, stock: 'unlimited' },
            { id: 'leite-po', name: 'Leite em Pó', price: 2.00, active: true, stock: 'unlimited' },
            { id: 'paçoca', name: 'Paçoca', price: 2.00, active: true, stock: 'unlimited' }
        ],
        coberturas: [
            { id: 'mel', name: 'Mel', price: 2.00, active: true, stock: 'unlimited' },
            { id: 'nutella', name: 'Nutella', price: 3.00, active: true, stock: 'unlimited' },
            { id: 'leite-condensado', name: 'Leite Condensado', price: 2.00, active: true, stock: 'unlimited' }
        ]
    },
    combos: [
        { id: 'leveza', name: 'Combo Leveza', price: 42.00, items: 2, active: true, stock: 'unlimited' },
        { id: 'energia-boa', name: 'Combo Energia Boa', price: 45.00, items: 2, active: true, stock: 'unlimited' },
        { id: 'classico', name: 'Combo Clássico', price: 46.00, items: 2, active: true, stock: 'unlimited' },
        { id: 'doce-encontro', name: 'Combo Doce Encontro', price: 48.00, items: 2, active: true, stock: 'unlimited' },
        { id: 'sabor-verao', name: 'Combo Sabor de Verão', price: 50.00, items: 2, active: true, stock: 'unlimited' },
        { id: 'gourmet', name: 'Combo Gourmet', price: 56.00, items: 2, active: true, stock: 'unlimited' },
        { id: 'realeza', name: 'Combo Realeza', price: 58.00, items: 2, active: true, stock: 'unlimited' },
        { id: 'alegria', name: 'Combo Alegria', price: 60.00, items: 2, active: true, stock: 'unlimited' },
        { id: 'rei-sabor', name: 'Combo Rei do Sabor', price: 65.00, items: 2, active: true, stock: 'unlimited' },
        { id: 'tres-sabores', name: 'Combo Três Sabores', price: 74.00, items: 3, active: true, stock: 'unlimited' },
        { id: 'topzera', name: 'Combo Topzera', price: 88.00, items: 3, active: true, stock: 'unlimited' }
    ]
};

// Load menu data from localStorage or use defaults
function loadMenuData() {
    const saved = localStorage.getItem('acai_menu_data');
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultMenuData));
}

// Save menu data to localStorage
function saveMenuData(data) {
    localStorage.setItem('acai_menu_data', JSON.stringify(data));
}

// Current menu data
let menuData = loadMenuData();

// Tab management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active', 'bg-primary', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    
    // Show selected tab
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    
    // Add active class to selected button
    const activeBtn = document.getElementById(`tab-${tabName}`);
    activeBtn.classList.add('active', 'bg-primary', 'text-white');
    activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
}

// Render tamanhos
function renderTamanhos() {
    const container = document.getElementById('tamanhos-list');
    let html = '';
    
    Object.keys(menuData.tamanhos).forEach(category => {
        const categoryName = {
            'tigela': '🥄 Tigela',
            'copo': '🥤 Copo',
            'batido': '🥤 Batido',
            'maisPedidos': '⭐ Mais Pedidos'
        }[category];
        
        html += `
            <div class="border-b border-gray-200 pb-4 mb-4">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <h3 class="font-bold text-primary">${categoryName}</h3>
                        <button onclick="editCategoryName('tamanhos', '${category}')"
                                class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors">
                            ✏️ Editar
                        </button>
                    </div>
                    <button onclick="addNewItem('tamanhos', '${category}')"
                            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
                        ➕ Adicionar Item
                    </button>
                </div>
                <div class="space-y-2">
                    ${menuData.tamanhos[category].map(item => createItemCard(item, 'tamanhos', category)).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Render opções prontas
function renderProntas() {
    const container = document.getElementById('prontas-list');
    let html = `
        <div class="flex justify-end mb-4">
            <button onclick="addNewItem('prontas')"
                    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
                ➕ Adicionar Opção Pronta
            </button>
        </div>
        <div class="space-y-2">
            ${menuData.prontas.map(item => createItemCard(item, 'prontas')).join('')}
        </div>
    `;
    container.innerHTML = html;
}

// Render complementos
function renderComplementos() {
    const container = document.getElementById('complementos-list');
    let html = '';
    
    Object.keys(menuData.complementos).forEach(category => {
        const categoryName = {
            'frutas': '🍓 Frutas',
            'complementos': '🥜 Complementos',
            'coberturas': '🍯 Coberturas'
        }[category];
        
        html += `
            <div class="border-b border-gray-200 pb-4 mb-4">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <h3 class="font-bold text-primary">${categoryName}</h3>
                        <button onclick="editCategoryName('complementos', '${category}')"
                                class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors">
                            ✏️ Editar
                        </button>
                    </div>
                    <button onclick="addNewItem('complementos', '${category}')"
                            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
                        ➕ Adicionar Item
                    </button>
                </div>
                <div class="space-y-2">
                    ${menuData.complementos[category].map(item => createItemCard(item, 'complementos', category)).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Render combos
function renderCombos() {
    const container = document.getElementById('combos-list');
    let html = `
        <div class="flex justify-end mb-4">
            <button onclick="addNewItem('combos')"
                    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
                ➕ Adicionar Combo
            </button>
        </div>
        <div class="space-y-2">
            ${menuData.combos.map(item => createItemCard(item, 'combos')).join('')}
        </div>
    `;
    container.innerHTML = html;
}

// Create item card HTML
function createItemCard(item, type, subtype = null) {
    const stockOptions = ['unlimited', '10', '20', '30', '50', '100', '0'];
    const stockLabels = {
        'unlimited': 'Ilimitado',
        '0': 'Esgotado'
    };
    
    return `
        <div class="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
            <!-- Active Toggle -->
            <div class="flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                           ${item.active ? 'checked' : ''} 
                           onchange="toggleItemActive('${type}', '${item.id}', '${subtype}')"
                           class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
            
            <!-- Item Info -->
            <div class="flex-1">
                <div class="font-medium text-gray-900">${item.name}</div>
                ${item.size ? `<div class="text-xs text-gray-500">${item.size}</div>` : ''}
                ${item.items ? `<div class="text-xs text-gray-500">${item.items} itens</div>` : ''}
            </div>
            
            <!-- Price Input -->
            <div class="w-32">
                <label class="text-xs text-gray-600 block mb-1">Preço</label>
                <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500">R$</span>
                    <input type="number" 
                           step="0.01" 
                           value="${item.price.toFixed(2)}"
                           onchange="updateItemPrice('${type}', '${item.id}', this.value, '${subtype}')"
                           class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                </div>
            </div>
            
            <!-- Stock Select -->
            <div class="w-32">
                <label class="text-xs text-gray-600 block mb-1">Estoque</label>
                <select onchange="updateItemStock('${type}', '${item.id}', this.value, '${subtype}')"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    ${stockOptions.map(opt => `
                        <option value="${opt}" ${item.stock === opt ? 'selected' : ''}>
                            ${stockLabels[opt] || opt + ' un.'}
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <!-- Remove Button -->
            <div>
                <button onclick="removeItem('${type}', '${item.id}', '${subtype}')"
                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
                    🗑️ Remover
                </button>
            </div>
        </div>
    `;
}

// Toggle item active status
function toggleItemActive(type, id, subtype) {
    if (type === 'tamanhos') {
        const item = menuData.tamanhos[subtype].find(i => i.id === id);
        if (item) item.active = !item.active;
    } else if (type === 'complementos') {
        const item = menuData.complementos[subtype].find(i => i.id === id);
        if (item) item.active = !item.active;
    } else {
        const item = menuData[type].find(i => i.id === id);
        if (item) item.active = !item.active;
    }
}

// Update item price
function updateItemPrice(type, id, price, subtype) {
    const newPrice = parseFloat(price);
    if (isNaN(newPrice) || newPrice < 0) return;
    
    if (type === 'tamanhos') {
        const item = menuData.tamanhos[subtype].find(i => i.id === id);
        if (item) item.price = newPrice;
    } else if (type === 'complementos') {
        const item = menuData.complementos[subtype].find(i => i.id === id);
        if (item) item.price = newPrice;
    } else {
        const item = menuData[type].find(i => i.id === id);
        if (item) item.price = newPrice;
    }
}

// Update item stock
function updateItemStock(type, id, stock, subtype) {
    if (type === 'tamanhos') {
        const item = menuData.tamanhos[subtype].find(i => i.id === id);
        if (item) item.stock = stock;
    } else if (type === 'complementos') {
        const item = menuData.complementos[subtype].find(i => i.id === id);
        if (item) item.stock = stock;
    } else {
        const item = menuData[type].find(i => i.id === id);
        if (item) item.stock = stock;
    }
}

// Save all changes
function saveAllChanges() {
    saveMenuData(menuData);
    showToast('✅ Alterações salvas com sucesso!', 'success');
}

// Reset to defaults
function resetToDefaults() {
    if (confirm('Tem certeza que deseja restaurar todos os valores padrão? Esta ação não pode ser desfeita!')) {
        menuData = JSON.parse(JSON.stringify(defaultMenuData));
        saveMenuData(menuData);
        renderAll();
        showToast('🔄 Valores padrão restaurados!', 'info');
    }
}

// Export data
function exportData() {
    const dataStr = JSON.stringify(menuData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cardapio-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('📥 Dados exportados com sucesso!', 'success');
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 font-medium ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Render all sections
function renderAll() {
    renderTamanhos();
    renderProntas();
    renderComplementos();
    renderCombos();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    
    // Set initial tab styles
    document.querySelectorAll('.tab-button').forEach(btn => {
        if (!btn.classList.contains('active')) {
            btn.classList.add('bg-gray-100', 'text-gray-700');
        }
    });
});

// Auto-save every 30 seconds
setInterval(() => {
    saveMenuData(menuData);
}, 30000);


// ============================================
// ADICIONAR E REMOVER ITENS
// ============================================

// Adicionar novo item
function addNewItem(type, subtype = null) {
    const itemName = prompt('Nome do item:');
    if (!itemName) return;
    
    const itemPrice = parseFloat(prompt('Preço (R$):'));
    if (isNaN(itemPrice) || itemPrice < 0) {
        alert('Preço inválido!');
        return;
    }
    
    const newItem = {
        id: `custom-${Date.now()}`,
        name: itemName,
        price: itemPrice,
        active: true,
        stock: 'unlimited'
    };
    
    // Adicionar item na estrutura correta
    if (type === 'tamanhos' && subtype) {
        menuData.tamanhos[subtype].push(newItem);
    } else if (type === 'complementos' && subtype) {
        menuData.complementos[subtype].push(newItem);
    } else if (type === 'prontas') {
        newItem.size = '500ml';
        menuData.prontas.push(newItem);
    } else if (type === 'combos') {
        const items = parseInt(prompt('Quantos itens no combo?'));
        if (isNaN(items) || items < 1) {
            alert('Quantidade inválida!');
            return;
        }
        newItem.items = items;
        menuData.combos.push(newItem);
    }
    
    saveMenuData(menuData);
    renderAll();
    showToast(`✅ Item "${itemName}" adicionado com sucesso!`, 'success');
}

// Remover item
function removeItem(type, id, subtype = null) {
    if (!confirm('Tem certeza que deseja remover este item?')) return;
    
    if (type === 'tamanhos' && subtype) {
        menuData.tamanhos[subtype] = menuData.tamanhos[subtype].filter(i => i.id !== id);
    } else if (type === 'complementos' && subtype) {
        menuData.complementos[subtype] = menuData.complementos[subtype].filter(i => i.id !== id);
    } else {
        menuData[type] = menuData[type].filter(i => i.id !== id);
    }
    
    saveMenuData(menuData);
    renderAll();
    showToast('🗑️ Item removido com sucesso!', 'success');
}

// Renderizar tudo novamente
function renderAll() {
    renderTamanhos();
    renderProntas();
    renderComplementos();
    renderCombos();
}

// Editar nome da categoria
function editCategoryName(type, subtype = null) {
    let currentName = '';
    
    if (type === 'tamanhos' && subtype) {
        const names = {
            'tigela': 'Tigela',
            'copo': 'Copo',
            'batido': 'Batido',
            'maisPedidos': 'Mais Pedidos'
        };
        currentName = names[subtype];
    } else if (type === 'complementos' && subtype) {
        const names = {
            'frutas': 'Frutas',
            'complementos': 'Complementos',
            'coberturas': 'Coberturas'
        };
        currentName = names[subtype];
    }
    
    const newName = prompt(`Editar nome da categoria "${currentName}":`, currentName);
    if (!newName || newName === currentName) return;
    
    // Salvar novo nome (para exibição futura)
    if (!menuData.categoryNames) menuData.categoryNames = {};
    if (type === 'tamanhos' && subtype) {
        menuData.categoryNames[`tamanhos_${subtype}`] = newName;
    } else if (type === 'complementos' && subtype) {
        menuData.categoryNames[`complementos_${subtype}`] = newName;
    }
    
    saveMenuData(menuData);
    renderAll();
    showToast(`✅ Categoria renomeada para "${newName}"!`, 'success');
}
