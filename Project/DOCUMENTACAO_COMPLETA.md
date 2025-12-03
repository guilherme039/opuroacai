# 📚 Documentação Completa - Sistema de Pedidos de Açaí

## 🎯 Visão Geral do Sistema

Sistema completo de pedidos online para loja de açaí, com funcionalidades de:
- Cardápio interativo
- Carrinho de compras
- Múltiplas formas de pagamento (PIX, Dinheiro, Cartão)
- Sistema de cashback/carteira digital
- Acompanhamento de pedidos em tempo real
- Painel administrativo
- Controle de cardápio

---

## 📁 Estrutura de Arquivos

### Páginas HTML
```
index_test.html          → Página principal (cardápio e pedidos)
carteira.html            → Gestão de carteira/cashback
acompanhamento.html      → Acompanhamento de pedidos
controle.html            → Controle de cardápio (admin)
admin.html               → Painel administrativo
```

### Scripts JavaScript
```
script.js                → Sistema principal de pedidos
carteira.js              → Gestão de carteira
acompanhamento.js        → Acompanhamento de pedidos
controle.js              → Controle de cardápio
admin.js                 → Painel administrativo
wallet-integration.js    → Integração carteira/pedidos
pix-payment.js           → Pagamento PIX (simulado)
pix-payment-real.js      → Pagamento PIX real (PagSeguro)
```

### Estilos
```
Css/system.css           → Estilos do sistema
```

---

## 🔄 Fluxo Principal de Pedidos

### 1. Cliente Navega no Cardápio
- **Arquivo:** `index_test.html` + `script.js`
- Cliente visualiza produtos disponíveis
- Seleciona tamanho, complementos, frutas, coberturas
- Adiciona itens ao carrinho

### 2. Finalização do Pedido
- Cliente preenche dados pessoais
- Escolhe tipo de entrega (delivery/retirada)
- Seleciona forma de pagamento
- Adiciona observações (opcional)

### 3. Processamento do Pagamento

#### PIX (2% desconto)
```javascript
// Linha 3365-3369 (script.js)
if (orderData.paymentMethod === 'pix') {
    pixDiscount = total * 0.02;
}
```

#### Dinheiro
- Cliente informa valor para troco
- Sistema calcula troco necessário

#### Cartão
- Pagamento na entrega/retirada

### 4. Salvamento do Pedido
```javascript
// Linha 3349 (script.js)
function saveOrderToSystem(orderData) {
    // Gera ID único
    const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Carrega pedidos existentes
    const orders = JSON.parse(localStorage.getItem('acai_orders') || '[]');
    
    // Cria objeto do pedido
    const order = {
        id: orderId,
        orderNumber: getNextOrderNumber(),
        date: new Date().toISOString(),
        status: 'pending',
        // ... demais dados
    };
    
    // Salva no localStorage
    orders.push(order);
    localStorage.setItem('acai_orders', JSON.stringify(orders));
    
    return order;
}
```

### 5. Aplicação de Cashback
```javascript
// wallet-integration.js
// 5% do valor total como cashback
const cashbackAmount = orderTotal * 0.05;
```

### 6. Acompanhamento
- Cliente recebe número do pedido
- Pode acompanhar status em tempo real
- Recebe notificações de mudança de status

---

## 💾 Estrutura de Dados

### Pedido Completo
```javascript
{
    // Identificação
    id: 'order_1732896543210_abc123xyz',
    orderNumber: '015',
    date: '2025-11-29T14:30:00.000Z',
    status: 'pending',
    
    // Cliente
    customerName: 'João Silva',
    customerPhone: '(11) 98765-4321',
    
    // Entrega
    deliveryType: 'delivery',
    neighborhood: 'Centro',
    addressStreet: 'Rua das Flores',
    addressNumber: '123',
    addressComplement: 'Apto 45',
    addressReference: 'Próximo ao mercado',
    deliveryFee: 5.00,
    
    // Pagamento
    paymentMethod: 'pix',
    changeAmount: 0,
    pixDiscount: 0.50,
    
    // Pedido
    orderNotes: 'Sem açúcar',
    disposables: true,
    items: [
        {
            category: 'Açaí 500ml',
            description: 'Frutas: Banana, Morango. Complementos: Granola.',
            total: 22.00
        }
    ],
    
    // Valores
    subtotal: 25.00,
    total: 29.50
}
```

### Carteira do Cliente
```javascript
{
    phone: '(11) 98765-4321',
    name: 'João Silva',
    balance: 15.75,
    transactions: [
        {
            id: 'txn_...',
            type: 'cashback',
            amount: 1.25,
            date: '2025-11-29T14:30:00.000Z',
            description: 'Cashback pedido #015'
        }
    ]
}
```

---

## 🔢 Sistema de Numeração

### Numeração Diária de Pedidos
```javascript
// Linha 2752 (script.js)
function getNextOrderNumber() {
    const today = new Date().toDateString();
    let todayData = localStorage.getItem(`orders_${today}`);
    
    if (!todayData) {
        todayData = { count: 1, date: today };
        localStorage.setItem(`orders_${today}`, JSON.stringify(todayData));
        return '001';
    } else {
        const data = JSON.parse(todayData);
        data.count += 1;
        localStorage.setItem(`orders_${today}`, JSON.stringify(data));
        return data.count.toString().padStart(3, '0');
    }
}
```

**Comportamento:**
- Cada dia começa em 001
- Incrementa sequencialmente (002, 003, ...)
- Formato com 3 dígitos (001-999)
- Armazenado separadamente por data

---

## 📊 Status de Pedidos

```javascript
const statusConfig = {
    'pending': {
        icon: '⏳',
        text: 'Pedido Recebido',
        color: 'bg-yellow-100 text-yellow-800'
    },
    'preparing': {
        icon: '👨‍🍳',
        text: 'Em Preparo',
        color: 'bg-blue-100 text-blue-800'
    },
    'ready': {
        icon: '✅',
        text: 'Pronto para Retirada',
        color: 'bg-green-100 text-green-800'
    },
    'out_for_delivery': {
        icon: '🛵',
        text: 'Saiu para Entrega',
        color: 'bg-purple-100 text-purple-800'
    },
    'delivered': {
        icon: '🎉',
        text: 'Entregue',
        color: 'bg-green-100 text-green-800'
    },
    'cancelled': {
        icon: '❌',
        text: 'Cancelado',
        color: 'bg-red-100 text-red-800'
    }
};
```

---

## 💰 Cálculos Financeiros

### Fórmula do Total
```
Total Final = Subtotal + Taxa de Entrega - Desconto PIX
```

### Exemplos

#### Exemplo 1: Delivery com PIX
```
Subtotal:        R$ 25,00
Taxa Entrega:    R$  5,00
Desconto PIX:    R$  0,50 (2%)
─────────────────────────
Total:           R$ 29,50
```

#### Exemplo 2: Retirada com Dinheiro
```
Subtotal:        R$ 25,00
Taxa Entrega:    R$  0,00
Desconto PIX:    R$  0,00
─────────────────────────
Total:           R$ 25,00
```

### Cashback
```
Cashback = Total Final × 5%

Exemplo:
Total: R$ 29,50
Cashback: R$ 1,48
```

---

## 🔐 Armazenamento LocalStorage

### Chaves Utilizadas

| Chave | Conteúdo | Formato |
|-------|----------|---------|
| `acai_orders` | Todos os pedidos | Array de objetos |
| `orders_${date}` | Contador diário | `{count: N, date: "..."}` |
| `acai_wallets` | Carteiras dos clientes | Array de objetos |
| `acai_menu` | Cardápio configurado | Objeto |
| `acai_neighborhoods` | Bairros e taxas | Array |

### Exemplo de Dados
```javascript
// acai_orders
[
    { id: 'order_...', orderNumber: '001', ... },
    { id: 'order_...', orderNumber: '002', ... }
]

// orders_Sat Nov 29 2025
{
    count: 15,
    date: 'Sat Nov 29 2025'
}

// acai_wallets
[
    { phone: '(11) 98765-4321', balance: 15.75, ... },
    { phone: '(11) 91234-5678', balance: 8.50, ... }
]
```

---

## 🔗 Integrações

### 1. Sistema de Carteira
**Arquivo:** `wallet-integration.js`

**Funções:**
- `applyWalletCashback(orderTotal, customerPhone, orderNumber)`
- `getWalletBalance(phone)`
- `useWalletBalance(phone, amount)`

**Fluxo:**
1. Pedido confirmado
2. Calcula 5% de cashback
3. Adiciona ao saldo da carteira
4. Registra transação

### 2. Pagamento PIX
**Arquivos:** `pix-payment.js` (simulado) / `pix-payment-real.js` (PagSeguro)

**Fluxo PIX Simulado:**
1. Gera QR Code fictício
2. Copia código PIX
3. Aguarda confirmação manual
4. Finaliza pedido

**Fluxo PIX Real (PagSeguro):**
1. Cria cobrança via API
2. Gera QR Code real
3. Monitora webhook de confirmação
4. Finaliza pedido automaticamente

### 3. Acompanhamento de Pedidos
**Arquivo:** `acompanhamento.js`

**Funcionalidades:**
- Busca pedido por número
- Exibe detalhes completos
- Atualiza status em tempo real
- Mostra histórico de status

### 4. Painel Administrativo
**Arquivo:** `admin.js`

**Funcionalidades:**
- Lista todos os pedidos
- Filtra por status/data
- Atualiza status dos pedidos
- Visualiza detalhes completos
- Estatísticas de vendas

### 5. Controle de Cardápio
**Arquivo:** `controle.js`

**Funcionalidades:**
- Gerencia produtos e preços
- Configura complementos
- Define bairros e taxas
- Ativa/desativa itens

---

## 🎨 Interface do Usuário

### Tecnologias
- **HTML5** - Estrutura
- **Tailwind CSS** - Estilização
- **JavaScript Vanilla** - Lógica

### Componentes Principais

#### 1. Cardápio Interativo
- Cards de produtos
- Seleção de tamanhos
- Escolha de complementos
- Visualização de preços

#### 2. Carrinho de Compras
- Lista de itens
- Edição de quantidades
- Remoção de itens
- Cálculo automático

#### 3. Formulário de Checkout
- Dados pessoais
- Endereço de entrega
- Seleção de pagamento
- Observações

#### 4. Modais
- Confirmação de pagamento
- QR Code PIX
- Sucesso do pedido
- Erros e validações

---

## 🚀 Fluxo de Desenvolvimento

### Para Adicionar Novo Produto
1. Abrir `controle.html`
2. Adicionar produto no painel
3. Definir preço e opções
4. Salvar configurações

### Para Adicionar Novo Bairro
1. Abrir `controle.html`
2. Ir em "Bairros e Taxas"
3. Adicionar bairro e taxa
4. Salvar

### Para Modificar Status de Pedido
1. Abrir `admin.html`
2. Localizar pedido
3. Clicar em "Alterar Status"
4. Selecionar novo status

---

## ⚠️ Limitações e Considerações

### LocalStorage
- **Limite:** ~5-10MB por domínio
- **Persistência:** Dados locais ao navegador
- **Sincronização:** Não há entre dispositivos
- **Backup:** Não há automático

### Recomendações
1. **Implementar limpeza periódica** de pedidos antigos
2. **Considerar migração para backend** para produção
3. **Adicionar exportação de dados** para backup
4. **Implementar sincronização** se múltiplos dispositivos

### Segurança
- Dados armazenados localmente (não criptografados)
- Sem autenticação de usuário
- Adequado para MVP/protótipo
- Necessita backend para produção

---

## 📱 Responsividade

Sistema totalmente responsivo:
- ✅ Desktop (1920px+)
- ✅ Laptop (1024px-1919px)
- ✅ Tablet (768px-1023px)
- ✅ Mobile (320px-767px)

---

## 🔧 Manutenção

### Arquivos de Documentação
```
ANALISE_PROJETO.md              → Análise inicial
ESTRUTURA_PROJETO.md            → Estrutura de arquivos
FLUXO_PEDIDOS_COMPLETO.md       → Fluxo detalhado de pedidos
DOCUMENTACAO_COMPLETA.md        → Este arquivo
CARTEIRA_CASHBACK.md            → Sistema de carteira
CONTROLE_CARDAPIO.md            → Controle de cardápio
ACOMPANHAMENTO_PEDIDOS.md       → Sistema de acompanhamento
PIX_REAL_PAGSEGURO.md           → Integração PagSeguro
```

### Logs e Debug
- Console do navegador para erros
- LocalStorage para inspeção de dados
- DevTools para análise de rede

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consultar documentação específica
2. Verificar console do navegador
3. Inspecionar localStorage
4. Revisar código fonte comentado

---

**Última atualização:** 29/11/2025  
**Versão do Sistema:** 1.0  
**Status:** Documentação Completa ✅
