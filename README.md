# Cantina — API e aplicação mobile (Expo)

Este repositório contém a **API mock** (json-server) e o **app** React Native com Expo, na pasta `cantina-expo/`. O cardápio vem do ficheiro `cantina-expo/server.json`; a app lê e altera dados através de HTTP.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (LTS recomendado)
- npm (incluído com o Node)
- Para testar em telemóvel: [Expo Go](https://expo.dev/go) ou um emulador (Android Studio / Xcode)

---

## Como rodar a API

A API é um **JSON Server** customizado (`cantina-expo/api-server.js`), que serve o conteúdo de `cantina-expo/server.json` e escuta em todas as interfaces (`0.0.0.0`) na porta **3000** .

1. Abra um terminal e entre na pasta do projeto:

   ```bash
   cd cantina-expo
   ```

2. Instale as dependências (só precisa fazer uma vez, ou após alterar o `package.json`):

   ```bash
   npm install
   ```

3. Inicie o servidor:

   ```bash
   npm run api
   ```

4. Deve aparecer algo como: `JSON Server is running on http://0.0.0.0:3000`.

   - No **computador** ou no **Expo Web**, a base costuma ser `http://localhost:3000`.
   - No **emulador Android**, o código da app usa `http://10.0.2.2:3000` para alcançar o PC.
   - Num **telefone físico** na mesma rede Wi‑Fi, use o IP da máquina onde a API corre, por exemplo `http://192.168.1.50:3000`, e configure a variável abaixo.

### Variáveis de ambiente da API (opcional)

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta (predefinido: `3000`) |
| `HOST` | Host de escuta (predefinido: `0.0.0.0`) |

Exemplo (PowerShell):

```powershell
$env:PORT=4000; npm run api
```

## Como rodar a aplicação

Mantenha a **API a correr** noutro terminal (`npm run api` dentro de `cantina-expo`).

1. Na pasta `cantina-expo`:

   ```bash
   cd cantina-expo
   npm install
   npm start
   ```

2. No ecrã do Expo:
   - **Web**: prima `w` ou escolha a opção web.
   - **Android / iOS**: emulador ou dispositivo com Expo Go (código QR).

### Se o telemóvel não ligar à API

Defina a URL completa da API antes de iniciar o Expo (substitua pelo IP do seu PC):

```powershell
$env:EXPO_PUBLIC_API_BASE_URL="http://192.168.x.x:3000"; npm start
```
---

## Funcionalidades: listar, editar e excluir

### Listar (dois modos)

1. **Cardápio do restaurante** (grid com imagens)  
   - Os itens aparecem em grid, agrupados por categoria.

2. **Listagem** (vista em lista, sem ícones de editar/lixo)  
   - No mesmo menu lateral, escolha a opção de **listagem**.  
   - Serve para ver nome, descrição e preço em formato de lista; tocar numa linha abre o **detalhe** do produto.

Em ambos os modos, **tocar no cartão** (não nos ícones pequenos) abre o **modal de detalhe** com imagem, texto e preço.

### Editar

- Disponível apenas na vista **Cardápio** (grid), em cada `ItemCard`.
- Toque no ícone **editar** (canto inferior esquerdo do cartão).
- Abre-se o **EditItemModal**: altere nome, descrição, preço e URL da imagem; confirme para gravar na API.
- Após sucesso, a lista é atualizada automaticamente (React Query).

### Excluir

- Também só na vista **Cardápio**, no ícone **lixeira** (canto inferior direito).
- Abre-se o **ConfirmDeleteItemModal** para confirmar; ao confirmar, o item é removido da categoria via API e a lista atualiza-se.

### Adicionar (extra)

- Na vista **Cardápio**, o botão flutuante **+** (FAB) abre o **AddItemBottomSheet** para criar um novo item numa categoria escolhida.

---

## Função de cada componente

Ficheiros em `cantina-expo/src/components/` e ecrã principal:

| Componente | Função |
|------------|--------|
| **`App.ts`** | Raiz da app: carrega fontes Roboto, envolve tudo com `QueryClientProvider` (React Query) e `SafeAreaProvider`, e renderiza o ecrã principal. |
| **`CardapioScreen`** | Ecrã principal: carrega o catálogo (`useCatalog`), alterna entre vistas **Cardápio** e **Listagem**, trata erros e vazio, e orquestra modais (detalhe, editar, excluir, adicionar) e o menu lateral. |
| **`AppHeader`** | Barra superior com logótipo e botão de **menu** (hamburger) que abre/fecha a sidebar. |
| **`MobileSidebar`** | Painel lateral animado com atalhos para **Cardápio** e **Listagem**; o ecrã reage aos toques e fecha o painel. |
| **`CategoryHeading`** | Título de secção com linhas laterais para cada **categoria** no scroll. |
| **`ItemCard`** | Cartão na grid: imagem, nome, preço, descrição; toque no cartão abre detalhe; ícones **editar** e **lixeira** disparam edição e exclusão. |
| **`CatalogListingCard`** | Linha compacta na vista **Listagem** (nome, descrição, preço); toque abre o detalhe. |
| **`ProductDetailModal`** | Modal só de leitura com foto, nome, preço e descrição do item selecionado. |
| **`EditItemModal`** | Modal com formulário que chama `updateCatalogItem` e invalida a query do catálogo após gravar. |
| **`ConfirmDeleteItemModal`** | Modal de confirmação que chama `deleteCatalogItem` e atualiza a lista; pode fechar o detalhe se o item apagado for o que estava aberto. |
| **`AddItemBottomSheet`** | Formulário para novo item (categoria, nome, preço, etc.) via `addCatalogItem`. |

### Camada API (resumo)

| Módulo | Função |
|--------|--------|
| `src/api/catalog.ts` | `fetchCatalog` — `GET` do catálogo. |
| `src/api/addCatalogItem.ts` | Inserir item numa categoria. |
| `src/api/updateCatalogItem.ts` | Atualizar um item (ler categoria, substituir item, `PUT`). |
| `src/api/deleteCatalogItem.ts` | Remover item do array da categoria (`PUT`). |
| `src/api/http.ts` / `resolveApiBaseUrl.ts` | Pedidos HTTP e resolução da URL base (web, emulador, IP do dev). |
| `src/hooks/useCatalog.ts` | Hook React Query que expõe `data`, loading, erro e `refetch` para o catálogo. |

---



## Estrutura rápida

```text
frontMobile/
└── cantina-expo/
    ├── api-server.js      # Servidor JSON (API mock)
    ├── server.json        # Dados do cardápio
    ├── routes.json        # Regras do json-server (pode estar vazio)
    ├── App.ts
    └── src/
        ├── api/
        ├── components/
        ├── hooks/
        └── screens/
```
