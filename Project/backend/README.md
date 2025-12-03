# 🚀 Backend PIX - O Puro Açaí

Backend Node.js para processar pagamentos PIX reais via PagSeguro.

## 📦 Instalação Rápida

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Iniciar servidor
npm start
```

## 🔑 Credenciais Necessárias

1. **Email PagSeguro** - Email da conta Business
2. **Token PagSeguro** - Gerado no painel PagSeguro
3. **Chave PIX** - (13) 9 9206-5245

## 🌐 Endpoints

- `POST /pix/create` - Criar cobrança PIX
- `GET /pix/status/:id` - Verificar status
- `POST /pix/webhook` - Receber notificações
- `GET /health` - Health check

## 🧪 Testar

```bash
# Health check
curl http://localhost:3000/health

# Criar PIX
curl -X POST http://localhost:3000/pix/create \
  -H "Content-Type: application/json" \
  -d '{"amount": 29.90, "customerName": "Teste"}'
```

## 📚 Documentação Completa

Veja `PIX_REAL_PAGSEGURO.md` na raiz do projeto.
