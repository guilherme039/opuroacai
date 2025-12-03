# 📁 Estrutura Completa do Projeto - O Puro Açaí

## 🗂️ Organização de Pastas e Arquivos

```
Project/
├── 📄 index_test.html              # Site principal (cardápio para clientes)
├── 📄 admin.html                   # Painel de pedidos
├── 📄 controle.html                # Painel de controle de cardápio
├── 📄 carteira.html                # Painel de carteira e cashback
│
├── 📁 Css/
│   └── system.css                  # Estilos customizados do site
│
├── 📁 scriptJs/
│   ├── tailwind-config.js          # Configuração do Tailwind CSS
│   ├── script.js                   # JavaScript principal do site
│   ├── admin.js                    # JavaScript do painel de pedidos
│   ├── controle.js                 # JavaScript do painel de cardápio
│   ├── carteira.js                 # JavaScript do painel de carteira
│   └── wallet-integration.js       # Integração automática de cashback
│
├── 📁 assets/                      # Pasta para imagens (vazia)
│
└── 📁 Documentação/
    ├── README.md                   # Documentação geral
    ├── INSTRUCOES.txt              # Instruções de uso
    ├── CONTROLE_CARDAPIO.md        # Doc do sistema de cardápio
    ├── CARTEIRA_CASHBACK.md        # Doc do sistema de carteira
    └── ESTRUTURA_PROJETO.md        # Este arquivo
```

---

## 🎯 Funcionalidades por Arquivo

### 1️⃣ **index_test.html** - Site Principal
**Função:** Cardápio online para clientes fazerem pedidos

**Recursos:**
- ✅ Cardápio completo com categorias
- ✅ Sistema de carrinho de compras
- ✅ Promoções semanais (Segunda, Terça, Domingo)
- ✅ Formulário de checkout
- ✅ Cálculo de taxa de entrega por bairro
- ✅ Desconto PIX (2%)
- ✅ Confirmação de pedido

**Tecnologias:**
- HTML5 semântico
- Tailwind CSS (via CDN)
- JavaScript vanilla

**Acesso:** Página inicial do site

---

### 2️⃣ **admin.html** - Painel de Pedidos
**Função:** Gerenciar todos os pedidos recebidos

**Recursos:**
- ✅ Visualizar todos os pedidos
- ✅ Buscar por nome, telefone ou número
- ✅ Filtrar por status
- ✅ Atualizar status (Pendente → Preparando → Pronto → Entregue)
- ✅ Enviar para WhatsApp (opcional)
- ✅ Excluir pedidos
- ✅ Auto-atualização (30s)

**Status Disponíveis:**
- ⏳ Pendente
- 👨‍🍳 Preparando
- ✅ Pronto
- 🚚 Entregue
- ❌ Cancelado

**Acesso:** Via botão "🛒 Admin" no site

---

### 3️⃣ **controle.html** - Painel de Cardápio
**Função:** Gerenciar preços, estoque e disponibilidade

**Recursos:**
- ✅ Alterar preços de qualquer item
- ✅ Controlar estoque (ilimitado, quantidade, esgotado)
- ✅ Ativar/desativar itens
- ✅ 4 categorias organizadas em abas
- ✅ Salvar alterações
- ✅ Restaurar padrões
- ✅ Exportar dados (JSON)

**Categorias:**
1. 📏 Tamanhos Base (Tigela, Copo, Batido, Mais Pedidos)
2. 🍽️ Opções Prontas (6 tipos)
3. 🍓 Complementos (Frutas, Complementos, Coberturas)
4. 🍧 Combos (11 combos)

**Acesso:** Via botão "⚙️ Cardápio" nos painéis

---

### 4️⃣ **carteira.html** - Painel de Carteira
**Função:** Gerenciar cashback e créditos dos clientes

**Recursos:**
- ✅ Visualizar todas as carteiras
- ✅ Buscar clientes
- ✅ Ver saldo, total ganho e usado
- ✅ Histórico de transações
- ✅ Adicionar crédito manual
- ✅ Usar crédito
- ✅ Configurar percentual e valor mínimo
- ✅ Estatísticas gerais

**Configurações:**
- Percentual de cashback (padrão: 2%)
- Valor mínimo para uso (padrão: R$ 10,00)
- Ativar/desativar sistema

**Acesso:** Via botão "💰 Carteira" nos painéis

---

## 🔗 Fluxo de Navegação

```
┌─────────────────┐
│  index_test.html│ ◄─── Cliente acessa
│  (Site Principal)│
└────────┬────────┘
         │
         ├─► Botão "🛒 Admin" ──► admin.html (Pedidos)
         │                              │
         │                              ├─► "💰 Carteira" ──► carteira.html
         │                              ├─► "⚙️ Cardápio" ──► controle.html
         │                              └─► "🏠 Site" ──► index_test.html
         │
         └─► Cliente faz pedido ──► Salvo no localStorage
                                    └─► Cashback automático (se ativo)
```

---

## 💾 Armazenamento de Dados (localStorage)

### 1. **acai_orders** - Pedidos
```json
[
  {
    "id": "order_1234567890_abc123",
    "orderNumber": 1,
    "date": "2025-11-15T10:30:00.000Z",
    "status": "pending",
    "customerName": "João Silva",
    "customerPhone": "13999999999",
    "deliveryType": "delivery",
    "total": 50.00,
    "items": [...]
  }
]
```

### 2. **acai_menu_data** - Cardápio
```json
{
  "tamanhos": {...},
  "prontas": [...],
  "complementos": {...},
  "combos": [...]
}
```

### 3. **acai_wallets** - Carteiras
```json
{
  "13999999999": {
    "name": "João Silva",
    "balance": 15.50,
    "totalEarned": 25.00,
    "totalUsed": 9.50,
    "transactions": [...]
  }
}
```

### 4. **acai_cashback_settings** - Configurações
```json
{
  "cashbackPercentage": 2.0,
  "minUsage": 10.00,
  "active": true
}
```

---

## 🎨 Estilos e Design

### **Css/system.css**
- Estilos base do site
- Gradientes e sombras
- Animações
- Ajustes dos cartões de promoção
- Estilos do painel de controle

### **Cores do Tema**
```css
primary: #370160    /* Roxo principal */
secondary: #e7b623  /* Amarelo/dourado */
```

### **Tailwind CSS**
- Framework CSS via CDN
- Classes utilitárias
- Responsividade automática

---

## 📱 Responsividade

Todos os painéis são responsivos:
- 📱 **Mobile First** - Otimizado para smartphones
- 📱 **Tablets** - Layout adaptado
- 💻 **Desktop** - Aproveitamento total da tela

---

## 🔧 JavaScript - Funções Principais

### **script.js** (Site Principal)
```javascript
// Variáveis globais
let total = 0;
let cartItems = [];
let activePromo = null;

// Funções principais
- openPromoModal()          // Abrir modal de promoção
- openHighlightModal()      // Abrir modal de destaque
- openComplementosModal()   // Abrir modal de complementos
- addToCart()               // Adicionar ao carrinho
- updateCartDisplay()       // Atualizar exibição do carrinho
- submitOrder()             // Enviar pedido
- saveOrderToSystem()       // Salvar pedido (com cashback)
```

### **admin.js** (Painel de Pedidos)
```javascript
// Funções principais
- loadOrders()              // Carregar pedidos
- displayOrders()           // Exibir pedidos
- updateOrderStatus()       // Atualizar status
- deleteOrder()             // Excluir pedido
- sendToWhatsApp()          // Enviar para WhatsApp
```

### **controle.js** (Painel de Cardápio)
```javascript
// Funções principais
- loadMenuData()            // Carregar dados do cardápio
- renderTamanhos()          // Renderizar tamanhos
- renderProntas()           // Renderizar opções prontas
- toggleItemActive()        // Ativar/desativar item
- updateItemPrice()         // Atualizar preço
- updateItemStock()         // Atualizar estoque
- saveAllChanges()          // Salvar alterações
```

### **carteira.js** (Painel de Carteira)
```javascript
// Funções principais
- loadWallets()             // Carregar carteiras
- addCashback()             // Adicionar cashback
- useCashback()             // Usar cashback
- calculateCashback()       // Calcular cashback
- displayCustomers()        // Exibir clientes
- addManualCredit()         // Adicionar crédito manual
```

---

## 🔄 Integrações

### **Cashback Automático**
```javascript
// wallet-integration.js
// Intercepta saveOrderToSystem() e adiciona cashback
Pedido criado → Calcula 2% → Adiciona à carteira
```

### **WhatsApp**
```javascript
// Formato da mensagem
🥄 O PURO AÇAÍ - PEDIDO #123
👤 CLIENTE: Nome + Telefone
🚚 ENTREGA: Tipo + Endereço
💳 PAGAMENTO: Forma + Troco
🛒 PEDIDO: Itens detalhados
💰 TOTAL: R$ XX,XX
```

---

## 📊 Fluxo de Dados

### **Fazer Pedido**
```
Cliente preenche formulário
    ↓
submitOrder() é chamado
    ↓
saveOrderToSystem() salva no localStorage
    ↓
Cashback é calculado e adicionado (se ativo)
    ↓
Modal de sucesso é exibido
    ↓
Carrinho é limpo
```

### **Gerenciar Pedido**
```
Admin acessa admin.html
    ↓
loadOrders() carrega do localStorage
    ↓
displayOrders() renderiza na tela
    ↓
Admin atualiza status
    ↓
updateOrderStatus() salva no localStorage
    ↓
Auto-refresh a cada 30s
```

### **Usar Cashback**
```
Cliente acumula R$ 10,00+
    ↓
Admin consulta saldo em carteira.html
    ↓
Aplica desconto no pedido
    ↓
useCashback() debita da carteira
    ↓
Novo pedido gera novo cashback
```

---

## 🚀 Como Iniciar o Projeto

### **1. Abrir o Site**
```
Abrir: index_test.html
Fazer pedidos de teste
```

### **2. Acessar Painel Admin**
```
Clicar em "🛒 Admin" no site
OU abrir: admin.html
Ver pedidos realizados
```

### **3. Configurar Cardápio**
```
Clicar em "⚙️ Cardápio"
OU abrir: controle.html
Ajustar preços e estoque
```

### **4. Gerenciar Cashback**
```
Clicar em "💰 Carteira"
OU abrir: carteira.html
Ver e gerenciar créditos
```

---

## 🎯 Casos de Uso

### **Caso 1: Cliente Faz Primeiro Pedido**
1. Acessa index_test.html
2. Escolhe itens do cardápio
3. Adiciona ao carrinho
4. Preenche dados no checkout
5. Confirma pedido
6. Recebe número do pedido
7. **Ganha R$ 1,00 de cashback** (pedido de R$ 50,00)

### **Caso 2: Admin Gerencia Pedido**
1. Acessa admin.html
2. Vê novo pedido com status "Pendente"
3. Muda para "Preparando"
4. Quando pronto, muda para "Pronto"
5. Após entrega, muda para "Entregue"
6. Opcionalmente envia para WhatsApp

### **Caso 3: Ajustar Preço de Item**
1. Acessa controle.html
2. Vai na aba "Opções Prontas"
3. Localiza "Tradicional"
4. Altera preço de R$ 25,00 para R$ 27,00
5. Clica em "Salvar Alterações"
6. Preço atualizado no sistema

### **Caso 4: Cliente Usa Cashback**
1. Cliente acumulou R$ 15,00
2. Faz novo pedido de R$ 50,00
3. Admin consulta saldo em carteira.html
4. Aplica R$ 10,00 de desconto
5. Cliente paga R$ 40,00
6. Ganha R$ 0,80 de cashback (2% de R$ 40,00)
7. Saldo final: R$ 5,80

---

## 📈 Métricas e Relatórios

### **Disponíveis Atualmente:**
- Total de pedidos
- Total de clientes com cashback
- Cashback total acumulado
- Cashback total utilizado

### **Futuras (Sugestões):**
- Vendas por dia/semana/mês
- Itens mais vendidos
- Ticket médio
- Taxa de retorno de clientes
- ROI do cashback

---

## ⚠️ Limitações Atuais

1. **Armazenamento Local**
   - Dados salvos apenas no navegador
   - Não sincroniza entre dispositivos
   - Risco de perda se limpar cache

2. **Sem Backend**
   - Não há servidor
   - Não há banco de dados
   - Não há autenticação

3. **Sem Notificações**
   - Cliente não recebe confirmação automática
   - Sem alertas de status
   - Sem SMS/Email

---

## 🔮 Próximos Passos Recomendados

### **Fase 1: Melhorias Imediatas**
- [ ] Adicionar impressão de pedidos
- [ ] Relatórios básicos (vendas do dia)
- [ ] Backup/restore de dados
- [ ] Validação de CPF/CNPJ

### **Fase 2: Integrações**
- [ ] API de WhatsApp Business
- [ ] Integração com pagamento (Mercado Pago, PagSeguro)
- [ ] Notificações push
- [ ] Google Analytics

### **Fase 3: Backend**
- [ ] Criar API REST (Node.js/PHP)
- [ ] Banco de dados (MySQL/PostgreSQL)
- [ ] Sistema de autenticação
- [ ] Sincronização em tempo real

### **Fase 4: Mobile**
- [ ] App para cliente (React Native/Flutter)
- [ ] App para admin
- [ ] QR Code para pedidos
- [ ] Geolocalização

---

## 📞 Suporte e Manutenção

### **Arquivos de Documentação:**
- `README.md` - Visão geral
- `INSTRUCOES.txt` - Guia rápido
- `CONTROLE_CARDAPIO.md` - Sistema de cardápio
- `CARTEIRA_CASHBACK.md` - Sistema de cashback
- `ESTRUTURA_PROJETO.md` - Este arquivo

### **Contato:**
WhatsApp: (13) 99194-5381

---

## ✅ Checklist de Funcionalidades

### **Site Principal (index_test.html)**
- [x] Cardápio completo
- [x] Carrinho de compras
- [x] Promoções semanais
- [x] Checkout completo
- [x] Cálculo de entrega
- [x] Desconto PIX
- [x] Confirmação de pedido

### **Painel de Pedidos (admin.html)**
- [x] Listar pedidos
- [x] Buscar e filtrar
- [x] Atualizar status
- [x] Enviar WhatsApp
- [x] Excluir pedidos
- [x] Auto-refresh

### **Painel de Cardápio (controle.html)**
- [x] Alterar preços
- [x] Controlar estoque
- [x] Ativar/desativar itens
- [x] Salvar alterações
- [x] Restaurar padrões
- [x] Exportar dados

### **Painel de Carteira (carteira.html)**
- [x] Visualizar carteiras
- [x] Adicionar crédito
- [x] Usar crédito
- [x] Histórico de transações
- [x] Configurações
- [x] Estatísticas

### **Integrações**
- [x] Cashback automático
- [x] WhatsApp
- [x] localStorage

---

✨ **Projeto completo e funcional!** 🎉

**Versão:** 1.0.0  
**Data:** Novembro 2025  
**Status:** ✅ Produção
