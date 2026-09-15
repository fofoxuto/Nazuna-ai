<div align="center">🌙 Nazuna AI

<p>
  <em>Uma assistente virtual moderna, minimalista e divertida, criada para conversar de forma natural e ter sua própria personalidade.</em>
</p><p>
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-9d7cff?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p></div>---

🎨 Sobre o Projeto

A Nazuna AI é uma assistente virtual construída para proporcionar uma experiência de conversa simples, natural e agradável.

O projeto combina uma interface moderna e minimalista com uma personalidade própria: uma vampira moderna, casual, divertida e com um toque ocasional de tsundere.

A interface segue uma estética dark e noturna, utilizando superfícies translúcidas, bordas sutis, efeitos de desfoque e detalhes em tons de roxo para criar uma identidade visual própria para a Nazuna.

O projeto possui uma arquitetura modular, separando responsabilidades entre:

- Frontend
- Backend
- Integração com Gemini
- Prompts
- Parser de respostas
- Controllers
- Rotas
- Sistema de memória
- Banco de dados PostgreSQL

Atualmente, a aplicação está hospedada no Render, utilizando um Web Service para o backend e PostgreSQL para armazenamento persistente.

---

✨ Funcionalidades

- 🤖 Inteligência Artificial: Conversas alimentadas pela API do Google Gemini.
- 🌙 Personalidade da Nazuna: Personalidade própria definida através de instruções específicas.
- 💬 Chat Interativo: Interface de conversa com mensagens do usuário e da Nazuna.
- ⌨️ Envio com Enter: "Enter" envia a mensagem e "Shift + Enter" cria uma nova linha.
- 💭 Indicador de Digitação: Exibe uma animação enquanto a Nazuna processa a resposta.
- 💡 Sugestões Rápidas: Mensagens pré-definidas para iniciar uma conversa.
- 👤 Identidade do Usuário: Cada navegador recebe um UUID próprio para identificar suas memórias.
- 🪪 Nome do Usuário: O usuário pode definir como deseja ser chamado.
- 💾 LocalStorage: Nome e UUID do usuário são armazenados localmente no navegador.
- 🧠 Memória Persistente: Informações aprendidas pela Nazuna podem ser armazenadas no PostgreSQL.
- 🔄 Atualização de Memórias: Memórias existentes podem ser atualizadas sem criar duplicatas.
- 🗑️ Remoção de Memórias: O sistema possui suporte para remover informações armazenadas.
- 📦 Limite de Memória: Cada usuário possui um limite de memórias persistentes.
- 🧹 Limpeza de Conversa: Permite limpar a conversa atual da interface.
- 📱 Interface Responsiva: Layout adaptado para computadores e dispositivos móveis.
- 🧩 Backend Modular: Cada parte da aplicação possui uma responsabilidade específica.
- 🩺 Health Check: O backend possui uma rota de verificação de saúde da aplicação.

---

🧠 Sistema de Memória

Uma das principais funcionalidades da arquitetura atual é o sistema de memória persistente.

Antes de gerar uma resposta, o backend consulta as memórias associadas ao UUID do usuário e adiciona essas informações ao contexto enviado para a IA.

O fluxo funciona aproximadamente assim:

Usuário
   │
   ▼
Frontend
   │
   │ message + userId
   ▼
POST /api/chat
   │
   ▼
Chat Controller
   │
   ├── Consulta memórias
   │
   ▼
PostgreSQL
   │
   └── Memórias do usuário
   │
   ▼
Gemini
   │
   ├── Resposta
   └── aprender
   │
   ▼
Parser
   │
   ▼
Memory Store
   │
   └── Salva/atualiza memória
   │
   ▼
Frontend

As memórias possuem:

categoria
chave
valor
created_at
updated_at

Cada memória é associada a um "user_id" no formato UUID.

A combinação:

user_id + categoria + chave

é única, evitando duplicações da mesma informação.

---

🗄️ PostgreSQL

O sistema utiliza PostgreSQL para armazenar as memórias persistentes.

A tabela principal é:

memories

Estrutura:

id
user_id
categoria
chave
valor
created_at
updated_at

O banco pode ser hospedado separadamente do Web Service. No ambiente de produção, a conexão é fornecida através da variável:

DATABASE_URL

O backend testa a conexão com o banco durante a inicialização da aplicação.

Quando a conexão é estabelecida, o servidor registra:

🗄️ [DATABASE] PostgreSQL conectado com sucesso.

---

👤 Identidade do Usuário

Cada navegador recebe um UUID exclusivo.

Exemplo:

c19f0afb-5f11-4ed5-b141-750afe8b4dab

Esse identificador é armazenado no:

localStorage

utilizando a chave:

nazunaUserId

O UUID é enviado ao backend junto com cada mensagem:

{
  "message": "Oii",
  "userId": "c19f0afb-5f11-4ed5-b141-750afe8b4dab"
}

O backend utiliza esse identificador para recuperar e salvar as memórias pertencentes àquele usuário.

---

💜 Nome do Usuário

O nome escolhido pelo usuário também é armazenado localmente.

A chave utilizada é:

nazunaUserName

Na primeira visita, a aplicação pergunta:

«Como posso te chamar?»

Depois disso, o nome é utilizado na interface para:

- Avatar do usuário
- Nome exibido nas mensagens
- Card de usuário da sidebar

O nome atualmente permanece no "localStorage" e não é utilizado como identificador do banco de dados.

O identificador real das memórias é o UUID.

---

🤖 Resposta da IA

A Nazuna utiliza respostas estruturadas em JSON.

O formato esperado é:

{
  "resp": [
    {
      "id": "chat",
      "resp": "Sua resposta aqui.",
      "react": ""
    }
  ],
  "aprender": null
}

"resp"

Contém as mensagens que devem ser exibidas no frontend.

Cada item possui:

id
resp
react

"react"

Pode conter uma reação associada à mensagem.

"aprender"

É utilizado pelo sistema de memória.

Quando a Nazuna identifica uma informação que deve ser persistida, pode retornar um objeto como:

{
  "acao": "adicionar",
  "categoria": "interesse",
  "chave": "musica",
  "valor": "gosta de shoegaze"
}

O backend então processa essa informação através do "memory.store".

---

🧩 Arquitetura

A aplicação possui uma separação entre apresentação, API, inteligência artificial e persistência.

                    ┌────────────────────┐
                    │      Frontend      │
                    │ HTML / CSS / JS    │
                    └─────────┬──────────┘
                              │
                              │ HTTP
                              ▼
                    ┌────────────────────┐
                    │      Express       │
                    │      /api/chat     │
                    └─────────┬──────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼                    ▼
             ┌──────────────┐     ┌──────────────┐
             │   Memory     │     │    Gemini    │
             │    Store     │     │     API      │
             └──────┬───────┘     └──────┬───────┘
                    │                    │
                    ▼                    ▼
             ┌──────────────┐     ┌──────────────┐
             │ PostgreSQL   │     │    Parser    │
             └──────────────┘     └──────┬───────┘
                                         │
                                         ▼
                                  Resposta estruturada

---

📁 Estrutura do Projeto

nazuna-ai/
│
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
│
├── config/
│   └── database.js
│
├── database/
│   └── schema.sql
│
├── prompts/
│   └── nazuna.instructions.js
│
├── ai/
│   └── gemini.js
│
├── memory/
│   └── memory.store.js
│
├── parsers/
│   ├── response.cleaner.js
│   ├── json.extractor.js
│   └── nazuna.parser.js
│
├── routes/
│   ├── chat.routes.js
│   └── health.routes.js
│
├── controllers/
│   ├── chat.controller.js
│   └── health.controller.js
│
└── public/
    ├── index.html
    ├── app.js
    └── style.css

Principais responsabilidades

Diretório/arquivo| Responsabilidade
"server.js"| Inicialização do servidor
"config/database.js"| Conexão com PostgreSQL
"database/schema.sql"| Estrutura inicial do banco
"prompts/"| Personalidade e instruções da Nazuna
"ai/gemini.js"| Comunicação com Gemini
"memory/"| Leitura e persistência das memórias
"parsers/"| Limpeza e interpretação das respostas
"controllers/"| Lógica das requisições
"routes/"| Endpoints da API
"public/"| Interface da aplicação

---

🚀 Tecnologias Utilizadas

Frontend

- HTML5 — Estrutura da interface.
- CSS3 — Design, responsividade, animações e efeitos visuais.
- JavaScript ES6+ — Interações, estado do chat, LocalStorage e comunicação com a API.

Backend

- Node.js — Ambiente de execução.
- Express.js — Servidor HTTP e API.
- PostgreSQL — Banco de dados persistente.
- node-postgres ("pg") — Comunicação entre Node.js e PostgreSQL.

Inteligência Artificial

- Google Gemini API — Geração das respostas da Nazuna.

Hospedagem

- Render Web Service — Backend e frontend.
- Render PostgreSQL — Banco de dados persistente.

---

📦 Como Executar Localmente

1. Clone o repositório

git clone https://github.com/fofoxuto/Nazuna-ai.git

Entre na pasta:

cd Nazuna-ai

2. Instale as dependências

npm install

3. Configure o ambiente

Crie um arquivo:

.env

com:

PORT=3000

GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-3.6-flash

DATABASE_URL=postgresql://usuario:senha@host:5432/nazuna

NODE_ENV=development

4. Configure o banco

Execute o conteúdo de:

database/schema.sql

no PostgreSQL utilizado pelo projeto.

5. Inicie o servidor

node server.js

A aplicação ficará disponível em:

http://localhost:3000

---

🌐 Deploy

A arquitetura utilizada em produção é:

Render
│
├── nazuna-ai
│   └── Web Service
│
└── nazunadb
    └── PostgreSQL

O Web Service utiliza as seguintes variáveis de ambiente:

GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.6-flash
DATABASE_URL=...
NODE_ENV=production

A porta do servidor é fornecida pelo ambiente através da variável:

PORT

O backend utiliza:

const PORT =
    process.env.PORT || 3000;

---

🔐 Segurança

A chave da API do Gemini deve permanecer exclusivamente no backend.

Nunca coloque a chave diretamente no frontend.

❌ Não faça:

const API_KEY =
    "sua-chave-aqui";

A chave deve ser fornecida através de uma variável de ambiente:

GEMINI_API_KEY=sua_chave

O arquivo ".env" também não deve ser enviado para o GitHub.

.env

deve permanecer no ".gitignore".

A "DATABASE_URL" também é uma credencial sensível e não deve ser publicada.

---

🎨 Interface

A interface foi projetada com uma estética dark, minimalista e noturna.

Principais características:

- 🌑 Dark Theme
- 💜 Accent em tons de roxo
- 🪟 Superfícies translúcidas
- 🌫️ Blur e efeitos de profundidade
- 💬 Mensagens assimétricas
- ✨ Microinterações
- 📱 Layout responsivo
- 🧭 Sidebar adaptada para dispositivos móveis
- ⌨️ Input com redimensionamento automático
- 💭 Indicador de digitação

A interface também foi construída sem frameworks de frontend, utilizando apenas:

HTML
CSS
JavaScript

---

🚧 Em Desenvolvimento

A base principal da aplicação já está funcionando, mas o projeto continua em desenvolvimento.

Próximos possíveis recursos:

- 💬 Histórico persistente de conversas
- ⚙️ Página de configurações
- 🎨 Personalização da interface
- 🔐 Sistema de autenticação
- 🔊 Interação por voz
- 🖼️ Suporte a imagens
- 📱 Mais recursos para dispositivos móveis
- 🧠 Evolução do sistema de memória
- 🗂️ Gerenciamento de memórias
- 💜 Evolução contínua da personalidade da Nazuna

---

📊 Status do Projeto

Recurso| Status
Interface| ✅
Design responsivo| ✅
Chat| ✅
Backend| ✅
Express API| ✅
Integração com Gemini| ✅
Personalidade da Nazuna| ✅
Parser JSON| ✅
Identidade por UUID| ✅
Nome do usuário| ✅
LocalStorage| ✅
PostgreSQL| ✅
Memória persistente| ✅
Criação de memórias| ✅
Atualização de memórias| ✅
Remoção de memórias| ✅
Limite de memórias| ✅
Histórico persistente| 🚧
Configurações| 🚧
Autenticação| 📋 Planejado
Voz| 📋 Planejado
Imagens| 📋 Planejado

---

📜 Licença

Este projeto ainda não possui uma licença de código aberto definida.

---

🌙 Autor

Projeto Nazuna AI.

Criado com a ideia de transformar um simples chatbot em uma assistente virtual com personalidade, identidade e memória próprias.

<div align="center">🌙 Nazuna AI

<em>Uma pequena IA com personalidade própria.</em>

</div>