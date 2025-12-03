# ⚙️ Sistema de Controle de Cardápio

Sistema completo para gerenciar preços, estoque e disponibilidade dos itens do cardápio.

## 🎯 Funcionalidades

### ✅ Gerenciamento de Preços
- Alterar preço de qualquer item do cardápio
- Atualização em tempo real
- Validação de valores

### ✅ Controle de Estoque
- Definir quantidade disponível
- Opção de estoque ilimitado
- Marcar itens como esgotados
- Opções: Ilimitado, 10, 20, 30, 50, 100 unidades ou Esgotado

### ✅ Ativar/Desativar Itens
- Toggle simples para cada item
- Itens desativados não aparecem no site
- Visual claro do status (verde = ativo, cinza = inativo)

### ✅ Categorias Gerenciadas
1. **📏 Tamanhos Base**
   - Tigela (350ml, 500ml, 750ml)
   - Copo (300ml, 500ml, 700ml)
   - Batido (300ml, 500ml)
   - Mais Pedidos (350ml, 500ml, 700ml)

2. **🍽️ Opções Prontas**
   - Batido, Tradicional, Kids
   - Especial, Tropical, Premium

3. **🍓 Complementos e Adicionais**
   - Frutas (Banana, Morango, Uva, Abacaxi, Kiwi)
   - Complementos (Granola, Aveia, Leite em Pó, Paçoca)
   - Coberturas (Mel, Nutella, Leite Condensado)

4. **🍧 Combos Promocionais**
   - Todos os 11 combos disponíveis

## 🚀 Como Usar

### Acessar o Painel
1. Abra `controle.html` no navegador
2. Ou clique em "⚙️ Cardápio" no painel admin
3. Ou clique em "⚙️ Cardápio" no painel de pedidos

### Alterar Preços
1. Navegue até a aba desejada
2. Localize o item
3. Digite o novo preço no campo "Preço"
4. Clique em "💾 Salvar Todas as Alterações"

### Gerenciar Estoque
1. Localize o item
2. Selecione a quantidade no dropdown "Estoque"
3. Opções disponíveis:
   - **Ilimitado** - Sempre disponível
   - **10, 20, 30, 50, 100** - Quantidade específica
   - **Esgotado** - Item indisponível
4. Clique em "💾 Salvar Todas as Alterações"

### Ativar/Desativar Itens
1. Localize o item
2. Clique no toggle (botão deslizante)
   - **Verde** = Item ativo (aparece no site)
   - **Cinza** = Item inativo (não aparece no site)
3. Clique em "💾 Salvar Todas as Alterações"

## 💾 Armazenamento

Os dados são salvos no **localStorage** do navegador:
- ✅ Salvamento automático a cada 30 segundos
- ✅ Salvamento manual com botão "Salvar"
- ✅ Dados persistem entre sessões
- ⚠️ Dados são locais ao navegador

## 🔧 Funcionalidades Extras

### 💾 Salvar Alterações
Salva todas as modificações feitas no cardápio.

### 🔄 Restaurar Padrões
Restaura todos os valores originais do cardápio (preços, estoque, status).
**Atenção:** Esta ação não pode ser desfeita!

### 📥 Exportar Dados
Exporta todos os dados do cardápio em formato JSON para backup.

## 📊 Estrutura de Dados

```json
{
  "tamanhos": {
    "tigela": [...],
    "copo": [...],
    "batido": [...],
    "maisPedidos": [...]
  },
  "prontas": [...],
  "complementos": {
    "frutas": [...],
    "complementos": [...],
    "coberturas": [...]
  },
  "combos": [...]
}
```

## 🔗 Integração com o Site

O sistema de controle **NÃO altera** o código do site principal.
Os dados são lidos do localStorage quando necessário.

Para integrar com o site (futuro):
1. Ler dados de `localStorage.getItem('acai_menu_data')`
2. Usar os valores de `price`, `active` e `stock`
3. Filtrar itens inativos
4. Verificar estoque antes de adicionar ao carrinho

## ⚠️ Importante

- As alterações afetam apenas o navegador atual
- Para sincronizar entre dispositivos, será necessário integração com banco de dados
- Faça backups regulares usando "Exportar Dados"
- Teste as alterações antes de aplicar em produção

## 🎨 Interface

- **Abas organizadas** por categoria
- **Visual limpo** e intuitivo
- **Cores consistentes** com o site
- **Responsivo** para mobile e desktop

## 📱 Navegação

- **🏠 Site** - Volta para o site principal
- **📦 Pedidos** - Vai para o painel de pedidos
- **⚙️ Cardápio** - Painel de controle (você está aqui)

## 🔮 Próximas Melhorias

- [ ] Histórico de alterações de preços
- [ ] Alertas de estoque baixo
- [ ] Relatório de itens mais vendidos
- [ ] Importação de dados JSON
- [ ] Sincronização com banco de dados
- [ ] Controle de promoções e descontos
