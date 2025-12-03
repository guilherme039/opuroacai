# 💰 Sistema de Carteira e Cashback

Sistema completo de fidelização com cashback automático para clientes.

## 🎯 Funcionalidades

### ✅ Cashback Automático
- Cada pedido gera cashback automaticamente
- Percentual configurável (padrão: 2%)
- Acúmulo ilimitado de créditos
- Histórico completo de transações

### ✅ Uso de Créditos
- Cliente pode usar quando atingir valor mínimo (padrão: R$ 10,00)
- Desconto direto no próximo pedido
- Controle de saldo em tempo real

### ✅ Gerenciamento Administrativo
- Visualizar todas as carteiras
- Adicionar crédito manual (bônus, promoções)
- Debitar crédito manualmente
- Excluir carteiras
- Configurar percentual e valor mínimo

## 🚀 Como Funciona

### Para o Cliente:
1. **Fazer Pedido** → Ganha cashback automaticamente
2. **Acumular Créditos** → Até atingir o mínimo (R$ 10,00)
3. **Usar no Próximo Pedido** → Desconto aplicado

### Para o Administrador:
1. **Acessar Painel** → carteira.html
2. **Visualizar Clientes** → Ver saldos e histórico
3. **Gerenciar Créditos** → Adicionar/remover manualmente
4. **Configurar Sistema** → Ajustar percentual e regras

## 📊 Exemplo Prático

```
Pedido de R$ 50,00
Cashback de 2% = R$ 1,00

Após 10 pedidos de R$ 50,00:
Cashback acumulado = R$ 10,00
Cliente pode usar no próximo pedido!
```

## ⚙️ Configurações

### Percentual de Cashback
- **Padrão:** 2%
- **Ajustável:** 0.1% até 100%
- **Exemplo:** 
  - 2% de R$ 50,00 = R$ 1,00
  - 5% de R$ 50,00 = R$ 2,50

### Valor Mínimo para Uso
- **Padrão:** R$ 10,00
- **Ajustável:** Qualquer valor
- **Motivo:** Evitar uso de valores muito pequenos

### Ativar/Desativar Sistema
- Toggle para ligar/desligar cashback
- Quando desativado, não gera novos cashbacks
- Saldos existentes são mantidos

## 💾 Armazenamento

### Dados Salvos no localStorage:

1. **acai_wallets** - Carteiras dos clientes
```json
{
  "13999999999": {
    "name": "João Silva",
    "phone": "13999999999",
    "balance": 15.50,
    "totalEarned": 25.00,
    "totalUsed": 9.50,
    "transactions": [...]
  }
}
```

2. **acai_cashback_settings** - Configurações
```json
{
  "cashbackPercentage": 2.0,
  "minUsage": 10.00,
  "active": true
}
```

## 📱 Interface do Painel

### Cards de Estatísticas
- **Total de Clientes** - Quantidade de carteiras ativas
- **Cashback Total Acumulado** - Soma de todos os créditos gerados
- **Cashback Utilizado** - Soma de todos os créditos usados

### Card de Cliente
Cada cliente tem um card com:
- Nome e telefone
- Saldo disponível (destaque se pode usar)
- Total ganho e total usado
- Histórico de transações
- Botões de ação (adicionar, usar, excluir)

### Histórico de Transações
Para cada movimentação:
- Tipo (crédito ou débito)
- Valor
- Motivo
- Data e hora
- Saldo após a transação

## 🔧 Funcionalidades Administrativas

### ➕ Adicionar Crédito Manual
Use para:
- Bônus de boas-vindas
- Promoções especiais
- Compensações
- Prêmios de fidelidade

### 💳 Usar Crédito
Use para:
- Aplicar desconto manualmente
- Simular uso em pedido
- Ajustes de saldo

### 🗑️ Excluir Carteira
Use para:
- Remover clientes inativos
- Limpar dados de teste
- Corrigir duplicatas

### ⚙️ Configurações
Ajuste:
- Percentual de cashback
- Valor mínimo para uso
- Ativar/desativar sistema

## 🔗 Integração Automática

O sistema se integra automaticamente com os pedidos:

1. Cliente faz pedido
2. Sistema calcula cashback (2% do total)
3. Crédito é adicionado automaticamente
4. Cliente recebe notificação (futuro)

### Arquivo de Integração
`scriptJs/wallet-integration.js` - Intercepta pedidos e adiciona cashback

## 📈 Relatórios e Estatísticas

### Métricas Disponíveis:
- Total de clientes com cashback
- Valor total de cashback gerado
- Valor total de cashback utilizado
- Saldo médio por cliente
- Cliente com maior saldo

## 🎨 Visual e UX

### Indicadores Visuais:
- **Verde** - Saldo disponível para uso
- **Cinza** - Saldo insuficiente
- **Azul** - Créditos usados
- **Verde claro** - Créditos ganhos

### Feedback ao Usuário:
- Toasts de confirmação
- Mensagens de erro claras
- Indicadores de status
- Histórico detalhado

## ⚠️ Importante

### Limitações Atuais:
- Dados salvos localmente (localStorage)
- Não sincroniza entre dispositivos
- Sem notificações automáticas ao cliente
- Sem limite de validade do cashback

### Recomendações:
- Fazer backup regular dos dados
- Comunicar clientes sobre o saldo
- Definir política clara de uso
- Considerar integração com banco de dados

## 🔮 Melhorias Futuras

- [ ] Notificação automática ao cliente
- [ ] SMS/WhatsApp com saldo
- [ ] Validade do cashback (ex: 90 dias)
- [ ] Níveis de fidelidade (bronze, prata, ouro)
- [ ] Cashback progressivo (quanto mais compra, mais ganha)
- [ ] Integração com banco de dados
- [ ] App mobile para cliente consultar saldo
- [ ] QR Code para uso rápido
- [ ] Relatórios avançados
- [ ] Export para Excel/PDF

## 📞 Uso no Atendimento

### Ao Receber Pedido:
1. Perguntar se cliente quer usar cashback
2. Consultar saldo no painel
3. Aplicar desconto se disponível
4. Informar novo saldo após pedido

### Exemplo de Diálogo:
```
Atendente: "Olá! Você tem R$ 15,00 de cashback disponível. 
            Deseja usar no pedido de hoje?"
Cliente: "Sim!"
Atendente: "Ótimo! Seu pedido de R$ 50,00 ficará R$ 35,00.
            E você ainda vai ganhar R$ 0,70 de cashback!"
```

## 🎁 Ideias de Promoções

### Bônus de Boas-Vindas
- R$ 5,00 para primeiro pedido

### Aniversário
- R$ 10,00 no mês do aniversário

### Indique e Ganhe
- R$ 5,00 para quem indica
- R$ 5,00 para quem foi indicado

### Metas de Compra
- Compre 10 vezes, ganhe R$ 20,00

## 📊 KPIs Sugeridos

- Taxa de retorno de clientes com cashback
- Valor médio de pedido com cashback
- Percentual de clientes que usam cashback
- Tempo médio para acumular R$ 10,00
- ROI do programa de fidelidade

---

✨ **Sistema pronto para fidelizar seus clientes!** 💰
