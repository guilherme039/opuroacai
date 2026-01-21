# 🚀 Guia Completo - Git e GitHub

## 📋 Passo a Passo Completo

### 1️⃣ **Inicializar Git no Projeto**

```bash
cd Project
git init
```

---

### 2️⃣ **Adicionar Todos os Arquivos**

```bash
git add .
```

Ou se preferir adicionar arquivo por arquivo:
```bash
git add index_test.html
git add admin.html
git add controle.html
# ... etc
```

---

### 3️⃣ **Fazer o Primeiro Commit**

```bash
git commit -m "Initial commit - Sistema O Puro Açaí completo"
```

Ou com mensagem mais detalhada:
```bash
git commit -m "feat: Sistema completo de pedidos, cardápio e cashback

- Painel administrativo com design premium
- Sistema de pedidos com edição completa
- Controle de cardápio com adicionar/editar/remover
- Carteira de cashback
- Integração PIX
- Design responsivo e moderno"
```

---

### 4️⃣ **Criar Repositório no GitHub**

1. Acesse: https://github.com/new
2. Nome do repositório: `o-puro-acai` (ou o nome que preferir)
3. Descrição: "Sistema completo de pedidos para açaiteria"
4. Escolha: **Privado** ou **Público**
5. **NÃO** marque "Initialize with README"
6. Clique em **"Create repository"**

---

### 5️⃣ **Conectar com o GitHub**

Copie a URL do seu repositório (algo como: `https://github.com/seu-usuario/o-puro-acai.git`)

```bash
git remote add origin https://github.com/SEU-USUARIO/o-puro-acai.git
```

Exemplo:
```bash
git remote add origin https://github.com/joaosilva/o-puro-acai.git
```

---

### 6️⃣ **Renomear Branch para Main (se necessário)**

```bash
git branch -M main
```

---

### 7️⃣ **Enviar para o GitHub**

```bash
git push -u origin main
```

Se pedir autenticação, use:
- **Username**: seu usuário do GitHub
- **Password**: seu **Personal Access Token** (não a senha normal)

---

## 🔑 Como Criar Personal Access Token

Se o GitHub pedir senha e não aceitar:

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Nome: "O Puro Açaí Deploy"
4. Marque: **repo** (todas as opções)
5. Clique em **"Generate token"**
6. **COPIE O TOKEN** (só aparece uma vez!)
7. Use esse token como senha

---

## 📝 Comandos Resumidos (Sequência Completa)

```bash
# 1. Entrar na pasta do projeto
cd Project

# 2. Inicializar Git
git init

# 3. Adicionar todos os arquivos
git add .

# 4. Fazer commit
git commit -m "Initial commit - Sistema O Puro Açaí completo"

# 5. Adicionar repositório remoto (substitua pela sua URL)
git remote add origin https://github.com/SEU-USUARIO/o-puro-acai.git

# 6. Renomear branch
git branch -M main

# 7. Enviar para GitHub
git push -u origin main
```

---

## 🔄 Comandos para Atualizações Futuras

Depois que já está no GitHub, para enviar novas alterações:

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar alterações
git add .

# 3. Fazer commit
git commit -m "Descrição da alteração"

# 4. Enviar para GitHub
git push
```

---

## 📂 Criar .gitignore (Recomendado)

Antes de fazer o `git add .`, crie um arquivo `.gitignore`:

```bash
# Criar arquivo .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "*.log" >> .gitignore
```

Ou crie manualmente com este conteúdo:

```
# Dependências
node_modules/
package-lock.json

# Variáveis de ambiente
.env
.env.local

# Logs
*.log
npm-debug.log*

# Sistema
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Build
dist/
build/
```

---

## 🌿 Trabalhando com Branches (Opcional)

Para criar branches de desenvolvimento:

```bash
# Criar e mudar para nova branch
git checkout -b desenvolvimento

# Fazer alterações...
git add .
git commit -m "Nova funcionalidade"

# Enviar branch para GitHub
git push -u origin desenvolvimento

# Voltar para main
git checkout main

# Fazer merge da branch
git merge desenvolvimento
```

---

## 🔍 Comandos Úteis

```bash
# Ver status dos arquivos
git status

# Ver histórico de commits
git log

# Ver histórico resumido
git log --oneline

# Ver diferenças
git diff

# Ver repositórios remotos
git remote -v

# Baixar alterações do GitHub
git pull

# Clonar repositório
git clone https://github.com/usuario/repositorio.git
```

---

## ⚠️ Problemas Comuns e Soluções

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/o-puro-acai.git
```

### Erro: "failed to push"
```bash
git pull origin main --rebase
git push -u origin main
```

### Erro: "Authentication failed"
- Use Personal Access Token ao invés da senha
- Ou configure SSH keys

### Desfazer último commit (antes do push)
```bash
git reset --soft HEAD~1
```

### Desfazer alterações em arquivo
```bash
git checkout -- nome-do-arquivo.html
```

---

## 🎯 Exemplo Prático Completo

```bash
# 1. Navegar até a pasta
cd C:\Users\SeuUsuario\Desktop\Project

# 2. Inicializar Git
git init

# 3. Criar .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore

# 4. Adicionar tudo
git add .

# 5. Primeiro commit
git commit -m "Initial commit - Sistema O Puro Açaí

- Painel administrativo completo
- Sistema de pedidos com edição
- Controle de cardápio
- Carteira de cashback
- Design premium SaaS
- Totalmente responsivo"

# 6. Adicionar repositório (SUBSTITUA pela sua URL!)
git remote add origin https://github.com/joaosilva/o-puro-acai.git

# 7. Renomear branch
git branch -M main

# 8. Enviar
git push -u origin main
```

---

## 📱 Usando GitHub Desktop (Alternativa Visual)

Se preferir interface gráfica:

1. Baixe: https://desktop.github.com/
2. Instale e faça login
3. File → Add Local Repository
4. Escolha a pasta `Project`
5. Clique em "Publish repository"
6. Pronto! 🎉

---

## ✅ Checklist Final

Antes de enviar para o GitHub:

- [ ] Remover senhas e tokens do código
- [ ] Criar arquivo `.gitignore`
- [ ] Verificar se `.env` está no `.gitignore`
- [ ] Testar se tudo funciona localmente
- [ ] Fazer commit com mensagem clara
- [ ] Enviar para GitHub
- [ ] Verificar se apareceu no GitHub

---

## 🎉 Pronto!

Seu projeto estará no GitHub e você poderá:
- ✅ Fazer backup automático
- ✅ Acessar de qualquer lugar
- ✅ Compartilhar com outros
- ✅ Fazer deploy (Vercel, Netlify, etc)
- ✅ Controlar versões

---

**Boa sorte! 🚀**
