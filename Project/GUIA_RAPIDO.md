# ⚡ Guia Rápido - Sistema de Pedidos

## 🎯 Acesso Rápido

### Páginas do Sistema
```
📱 Cliente
├─ index_test.html          → Fazer pedido
├─ acompanhamento.html      → Acompanhar pedido
└─ carteira.html            → Ver cashback

🔧 Administração
├─ admin.html               → Gerenciar pedidos
└─ controle.html            → Configurar cardápio
```

---

## 🔍 Localização de Funções Principais

### script.js

| Função | Linha | O que faz |
|--------|-------|-----------|
| `saveOrderToSystem()` | 3349 | Salva pedido no localStorage |
| `getNextOrderNumber()` | 2752 | Gera número do pedido |
| `submitOrder()` | ~2640 | Processa submissão |
| `calculateTotal()` | - | Calcula total do carrinho |

### wallet-integration.js

| Função | O que faz |
|--------|-----------|
| `applyWalletCashback()` | Aplica 5% de cashback |
| `getWalletBalance()` | Consulta saldo |
| `useWalletBalance()` | Usa saldo na compra |

### acompanhamento.js

| Função | Linha | O que faz |
|--------|-------|-----------|
| `loadOrderDetails()` | 73 | Carrega dados do pedido |
| `displayOrder()` | ~98 | Exibe pedido na tela |
| `updateOrderStatus()` | - | Atualiza status |

---

## 💾 LocalStorage - Chaves

```javascript
// Pedidos
localStorage.getItem('acai_orders')           // Array de pedidos
localStorage.getItem('orders_Sat Nov 29 2025') // Contador do dia

// Carteiras
localStorage.getItem('acai_wallets')          // Array de carteiras

// Configurações
localStorage.getItem('acai_menu')             // Cardápio
localStorage.getItem('acai_neighborhoods')    // Bairros e taxas
```

---

## 🔄 Fluxo Simplificado

```
Cliente → Cardápio → Carrinho → Checkout → Pagamento → Confirmação
                                                ↓
                                           Cashback 5%
                                                ↓
                                         Acompanhamento
```

---

## 💰 Cálculos

### Total do Pedido
```javascript
Total = Subtotal + Taxa Entrega - Desconto PIX
```

### Desconto PIX
```javascript
Desconto = Subtotal × 2%
```

### Cashback
```javascript
Cashback = Total Final × 5%
```

---

## 📊 Status de Pedidos

| Status | Ícone | Descrição |
|--------|-------|-----------|
| `pending` | ⏳ | Pedido Recebido |
| `preparing` | 👨‍🍳 | Em Preparo |
| `ready` | ✅ | Pronto |
| `out_for_delivery` | 🛵 | Saiu para Entrega |
| `delivered` | 🎉 | Entregue |
| `cancelled` | ❌ | Cancelado |

---

## 🛠️ Comandos Úteis (Console)

### Ver todos os pedidos
```javascript
JSON.parse(localStorage.getItem('acai_orders'))
```

### Ver pedido específico
```javascript
const orders = JSON.parse(localStorage.getItem('acai_orders'));
orders.find(o => o.orderNumber === '015')
```

### Ver contador do dia
```javascript
const today = new Date().toDateString();
JSON.parse(localStorage.getItem(`orders_${today}`))
```

### Ver todas as carteiras
```javascript
JSON.parse(localStorage.getItem('acai_wallets'))
```

### Limpar pedidos (CUIDADO!)
```javascript
localStorage.removeItem('acai_orders')
```

### Resetar contador do dia
```javascript
const today = new Date().toDateString();
localStorage.removeItem(`orders_${today}`)
```

---

## 🐛 Debug Rápido

### Pedido não aparece no acompanhamento?
1. Verificar se foi salvo: `localStorage.getItem('acai_orders')`
2. Verificar número do pedido
3. Verificar console por erros

### Cashback não foi aplicado?
1. Verificar `wallet-integration.js` carregado
2. Verificar telefone do cliente
3. Verificar console por erros

### Número do pedido não incrementa?
1. Verificar `orders_${today}` no localStorage
2. Verificar função `getNextOrderNumber()`
3. Limpar contador se necessário

---

## 📝 Estrutura do Pedido (Resumida)

```javascript
{
    id: 'order_...',
    orderNumber: '015',
    status: 'pending',
    customerName: 'Nome',
    customerPhone: '(11) 99999-9999',
    deliveryType: 'delivery',
    paymentMethod: 'pix',
    items: [...],
    total: 29.50
}
```

---

## 🚀 Tarefas Comuns

### Adicionar Produto
1. Abrir `controle.html`
2. Preencher formulário
3. Salvar

### Alterar Status do Pedido
1. Abrir `admin.html`
2. Localizar pedido
3. Clicar "Alterar Status"

### Ver Saldo de Cliente
1. Abrir `carteira.html`
2. Digitar telefone
3. Ver saldo e histórico

### Configurar Taxa de Entrega
1. Abrir `controle.html`
2. Seção "Bairros"
3. Adicionar/editar

---

## ⚠️ Atenções

- ✅ Numeração reseta todo dia (001, 002, ...)
- ✅ Dados são locais (por navegador)
- ✅ Cashback é automático (5%)
- ✅ Desconto PIX é automático (2%)
- ⚠️ LocalStorage tem limite (~5-10MB)
- ⚠️ Sem backup automático

---

## 📞 Arquivos de Ajuda

| Dúvida sobre... | Ver arquivo... |
|-----------------|----------------|
| Estrutura geral | `DOCUMENTACAO_COMPLETA.md` |
| Fluxo de pedidos | `FLUXO_PEDIDOS_COMPLETO.md` |
| Sistema de carteira | `CARTEIRA_CASHBACK.md` |
| Controle de cardápio | `CONTROLE_CARDAPIO.md` |
| Acompanhamento | `ACOMPANHAMENTO_PEDIDOS.md` |
| Pagamento PIX | `PIX_REAL_PAGSEGURO.md` |

---

**Dica:** Mantenha o console do navegador aberto (F12) para ver logs e erros em tempo real!

---

**Última atualização:** 29/11/2025
