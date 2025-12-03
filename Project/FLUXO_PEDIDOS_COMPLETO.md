# Fluxo Completo de Pedidos - Sistema de Açaí

## 📋 Visão Geral

Este documento detalha o fluxo completo de como os pedidos são criados, salvos e gerenciados no sistema.

---

## 🔄 Fluxo Principal de Pedidos

### 1. **Criação do Pedido (script.js)**

#### Localização: Linha ~3055
```javascript
const savedOrder = saveOrderToSystem(orderData);
```

#### Função: `saveOrderToSystem(orderData)` - Linha 3349

**Responsabilidades:**
- Gera ID único para o pedido
- Carrega pedidos existentes do localStorage
- Calcula taxa de entrega
- Calcula desconto PIX (2%)
- Formata itens do carrinho
- Cria objeto do pedido
- Salva no localStorage

---

## 📦 Estrutura do Objeto de Pedido

```javascript
{
    id: 'order_1234567890_abc123',           // ID único gerado
    orderNumber: '001',                       // Número sequencial do dia
    date: '2024-01-01T12:00:00.000Z',        // ISO timestamp
    status: 'pending',                        // Status inicial
    
    // Dados do Cliente
    customerName: 'Nome do Cliente',
    customerPhone: '(11) 99999-9999',
    
    // Dados de Entrega
    deliveryType: 'delivery' | 'pickup',
    neighborhood: 'Nome do Bairro',
    addressStreet: 'Rua Exemplo',
    addressNumber: '123',
    addressComplement: 'Apto 45',
    addressReference: 'Próximo ao mercado',
    deliveryFee: 5.00,
    
    // Dados de Pagamento
    paymentMethod: 'pix' | 'money' | 'card',
    changeAmount: 50.00,                      // Apenas para dinheiro
    pixDiscount: 0.50,                        // 2% do subtotal
    
    // Dados do Pedido
    orderNotes: 'Observações do cliente',
    disposables: true | false,
    items: [
        {
            category: 'Açaí 300ml',
            description: 'Frutas: Banana, Morango. Complementos: Granola.',
            total: 15.00
        }
    ],
    
    // Valores
    subtotal: 25.00,
    total: 29.50                              // subtotal + deliveryFee - pixDiscount
}
```

---

## 🔢 Sistema de Numeração de Pedidos

### Função: `getNextOrderNumber()` - Linha 2752

**Funcionamento:**
1. Obtém a data atual como string (`toDateString()`)
2. Busca contador do dia no localStorage: `orders_${today}`
3. Se não existe:
   - Cria novo contador iniciando em 1
   - Retorna '001'
4. Se existe:
   - Incrementa o contador
   - Retorna número formatado com 3 dígitos (ex: '002', '015', '123')

**Armazenamento:**
```javascript
localStorage.setItem(`orders_${today}`, JSON.stringify({
    count: 15,
    date: 'Sat Nov 29 2025'
}));
```

**Resultado:** Cada dia tem sua própria sequência de pedidos começando em 001.

---

## 💾 Armazenamento no LocalStorage

### Chave Principal: `acai_orders`

**Estrutura:**
```javascript
[
    { id: 'order_...', orderNumber: '001', ... },
    { id: 'order_...', orderNumber: '002', ... },
    { id: 'order_...', orderNumber: '003', ... }
]
```

### Operações:

#### Carregar Pedidos (Linha 3354)
```javascript
const existingOrders = localStorage.getItem('acai_orders');
const orders = existingOrders ? JSON.parse(existingOrders) : [];
```

#### Salvar Pedidos (Linha 3423)
```javascript
orders.push(order);
localStorage.setItem('acai_orders', JSON.stringify(orders));
```

---

## 🎯 Formatação de Itens do Carrinho

### Processo (Linha 3373-3391)

**Entrada:** `cartItems` (array global)

**Processamento:**
1. Para cada item do carrinho:
   - Filtra seleções por tipo (frutas, complementos, coberturas, adicionais)
   - Agrupa e formata em texto descritivo
   - Extrai categoria e total

**Saída:**
```javascript
{
    category: 'Açaí 500ml',
    description: 'Frutas: Banana, Morango. Complementos: Granola, Leite em Pó. Coberturas: Chocolate.',
    total: 22.00
}
```

---

## 💰 Cálculos Financeiros

### Taxa de Entrega (Linha 3359-3363)
```javascript
let deliveryFee = 0;
if (orderData.deliveryType === 'delivery' && orderData.neighborhood) {
    const neighborhoodData = orderData.neighborhood.split('-');
    deliveryFee = parseFloat(neighborhoodData[1]);
}
```

**Formato esperado:** `"Nome do Bairro-5.00"`

### Desconto PIX (Linha 3365-3369)
```javascript
let pixDiscount = 0;
if (orderData.paymentMethod === 'pix') {
    pixDiscount = total * 0.02;  // 2% de desconto
}
```

### Total Final (Linha 3371)
```javascript
const finalTotal = total + deliveryFee - pixDiscount;
```

**Fórmula:** `Subtotal + Taxa de Entrega - Desconto PIX`

---

## 🔗 Integração com Outros Sistemas

### 1. **Sistema de Acompanhamento (acompanhamento.js)**
- Lê pedidos de `localStorage.getItem('acai_orders')`
- Exibe pedidos com status 'pending'
- Permite atualizar status dos pedidos

### 2. **Sistema de Carteira (wallet-integration.js)**
- Aplica cashback após confirmação do pedido
- Calcula 5% do valor total como cashback
- Atualiza saldo da carteira do cliente

### 3. **Sistema de Controle (controle.js)**
- Gerencia cardápio e configurações
- Define preços e opções disponíveis
- Controla bairros e taxas de entrega

---

## 📱 Fluxo de Confirmação de Pagamento

### Para PIX:
1. Gera QR Code e copia código PIX
2. Aguarda confirmação do pagamento
3. Salva pedido após confirmação
4. Aplica cashback
5. Limpa carrinho

### Para Dinheiro/Cartão:
1. Exibe modal de confirmação
2. Salva pedido imediatamente
3. Aplica cashback
4. Limpa carrinho

---

## 🔍 Pontos de Atenção

### ✅ Funcionalidades Implementadas:
- Geração de ID único por pedido
- Numeração sequencial diária
- Cálculo automático de taxas e descontos
- Formatação detalhada de itens
- Persistência em localStorage
- Integração com sistema de cashback

### ⚠️ Considerações:
1. **LocalStorage tem limite de ~5-10MB** - Considerar limpeza periódica de pedidos antigos
2. **Numeração diária** - Reseta a cada dia (comportamento esperado)
3. **Sem sincronização entre dispositivos** - Cada navegador tem seus próprios dados
4. **Sem backup automático** - Dados podem ser perdidos se localStorage for limpo

---

## 🛠️ Funções Principais

| Função | Linha | Responsabilidade |
|--------|-------|------------------|
| `saveOrderToSystem()` | 3349 | Salva pedido completo no sistema |
| `getNextOrderNumber()` | 2752 | Gera número sequencial do pedido |
| `saveCustomerData()` | ~2775 | Salva dados do cliente para próximos pedidos |
| `submitOrder()` | ~2640 | Processa submissão do pedido |

---

## 📊 Exemplo de Fluxo Completo

```
1. Cliente adiciona itens ao carrinho
   ↓
2. Cliente preenche dados de entrega/pagamento
   ↓
3. Cliente clica em "Finalizar Pedido"
   ↓
4. Sistema valida dados
   ↓
5. Sistema calcula valores (taxa, desconto, total)
   ↓
6. Sistema formata itens do carrinho
   ↓
7. Sistema gera ID único e número do pedido
   ↓
8. Sistema cria objeto do pedido
   ↓
9. Sistema salva no localStorage ('acai_orders')
   ↓
10. Sistema aplica cashback (se aplicável)
   ↓
11. Sistema limpa carrinho
   ↓
12. Sistema exibe confirmação ao cliente
```

---

**Última atualização:** 29/11/2025
**Arquivo analisado:** `Project/scriptJs/script.js`
