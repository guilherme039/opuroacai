# 🥄 O Puro Açaí - Sistema de Pedidos

Sistema completo de pedidos online para açaiteria com painel administrativo.

## 📋 Funcionalidades

### Para Clientes (index_test.html)
- ✅ Cardápio completo com opções de açaí
- ✅ Sistema de carrinho de compras
- ✅ Promoções semanais automáticas
- ✅ Formulário de checkout completo
- ✅ Cálculo automático de taxa de entrega por bairro
- ✅ Desconto PIX (2%)
- ✅ Confirmação de pedido com número

### Para Administração (admin.html)
- ✅ Visualização de todos os pedidos
- ✅ Filtro por status e busca
- ✅ Atualização de status dos pedidos
- ✅ Envio para WhatsApp (opcional)
- ✅ Exclusão de pedidos
- ✅ Auto-atualização a cada 30 segundos

## 🚀 Como Usar

### Acessar o Site
1. Abra `index_test.html` no navegador
2. Navegue pelo cardápio e adicione itens ao carrinho
3. Finalize o pedido preenchendo seus dados
4. Receba o número do pedido para acompanhamento

### Acessar o Painel Admin
1. Clique no botão "🛒 Admin" no topo da página
2. Ou abra diretamente `admin.html`
3. Visualize todos os pedidos realizados
4. Atualize o status conforme prepara/entrega

## 📊 Status dos Pedidos

- ⏳ **Pendente** - Pedido recebido, aguardando preparo
- 👨‍🍳 **Preparando** - Pedido em preparo
- ✅ **Pronto** - Pedido pronto para retirada/entrega
- 🚚 **Entregue** - Pedido entregue ao cliente
- ❌ **Cancelado** - Pedido cancelado

## 💾 Armazenamento

Os pedidos são salvos no **localStorage** do navegador, o que significa:
- ✅ Funciona offline
- ✅ Não precisa de servidor
- ✅ Dados persistem entre sessões
- ⚠️ Dados são locais ao navegador (não sincronizam entre dispositivos)

## 🎨 Estrutura de Arquivos

```
Project/
├── index_test.html          # Página principal do cliente
├── admin.html               # Painel administrativo
├── Css/
│   └── system.css          # Estilos customizados
├── scriptJs/
│   ├── script.js           # JavaScript principal
│   ├── admin.js            # JavaScript do painel admin
│   └── tailwind-config.js  # Configuração do Tailwind
└── README.md               # Este arquivo
```

## 🔧 Personalização

### Alterar Número do WhatsApp
Edite o arquivo `scriptJs/admin.js` na linha do `whatsappUrl`:
```javascript
const whatsappUrl = `https://wa.me/5513991945381?text=...`;
```

### Adicionar/Remover Bairros
Edite o arquivo `index_test.html` na seção de seleção de bairros.

### Alterar Cores
Edite o arquivo `scriptJs/tailwind-config.js`:
```javascript
colors: {
    primary: '#370160',    // Roxo principal
    secondary: '#e7b623'   // Amarelo/dourado
}
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktops

## ⚡ Próximas Melhorias Sugeridas

- [ ] Integração com banco de dados real
- [ ] Sistema de autenticação para admin
- [ ] Notificações push para novos pedidos
- [ ] Relatórios de vendas
- [ ] Impressão de pedidos
- [ ] Integração com sistema de pagamento

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato através do WhatsApp: (13) 99194-5381
