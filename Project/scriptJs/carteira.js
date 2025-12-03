// Sistema de Carteira e Cashback

// Configurações padrão
const defaultSettings = {
    cashbackPercentage: 2.0,
    minUsage: 10.00,
    active: true
};

// Load settings
function loadSettings() {
    const saved = localStorage.getItem('acai_cashback_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
}

// Save settings
function saveSettingsData(settings) {
    localStorage.setItem('acai_cashback_settings', JSON.stringify(settings));
}

// Load wallets
function loadWallets() {
    const saved = localStorage.getItem('acai_wallets');
    return saved ? JSON.parse(saved) : {};
}

// Save wallets
function saveWallets(wallets) {
    localStorage.setItem('acai_wallets', JSON.stringify(wallets));
}

let settings = loadSettings();
let wallets = loadWallets();

// Calculate cashback for an order
function calculateCashback(orderTotal) {
    if (!settings.active) return 0;
    return (orderTotal * settings.cashbackPercentage) / 100;
}

// Add cashback to customer wallet
function addCashback(phone, name, amount, reason = 'Cashback de pedido') {
    if (!wallets[phone]) {
        wallets[phone] = {
            name: name,
            phone: phone,
            balance: 0,
            totalEarned: 0,
            totalUsed: 0,
            transactions: []
        };
    }
    
    wallets[phone].balance += amount;
    wallets[phone].totalEarned += amount;
    wallets[phone].transactions.push({
        date: new Date().toISOString(),
        type: 'credit',
        amount: amount,
        reason: reason,
        balance: wallets[phone].balance
    });
    
    saveWallets(wallets);
}

// Use cashback from customer wallet
function useCashback(phone, amount, reason = 'Usado em pedido') {
    if (!wallets[phone]) return false;
    if (wallets[phone].balance < amount) return false;
    if (wallets[phone].balance < settings.minUsage) return false;
    
    wallets[phone].balance -= amount;
    wallets[phone].totalUsed += amount;
    wallets[phone].transactions.push({
        date: new Date().toISOString(),
        type: 'debit',
        amount: amount,
        reason: reason,
        balance: wallets[phone].balance
    });
    
    saveWallets(wallets);
    return true;
}

// Get customer wallet
function getWallet(phone) {
    return wallets[phone] || null;
}

// Display customers
function displayCustomers() {
    const container = document.getElementById('customers-container');
    const emptyState = document.getElementById('empty-state');
    const searchTerm = document.getElementById('search-customer').value.toLowerCase();
    
    // Filter customers
    let filteredWallets = Object.values(wallets).filter(wallet => {
        return wallet.name.toLowerCase().includes(searchTerm) ||
               wallet.phone.includes(searchTerm);
    });
    
    // Sort by balance (highest first)
    filteredWallets.sort((a, b) => b.balance - a.balance);
    
    if (filteredWallets.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    container.innerHTML = filteredWallets.map(wallet => createWalletCard(wallet)).join('');
    
    // Update stats
    updateStats();
}

// Create wallet card
function createWalletCard(wallet) {
    const canUse = wallet.balance >= settings.minUsage;
    const lastTransaction = wallet.transactions[wallet.transactions.length - 1];
    
    return `
        <div class="bg-white rounded-xl p-6 card-shadow">
            <!-- Customer Header -->
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-primary">${wallet.name}</h3>
                    <p class="text-sm text-gray-600">${wallet.phone}</p>
                    ${lastTransaction ? `
                        <p class="text-xs text-gray-500 mt-1">
                            Última movimentação: ${formatDate(lastTransaction.date)}
                        </p>
                    ` : ''}
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-600 mb-1">Saldo Disponível</div>
                    <div class="text-3xl font-bold ${canUse ? 'text-green-600' : 'text-gray-400'}">
                        R$ ${wallet.balance.toFixed(2).replace('.', ',')}
                    </div>
                    ${!canUse ? `
                        <div class="text-xs text-gray-500 mt-1">
                            Mínimo: R$ ${settings.minUsage.toFixed(2).replace('.', ',')}
                        </div>
                    ` : `
                        <div class="text-xs text-green-600 mt-1">
                            ✓ Pode usar
                        </div>
                    `}
                </div>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-green-50 rounded-lg p-3">
                    <div class="text-xs text-gray-600 mb-1">Total Ganho</div>
                    <div class="text-lg font-bold text-green-600">
                        R$ ${wallet.totalEarned.toFixed(2).replace('.', ',')}
                    </div>
                </div>
                <div class="bg-blue-50 rounded-lg p-3">
                    <div class="text-xs text-gray-600 mb-1">Total Usado</div>
                    <div class="text-lg font-bold text-blue-600">
                        R$ ${wallet.totalUsed.toFixed(2).replace('.', ',')}
                    </div>
                </div>
            </div>
            
            <!-- Transactions -->
            <div class="mb-4">
                <button onclick="toggleTransactions('${wallet.phone}')" 
                        class="text-sm text-primary hover:text-purple-800 font-medium">
                    📋 Ver Histórico (${wallet.transactions.length} movimentações)
                </button>
                <div id="transactions-${wallet.phone}" class="hidden mt-3 space-y-2 max-h-60 overflow-y-auto">
                    ${wallet.transactions.slice().reverse().map(t => `
                        <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div class="flex-1">
                                <div class="text-sm font-medium ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}">
                                    ${t.type === 'credit' ? '+ R$' : '- R$'} ${t.amount.toFixed(2).replace('.', ',')}
                                </div>
                                <div class="text-xs text-gray-600">${t.reason}</div>
                                <div class="text-xs text-gray-500">${formatDate(t.date)}</div>
                            </div>
                            <div class="text-xs text-gray-500">
                                Saldo: R$ ${t.balance.toFixed(2).replace('.', ',')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2">
                <button onclick="showAddCreditModalFor('${wallet.phone}', '${wallet.name}')" 
                        class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    ➕ Adicionar Crédito
                </button>
                <button onclick="showUseCreditModal('${wallet.phone}', '${wallet.name}', ${wallet.balance})" 
                        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        ${!canUse ? 'disabled' : ''}>
                    💳 Usar Crédito
                </button>
                <button onclick="deleteWallet('${wallet.phone}')" 
                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

// Toggle transactions visibility
function toggleTransactions(phone) {
    const element = document.getElementById(`transactions-${phone}`);
    element.classList.toggle('hidden');
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

// Update stats
function updateStats() {
    const totalCustomers = Object.keys(wallets).length;
    const totalCashback = Object.values(wallets).reduce((sum, w) => sum + w.totalEarned, 0);
    const usedCashback = Object.values(wallets).reduce((sum, w) => sum + w.totalUsed, 0);
    
    document.getElementById('total-customers').textContent = totalCustomers;
    document.getElementById('total-cashback').textContent = `R$ ${totalCashback.toFixed(2).replace('.', ',')}`;
    document.getElementById('used-cashback').textContent = `R$ ${usedCashback.toFixed(2).replace('.', ',')}`;
}

// Show add credit modal
function showAddCreditModal() {
    document.getElementById('add-credit-modal').classList.remove('hidden');
    document.getElementById('manual-phone').value = '';
    document.getElementById('manual-name').value = '';
    document.getElementById('manual-amount').value = '';
    document.getElementById('manual-reason').value = '';
}

function showAddCreditModalFor(phone, name) {
    document.getElementById('add-credit-modal').classList.remove('hidden');
    document.getElementById('manual-phone').value = phone;
    document.getElementById('manual-name').value = name;
    document.getElementById('manual-amount').value = '';
    document.getElementById('manual-reason').value = 'Crédito adicional';
}

function closeAddCreditModal() {
    document.getElementById('add-credit-modal').classList.add('hidden');
}

// Add manual credit
function addManualCredit() {
    const phone = document.getElementById('manual-phone').value.trim();
    const name = document.getElementById('manual-name').value.trim();
    const amount = parseFloat(document.getElementById('manual-amount').value);
    const reason = document.getElementById('manual-reason').value.trim() || 'Crédito manual';
    
    if (!phone || !name || isNaN(amount) || amount <= 0) {
        showToast('❌ Preencha todos os campos corretamente!', 'error');
        return;
    }
    
    addCashback(phone, name, amount, reason);
    closeAddCreditModal();
    displayCustomers();
    showToast(`✅ R$ ${amount.toFixed(2)} adicionado para ${name}!`, 'success');
}

// Show use credit modal
function showUseCreditModal(phone, name, balance) {
    const amount = prompt(`Quanto ${name} deseja usar?\nSaldo disponível: R$ ${balance.toFixed(2)}\n\nDigite o valor:`);
    if (!amount) return;
    
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
        showToast('❌ Valor inválido!', 'error');
        return;
    }
    
    if (value > balance) {
        showToast('❌ Saldo insuficiente!', 'error');
        return;
    }
    
    if (useCashback(phone, value, 'Usado manualmente')) {
        displayCustomers();
        showToast(`✅ R$ ${value.toFixed(2)} debitado de ${name}!`, 'success');
    } else {
        showToast('❌ Erro ao usar crédito!', 'error');
    }
}

// Delete wallet
function deleteWallet(phone) {
    if (confirm('Tem certeza que deseja excluir esta carteira?')) {
        delete wallets[phone];
        saveWallets(wallets);
        displayCustomers();
        showToast('🗑️ Carteira excluída!', 'info');
    }
}

// Show settings modal
function showCashbackSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
    document.getElementById('cashback-percentage').value = settings.cashbackPercentage;
    document.getElementById('min-usage').value = settings.minUsage;
    document.getElementById('cashback-active').checked = settings.active;
}

function closeSettingsModal() {
    document.getElementById('settings-modal').classList.add('hidden');
}

// Save settings
function saveSettings() {
    settings.cashbackPercentage = parseFloat(document.getElementById('cashback-percentage').value);
    settings.minUsage = parseFloat(document.getElementById('min-usage').value);
    settings.active = document.getElementById('cashback-active').checked;
    
    saveSettingsData(settings);
    closeSettingsModal();
    showToast('⚙️ Configurações salvas!', 'success');
}

// Show toast
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 font-medium ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Search functionality
document.getElementById('search-customer').addEventListener('input', displayCustomers);

// Initialize
displayCustomers();

// Export functions for external use
window.acaiWallet = {
    addCashback,
    useCashback,
    getWallet,
    calculateCashback,
    settings: () => settings
};
