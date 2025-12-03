# 💳 Sistema PIX REAL - PagSeguro Integration

**Recebedor:** Luiz Gustavo Barros da Silva  
**Instituição:** Pagseguro Internet S.A.  
**Chave PIX:** (13) 9 9206-5245  
**Tipo:** Celular

---

## 🎯 VISÃO GERAL

Sistema completo de pagamento PIX **REAL** integrado com PagSeguro API. Pagamentos são processados diretamente para a chave PIX configurada.

### ✅ **Características:**
- QR Code **dinâmico** gerado via API
- Pagamentos **reais** processados pelo PagSeguro
- Verificação automática de status
- Webhook para confirmação instantânea
- Sem QR Codes estáticos ou falsos

---

## 📋 REQUISITOS

### **1. Conta PagSeguro Business**
- Não funciona com conta pessoal
- Precisa ser conta empresarial
- Cadastro: https://pagseguro.uol.com.br/

### **2. Credenciais de API**
- Email da conta PagSeguro
- Token de API (gerado no painel)
- Acesso: Painel > Integrações > Token

### **3. Servidor Backend**
- Node.js 14+ ou Python 3.8+
- Servidor com IP público ou ngrok
- Porta 3000 (ou configurável)

### **4. Webhook Público**
- URL acessível pela internet
- Para desenvolvimento: use ngrok
- Para produção: domínio próprio

---

## 🚀 INSTALAÇÃO

### **Passo 1: Instalar Dependências**

```bash
cd Project/backend
npm install
```

### **Passo 2: Configurar Variáveis de Ambiente**

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:

```env
# PagSeguro Credentials
PAGSEGURO_EMAIL=seu-email@pagseguro.com.br
PAGSEGURO_TOKEN=seu-token-aqui

# PIX Receiver Info
PIX_KEY=13992065245
PIX_KEY_TYPE=PHONE
PIX_RECEIVER_NAME=Luiz Gustavo Barros da Silva

# Server Config
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:8080

# Webhook URL (use ngrok for development)
WEBHOOK_URL=https://seu-ngrok-url.ngrok.io/pix/webhook
```

### **Passo 3: Iniciar Backend**

```bash
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

### **Passo 4: Configurar Webhook (Desenvolvimento)**

Instale ngrok:
```bash
npm install -g ngrok
```

Inicie ngrok:
```bash
ngrok http 3000
```

Copie a URL gerada (ex: `https://abc123.ngrok.io`) e atualize no `.env`:
```env
WEBHOOK_URL=https://abc123.ngrok.io/pix/webhook
```

### **Passo 5: Atualizar Frontend**

No arquivo `index_test.html`, adicione o script:

```html
<script src="scriptJs/pix-payment-real.js"></script>
<script src="scriptJs/script.js"></script>
```

No arquivo `scriptJs/pix-payment-real.js`, atualize a URL do backend:

```javascript
const PIX_BACKEND_URL = 'http://localhost:3000'; // ou sua URL de produção
```

---

## 📡 API ENDPOINTS

### **1. POST /pix/create**

Cria uma cobrança PIX dinâmica.

**Request:**
```json
{
  "amount": 29.90,
  "description": "Pedido O Puro Açaí",
  "customerName": "João Silva",
  "customerPhone": "13991234567",
  "orderNumber": "001"
}
```

**Response:**
```json
{
  "success": true,
  "transaction_id": "PIX_1234567890_abc123",
  "qr_code_image": "data:image/png;base64,...",
  "qr_code_payload": "00020126580014br.gov.bcb.pix...",
  "amount": 29.90,
  "expires_at": "2025-11-28T11:30:00Z",
  "status": "PENDING"
}
```

### **2. GET /pix/status/:transactionId**

Verifica o status do pagamento.

**Response:**
```json
{
  "transaction_id": "PIX_1234567890_abc123",
  "status": "PAID",
  "amount": 29.90,
  "paid_at": "2025-11-28T11:15:30Z",
  "expires_at": "2025-11-28T11:30:00Z"
}
```

**Status possíveis:**
- `PENDING` - Aguardando pagamento
- `PAID` - Pago
- `EXPIRED` - Expirado

### **3. POST /pix/webhook**

Recebe notificações do PagSeguro.

**Headers:**
```
x-pagseguro-signature: abc123...
```

**Body:**
```json
{
  "id": "ORDE_123456",
  "reference_id": "PIX_1234567890_abc123",
  "created_at": "2025-11-28T11:15:30Z"
}
```

---

## 🔄 FLUXO COMPLETO

### **1. Cliente Finaliza Pedido**
```
Cliente seleciona PIX → Clica "Finalizar"
```

### **2. Frontend Chama Backend**
```javascript
POST /pix/create
{
  amount: 29.90,
  customerName: "João",
  ...
}
```

### **3. Backend Cria Cobrança**
```
Backend → PagSeguro API
PagSeguro gera QR Code dinâmico
Backend retorna QR Code + transaction_id
```

### **4. Modal PIX Aparece**
```
- QR Code dinâmico
- Código copiar/colar
- Status: "Aguardando pagamento..."
- Verificação automática a cada 3s
```

### **5. Cliente Paga**
```
Cliente abre app do banco
Escaneia QR Code
Confirma pagamento
```

### **6. PagSeguro Confirma**
```
PagSeguro processa pagamento
PagSeguro envia webhook
Backend atualiza status para PAID
```

### **7. Frontend Detecta Pagamento**
```
Polling detecta status = PAID
Modal atualiza: "Pagamento Confirmado!"
Pedido é processado
WhatsApp é enviado
Modal de sucesso aparece
```

---

## 🧪 TESTES

### **Teste 1: Criar PIX**

```bash
curl -X POST http://localhost:3000/pix/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 29.90,
    "description": "Teste",
    "customerName": "João",
    "customerPhone": "13991234567"
  }'
```

### **Teste 2: Verificar Status**

```bash
curl http://localhost:3000/pix/status/PIX_1234567890_abc123
```

### **Teste 3: Health Check**

```bash
curl http://localhost:3000/health
```

---

## 🔐 SEGURANÇA

### **Produção:**

1. **Use HTTPS** - Sempre
2. **Valide Webhook** - Verifique assinatura PagSeguro
3. **Rate Limiting** - Limite requisições
4. **Variáveis de Ambiente** - Nunca commite `.env`
5. **Database** - Use banco de dados real (não Map)
6. **Logs** - Implemente logging adequado
7. **Monitoramento** - Configure alertas

### **Validação de Webhook:**

```javascript
function validateSignature(signature, body) {
    const hash = crypto
        .createHmac('sha256', PAGSEGURO_TOKEN)
        .update(JSON.stringify(body))
        .digest('hex');
    
    return hash === signature;
}
```

---

## 📊 BANCO DE DADOS

Para produção, substitua o `Map` por banco de dados:

### **Schema Sugerido:**

```sql
CREATE TABLE pix_transactions (
    id VARCHAR(255) PRIMARY KEY,
    pagseguro_id VARCHAR(255),
    amount DECIMAL(10,2),
    status VARCHAR(50),
    qr_code_text TEXT,
    qr_code_image TEXT,
    expires_at TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP,
    order_number VARCHAR(50),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20)
);
```

---

## 🚨 TROUBLESHOOTING

### **Erro: "Failed to create PIX charge"**

**Causas:**
- Token inválido
- Email incorreto
- Conta não é Business
- Ambiente errado (sandbox vs production)

**Solução:**
1. Verifique credenciais no `.env`
2. Confirme que é conta Business
3. Teste no sandbox primeiro

### **Erro: "Webhook not receiving notifications"**

**Causas:**
- URL não é pública
- ngrok não está rodando
- Firewall bloqueando

**Solução:**
1. Use ngrok para desenvolvimento
2. Verifique se URL está acessível
3. Teste com `curl` externo

### **Erro: "Payment status not updating"**

**Causas:**
- Polling parou
- Backend offline
- Transaction ID incorreto

**Solução:**
1. Verifique console do navegador
2. Confirme backend está rodando
3. Teste endpoint `/pix/status` manualmente

---

## 📚 DOCUMENTAÇÃO PAGSEGURO

- **API Reference:** https://dev.pagseguro.uol.com.br/reference
- **PIX Documentation:** https://dev.pagseguro.uol.com.br/reference/pix-intro
- **Webhooks:** https://dev.pagseguro.uol.com.br/reference/webhooks
- **Sandbox:** https://sandbox.pagseguro.uol.com.br/

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Backend:**
- [ ] Node.js instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] `.env` configurado com credenciais
- [ ] Servidor rodando (`npm start`)
- [ ] ngrok configurado (desenvolvimento)
- [ ] Webhook URL atualizada

### **Frontend:**
- [ ] Script `pix-payment-real.js` incluído
- [ ] URL do backend configurada
- [ ] Integração com `submitOrder()`
- [ ] Testes realizados

### **PagSeguro:**
- [ ] Conta Business criada
- [ ] Token de API gerado
- [ ] Chave PIX configurada
- [ ] Webhook URL cadastrada no painel

### **Testes:**
- [ ] Criar PIX funciona
- [ ] QR Code aparece
- [ ] Código copiar/colar funciona
- [ ] Status atualiza automaticamente
- [ ] Webhook recebe notificações
- [ ] Pedido é processado após pagamento

---

## 🎉 RESULTADO FINAL

Sistema PIX **100% REAL** integrado com PagSeguro:

✅ QR Codes dinâmicos  
✅ Pagamentos reais processados  
✅ Verificação automática de status  
✅ Webhook para confirmação instantânea  
✅ Recebedor: Luiz Gustavo Barros da Silva  
✅ Chave: (13) 9 9206-5245  

**Pronto para processar pagamentos reais!** 🚀

---

*Documentação criada em: 28/11/2025*  
*Status: ✅ PRONTO PARA IMPLEMENTAÇÃO*
