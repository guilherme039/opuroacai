# 📱 Formato da Mensagem WhatsApp

**Data:** 28/11/2025  
**Função:** `sendWhatsAppWithData()`

---

## 📋 INFORMAÇÕES COLETADAS

### **1. Dados Pessoais** ✅
```
- Nome Completo
- WhatsApp
```

### **2. Tipo de Entrega** ✅
```
- Delivery ou Retirada
- Bairro (se delivery)
- Taxa de entrega
- Endereço completo:
  * Rua/Avenida
  * Número
  * Complemento
  * Ponto de Referência
```

### **3. Forma de Pagamento** ✅
```
- Dinheiro / PIX / Cartão
- Troco (se dinheiro)
- Desconto PIX (se PIX)
```

### **4. Itens do Pedido** ✅
```
Para cada item:
- Categoria (Açaí 500ml, Tigela, etc)
- Tamanho/Base
- Montagem (Montado/Separado)
- Frutas selecionadas
- Complementos selecionados
- Coberturas selecionadas
- Adicionais
- Subtotal do item
```

### **5. Totais** ✅
```
- Subtotal dos produtos
- Taxa de entrega
- Desconto PIX (se aplicável)
- TOTAL GERAL
```

### **6. Extras** ✅
```
- Descartáveis (Sim/Não)
- Observações do cliente
- Data e hora do pedido
- Link de acompanhamento
```

---

## 📱 EXEMPLO DE MENSAGEM ENVIADA

```
🥄 *O PURO AÇAÍ - PEDIDO #012*

👤 *CLIENTE*
Nome: João Silva
WhatsApp: 13991234567

🚚 *ENTREGA*
Tipo: Delivery
Bairro: Guilhermina (+R$ 5,00)
Endereço: Rua das Flores, 123 - Apto 45
Referência: Próximo ao mercado

💳 *PAGAMENTO*
Forma: PIX (com desconto)

🛒 *PEDIDO*

*Açaí 500ml - Tigela*
• Tigela 500ml - R$ 15,00
🥄 Montado (açaí já misturado)
Frutas: Banana (GRÁTIS), Morango (GRÁTIS)
Complementos: Granola (GRÁTIS), Leite em Pó (GRÁTIS), Paçoca (+R$ 2,00)
Coberturas: Mel (GRÁTIS)
*Subtotal: R$ 17,00*

*Mais Pedidos - Copo 300ml*
• Copo 300ml - R$ 10,00
Frutas: Kiwi (GRÁTIS), Manga (GRÁTIS)
Complementos: Amendoim (GRÁTIS), Castanha (GRÁTIS)
*Subtotal: R$ 10,00*

*Subtotal Produtos: R$ 27,00*
*Taxa de Entrega: R$ 5,00*
*Desconto PIX: -R$ 0,54*
*TOTAL GERAL: R$ 31,46*

🥄 *DESCARTÁVEIS*
Sim, preciso de descartáveis

📝 *OBSERVAÇÕES*
Sem açúcar, por favor

⏰ Pedido realizado em: 28/11/2025 10:30:45

📱 *ACOMPANHE SEU PEDIDO:*
https://site.com/acompanhamento.html?pedido=012
```

---

## 🔍 DETALHAMENTO DA COLETA

### **Função Principal:**
```javascript
function sendWhatsAppWithData(orderData) {
    // 1. Gera número do pedido
    const orderNumber = getNextOrderNumber();
    
    // 2. Coleta dados do cliente
    orderData.customerName
    orderData.customerPhone
    
    // 3. Coleta dados de entrega
    orderData.deliveryType
    orderData.neighborhood
    orderData.addressStreet
    orderData.addressNumber
    orderData.addressComplement
    orderData.addressReference
    
    // 4. Coleta forma de pagamento
    orderData.paymentMethod
    orderData.changeAmount (se dinheiro)
    
    // 5. Coleta itens do carrinho
    cartItems.forEach(item => {
        item.category
        item.selections (todos os itens)
        item.total
    })
    
    // 6. Coleta extras
    orderData.disposables
    orderData.orderNotes
    
    // 7. Calcula totais
    total (subtotal)
    deliveryFee (taxa entrega)
    pixDiscount (desconto PIX)
    finalTotal (total geral)
    
    // 8. Monta mensagem formatada
    // 9. Envia para WhatsApp
    // 10. Salva no localStorage
}
```

---

## ✅ CHECKLIST DE INFORMAÇÕES

### **Dados Coletados:**
- [x] Nome completo
- [x] WhatsApp
- [x] Tipo de entrega
- [x] Bairro (se delivery)
- [x] Rua/Avenida
- [x] Número
- [x] Complemento
- [x] Ponto de referência
- [x] Forma de pagamento
- [x] Troco (se dinheiro)
- [x] Desconto PIX (se PIX)
- [x] Todos os itens do pedido
- [x] Categoria de cada item
- [x] Tamanho/Base
- [x] Montagem
- [x] Frutas
- [x] Complementos
- [x] Coberturas
- [x] Adicionais
- [x] Preço de cada item
- [x] Subtotal de cada item
- [x] Subtotal geral
- [x] Taxa de entrega
- [x] Total geral
- [x] Descartáveis
- [x] Observações
- [x] Data e hora
- [x] Link de acompanhamento

### **Formatação:**
- [x] Emojis para cada seção
- [x] Negrito nos títulos
- [x] Valores formatados (R$ X,XX)
- [x] Itens grátis identificados
- [x] Itens pagos com preço
- [x] Organização por categoria
- [x] Separação clara entre seções
- [x] Total destacado

---

## 🎯 COMO FUNCIONA

### **Passo 1: Cliente Preenche Formulário**
```
✅ Nome: João Silva
✅ WhatsApp: 13991234567
✅ Tipo: Delivery
✅ Bairro: Guilhermina
✅ Endereço: Rua das Flores, 123
✅ Complemento: Apto 45
✅ Referência: Próximo ao mercado
✅ Pagamento: PIX
✅ Descartáveis: Sim
✅ Observações: Sem açúcar
```

### **Passo 2: Cliente Clica "Enviar Pedido"**
```
1. submitOrder() é chamado
2. Valida todos os campos
3. Se PIX: mostra modal PIX
4. Cliente confirma pagamento
5. confirmPixPayment() é chamado
6. sendWhatsAppWithData() é executado
```

### **Passo 3: Mensagem é Montada**
```
1. Gera número do pedido
2. Coleta TODAS as informações
3. Formata em seções organizadas
4. Adiciona emojis e formatação
5. Calcula totais
6. Adiciona link de acompanhamento
```

### **Passo 4: Envia para WhatsApp**
```
1. Monta URL do WhatsApp
2. Codifica mensagem
3. Abre WhatsApp em nova aba
4. Mensagem aparece pronta para enviar
```

### **Passo 5: Salva e Confirma**
```
1. Salva pedido no localStorage
2. Limpa carrinho
3. Mostra modal de sucesso
4. Cliente pode acompanhar pedido
```

---

## 📱 NÚMERO DO WHATSAPP

```
Número: 5513991945381
Formato: +55 13 99194-5381
```

---

## 🎨 FORMATAÇÃO ESPECIAL

### **Itens Grátis:**
```
Frutas: Banana (GRÁTIS), Morango (GRÁTIS)
```

### **Itens Pagos:**
```
Complementos: Paçoca (+R$ 2,00), Leite Ninho (+R$ 3,00)
```

### **Montagem:**
```
🥄 Montado (açaí já misturado)
ou
🥄 Separado (açaí e complementos separados)
```

### **Troco:**
```
Troco para: R$ 50,00
💰 *TROCO A DAR: R$ 18,54*
```

### **Desconto PIX:**
```
*Desconto PIX: -R$ 0,54*
```

---

## ✅ RESULTADO

**TODAS as informações são coletadas e enviadas!**

A mensagem do WhatsApp inclui:
- ✅ Dados completos do cliente
- ✅ Endereço detalhado
- ✅ Forma de pagamento
- ✅ Todos os itens com detalhes
- ✅ Preços individuais e totais
- ✅ Descartáveis e observações
- ✅ Link de acompanhamento

**Sistema 100% completo!** 🚀

---

*Documentação criada em: 28/11/2025*  
*Status: ✅ COMPLETO*
