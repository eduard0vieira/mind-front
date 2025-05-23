
# Blog Frontend

Este é o frontend do sistema de blog desenvolvido em Next.js com React. Ele consome a API backend para permitir aos usuários visualizar, criar, editar e remover artigos, além de fazer login e cadastro.

## Tecnologias Utilizadas

- Next.js
- React
- TypeScript
- react-hot-toast (para notificações)
- axios (para chamadas HTTP)
- Tailwind CSS (para estilização)
- Outras dependências comuns de React/Next

## Requisitos

- Node.js (versão 16 ou superior recomendada)
- npm ou yarn

## Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO_FRONTEND>
cd nome-do-repositorio-frontend
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> Ajuste a URL da API conforme necessário.

### 4. Rode o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O app estará disponível em `http://localhost:3000`.

---

## Funcionalidades

- Visualizar lista de artigos
- Visualizar artigo individual
- Cadastro e login de usuários
- Criar, editar e deletar artigos (para usuários autenticados)
- Upload de imagens destacadas para artigos
- Visualização de perfil e edição de avatar

## Estrutura do Projeto

- `pages/`: Páginas do Next.js
- `components/`: Componentes React reutilizáveis
- `styles/`: Estilos CSS e Tailwind config
- `utils/`: Utilitários e funções auxiliares
- `hooks/`: Hooks personalizados

## Scripts úteis

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: gera build para produção
- `npm run start`: inicia o app em modo produção (após build)
- `npm run lint`: executa análise de código

## Observações

- O frontend depende do backend estar rodando e acessível para funcionar corretamente.
- As rotas de API são chamadas com o token JWT salvo no `localStorage`.
- Certifique-se de que as imagens carregadas estejam sendo servidas corretamente pelo backend.
- A UI segue o layout base do Figma com algumas adaptações para melhor usabilidade.

---

## Contato

Em caso de dúvidas, entre em contato com o desenvolvedor.

---
