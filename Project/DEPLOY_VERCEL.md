# 🚀 Guia de Deploy na Vercel - Sistema de Pedidos de Açaí

## 📋 Pré-requisitos

- Conta na Vercel (gratuita): https://vercel.com
- Conta no GitHub (para conectar o repositório)
- Credenciais do PagSeguro (se usar PIX real)

---

## 🔧 Passo 1: Preparar o Projeto

### 1.1 Verificar Arquivos Criados

Certifique-se de que os seguintes arquivos foram criados:

```
✅ vercel.json          - Configuração da Vercel
✅ .env.example         - Exemplo de variáveis de ambiente
✅ .gitignore           - Arquivos a ignorar no Git
✅ index.html           - Redirecionamento para index_test.html
```

### 1.2 Estrutura do Projeto

```
Project/
├── index.html              ← Página de entrada (redireciona)
├── index_test.html         ← Página principal
├── vercel.json             ← Configuração Vercel
├── .env.example            ← Exemplo de variáveis
├── .gitignore              ← Arquivos ignorados
├── Css/
│   └── system.css
├── scriptJs/
│   ├── script.js
│   ├── admin.js
│   ├── pix-payment.js
│   └── ...
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
└── ...
```

---

## 🌐 Passo 2: Deploy na Vercel

### Opção A: Deploy via Dashboard (Recomendado)

1. **Acesse:** https://vercel.com/dashboard
2. **Clique em:** "Add New..." → "Project"
3. **Importe seu repositório do GitHub**
4. **Configure o projeto:**
   - **Framework Preset:** Other
   - **Root Directory:** `Project` (se o projeto estiver em uma subpasta)
   - **Build Command:** (deixe vazio para site estático)
   - **Output Directory:** (deixe vazio)

5. **Clique em "Deploy"**

### Opção B: Deploy via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
cd Project
vercel
```

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Acessar Configurações

1. Vá para o dashboard do seu projeto na Vercel
2. Clique em **"Settings"**
3. Clique em **"Environment Variables"**

### 3.2 Adicionar Variáveis Obrigatórias

#### Para PIX Simulado (Funciona sem backend):
```
Nenhuma variável necessária - sistema funciona 100% no frontend
```

#### Para PIX Real (PagSeguro):

| Nome da Variável | Valor | Ambiente |
|------------------|-------|----------|
| `PAGSEGURO_EMAIL` | seu-email@pagseguro.com.br | Production |
| `PAGSEGURO_TOKEN` | seu-token-pagseguro | Production |
| `PIX_KEY` | 13992065245 | Production |
| `PIX_KEY_TYPE` | PHONE | Production |
| `PIX_RECEIVER_NAME` | Luiz Gustavo Barros da Silva | Production |
| `NODE_ENV` | production | Production |
| `FRONTEND_URL` | https://seu-dominio.vercel.app | Production |
| `WEBHOOK_URL` | https://seu-dominio.vercel.app/api/pix/webhook | Production |
| `WHATSAPP_NUMBER` | 5513991945381 | Production |

### 3.3 Como Obter as Credenciais do PagSeguro

1. **Acesse:** https://pagseguro.uol.com.br/
2. **Faça login** na sua conta
3. **Vá em:** Integrações → Gerar Token
4. **Copie o token** gerado
5. **Use seu email** cadastrado no PagSeguro

---

## 🔄 Passo 4: Configurar Domínio (Opcional)

### 4.1 Domínio Vercel (Gratuito)

Seu projeto terá automaticamente um domínio:
```
https://seu-projeto.vercel.app
```

### 4.2 Domínio Personalizado

1. Vá em **"Settings"** → **"Domains"**
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções da Vercel

---

## ✅ Passo 5: Verificar Deploy

### 5.1 Testar Páginas

Acesse as seguintes URLs para verificar:

```
✅ https://seu-dominio.vercel.app/
✅ https://seu-dominio.vercel.app/index_test.html
✅ https://seu-dominio.vercel.app/admin.html
✅ https://seu-dominio.vercel.app/acompanhamento.html
✅ https://seu-dominio.vercel.app/carteira.html
✅ https://seu-dominio.vercel.app/controle.html
```

### 5.2 Testar Funcionalidades

- [ ] Adicionar item ao carrinho
- [ ] Fazer pedido com PIX
- [ ] Fazer pedido com Dinheiro
- [ ] Fazer pedido com Cartão
- [ ] Acompanhar pedido
- [ ] Ver painel administrativo
- [ ] Verificar carteira de cashback

---

## 🐛 Solução de Problemas

### Erro 404: NOT_FOUND

**Causa:** Vercel não encontra o arquivo de entrada

**Solução:**
1. Verifique se `vercel.json` está na raiz do projeto
2. Verifique se `index.html` existe
3. Tente fazer redeploy:
   ```bash
   vercel --prod
   ```

### Erro: Cannot find module

**Causa:** Dependências do backend não instaladas

**Solução:**
1. Verifique se `backend/package.json` existe
2. Adicione script de build no `vercel.json`:
   ```json
   {
     "builds": [
       {
         "src": "backend/package.json",
         "use": "@vercel/node"
       }
     ]
   }
   ```

### PIX não funciona

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Verifique se todas as variáveis estão configuradas
2. Verifique se o backend está rodando:
   ```
   https://seu-dominio.vercel.app/api/health
   ```
3. Verifique logs na Vercel:
   - Dashboard → Seu Projeto → Deployments → Logs

### LocalStorage não persiste

**Causa:** Comportamento normal do navegador

**Solução:**
- LocalStorage é local ao navegador
- Dados não sincronizam entre dispositivos
- Para produção, considere migrar para backend

---

## 🔒 Segurança

### Variáveis de Ambiente

✅ **NUNCA** commite arquivos `.env` no Git  
✅ **SEMPRE** use variáveis de ambiente na Vercel  
✅ **NUNCA** exponha tokens no código frontend  

### HTTPS

✅ Vercel fornece HTTPS automaticamente  
✅ Todos os dados são criptografados  

---

## 📊 Monitoramento

### Logs da Vercel

1. Acesse: Dashboard → Seu Projeto → Deployments
2. Clique no deployment ativo
3. Veja logs em tempo real

### Analytics (Opcional)

1. Vá em: Settings → Analytics
2. Ative o Vercel Analytics (gratuito)
3. Veja estatísticas de acesso

---

## 🔄 Atualizações

### Deploy Automático

Quando você fizer push para o GitHub:
1. Vercel detecta automaticamente
2. Faz build do projeto
3. Deploy em produção

### Deploy Manual

```bash
# Deploy para preview
vercel

# Deploy para produção
vercel --prod
```

---

## 📱 Configurações Adicionais

### PWA (Progressive Web App)

Para transformar em app instalável, adicione:

1. Criar `manifest.json`:
```json
{
  "name": "O Puro Açaí",
  "short_name": "Açaí",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#6B21A8",
  "theme_color": "#6B21A8",
  "icons": [
    {
      "src": "/assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

2. Adicionar no `<head>` do HTML:
```html
<link rel="manifest" href="/manifest.json">
```

---

## 🎯 Checklist Final

Antes de considerar o deploy completo:

- [ ] Todas as páginas carregam corretamente
- [ ] Pedidos são salvos no localStorage
- [ ] Painel admin exibe pedidos
- [ ] Acompanhamento funciona
- [ ] Carteira de cashback funciona
- [ ] WhatsApp abre corretamente
- [ ] PIX gera QR Code (se configurado)
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio configurado (se aplicável)
- [ ] HTTPS ativo
- [ ] Sem erros no console

---

## 📞 Suporte

### Documentação Vercel
- https://vercel.com/docs

### Documentação do Projeto
- Ver `README_DOCUMENTACAO.md` para índice completo
- Ver `GUIA_RAPIDO.md` para referência rápida

### Problemas Comuns
- Ver `CHECKLIST_VERIFICACAO.md` para testes

---

## 🎉 Pronto!

Seu sistema está no ar! 🚀

**URL do Projeto:** https://seu-dominio.vercel.app

**Próximos Passos:**
1. Compartilhe o link com seus clientes
2. Teste todas as funcionalidades
3. Configure backup dos dados
4. Monitore o uso

---

**Última atualização:** 29/11/2025  
**Versão:** 1.0
