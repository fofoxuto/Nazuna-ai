<div align="center">
  <h1>🌙 Nazuna AI</h1>
  <p><em>Uma assistente virtual moderna, minimalista e divertida, criada para conversar de forma natural e ter sua própria personalidade.</em></p>

  <p>
    <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-9d7cff?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  </p>
</div>

---

## 🎨 Sobre o Projeto

A **Nazuna AI** é uma assistente virtual construída para proporcionar uma experiência de conversa simples, natural e agradável.

O projeto combina uma interface moderna e minimalista com uma personalidade própria: uma **vampira moderna**, casual, divertida e com um toque ocasional de *tsundere*.

A interface foi desenvolvida seguindo uma estética **dark e noturna**, utilizando superfícies translúcidas, bordas sutis, efeitos de desfoque e detalhes em tons de roxo para criar uma identidade visual própria para a Nazuna.

O projeto também foi estruturado de forma modular, separando responsabilidades entre frontend, backend, integração com inteligência artificial, processamento de respostas, rotas e controllers.

---

## ✨ Funcionalidades

- **🤖 Inteligência Artificial:** Conversas alimentadas pela API do Google Gemini.
- **🌙 Personalidade da Nazuna:** Personalidade própria definida através de instruções específicas, incluindo humor, informalidade e comportamento de vampira moderna.
- **💬 Chat Interativo:** Interface de conversa com mensagens do usuário e da Nazuna.
- **⌨️ Envio com Enter:** Pressione `Enter` para enviar mensagens e `Shift + Enter` para criar novas linhas.
- **💭 Indicador de Digitação:** A Nazuna exibe um indicador enquanto aguarda a resposta da IA.
- **💡 Sugestões Rápidas:** Sugestões de mensagens para iniciar uma conversa rapidamente.
- **👤 Perfil do Usuário:** Nome e avatar do usuário são atualizados automaticamente.
- **💾 LocalStorage:** O nome do usuário é armazenado localmente no navegador.
- **📱 Interface Responsiva:** Layout adaptado para computadores e dispositivos móveis.
- **🧹 Limpeza de Conversa:** Permite limpar a conversa atual e iniciar uma nova.
- **🧠 Estrutura para Memória:** O sistema de respostas possui suporte inicial para identificar informações que poderão ser utilizadas futuramente em um sistema de memória.
- **📦 Backend Modular:** Código separado por responsabilidades para facilitar manutenção e evolução do projeto.

---

## 🚀 Tecnologias Utilizadas

* **HTML5** — Estrutura da interface e componentes da aplicação.
* **CSS3** — Estilização avançada com Variáveis CSS, Flexbox, Glassmorphism, efeitos de blur e design responsivo.
* **JavaScript (ES6+)** — Interações da interface, gerenciamento do chat, LocalStorage e comunicação com o backend.
* **Node.js** — Ambiente utilizado para execução do backend.
* **Express.js** — Framework utilizado para criação do servidor e das rotas da API.
* **Google Gemini API** — Modelo de inteligência artificial utilizado para gerar as respostas da Nazuna.

---

## 🖥️ Prévia da Interface

A interface foi desenvolvida para transmitir uma sensação **minimalista, confortável e noturna**, mantendo o foco na conversa.

- **🌑 Dark Theme:** Base escura com diferentes níveis de superfície para criar profundidade.
- **💜 Accent Roxo:** Tons suaves de roxo utilizados para destacar elementos importantes da interface.
- **🪟 Glassmorphism:** Superfícies translúcidas e efeitos de desfoque utilizados em elementos específicos.
- **💬 Mensagens Tácteis:** Bolhas de conversa com bordas assimétricas e pequenas interações visuais.
- **✨ Microinterações:** Botões e componentes possuem pequenas animações de hover, foco e pressionamento.
- **📐 Layout Responsivo:** A interface se adapta a diferentes tamanhos de tela.

---

## 🧩 Estrutura do Projeto

A aplicação utiliza uma estrutura modular para separar as principais responsabilidades:

````text
nazuna-ai/
├── server.js
├── package.json
├── package-lock.json
├── .env
│
├── config/
│   ├── env.js
│   └── server.config.js
│
├── prompts/
│   └── nazuna.instructions.js
│
├── ai/
│   └── gemini.js
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
├── middleware/
│   └── error.middleware.js
│
└── public/
    ├── index.html
    ├── app.js
    └── style.css
````

---

## 🤖 Resposta da IA

A Nazuna utiliza respostas estruturadas em JSON para facilitar o processamento das mensagens no backend.

O formato principal utilizado é:

````json
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
````

O campo `resp` contém as mensagens que serão exibidas no chat.

O campo `react` pode conter uma reação associada à resposta.

O campo `aprender` foi criado para preparar o projeto para futuras funcionalidades de memória.

---

## 💾 Informações do Usuário

O nome do usuário é armazenado localmente utilizando o `localStorage` do navegador.

A chave utilizada atualmente é:

````text
nazunaUserName
````

Na primeira visita, a aplicação pergunta:

> **Como posso te chamar? 💜**

Depois que o usuário informa seu nome, ele é salvo localmente e utilizado para atualizar o perfil exibido na sidebar.

O nome também é utilizado como identificação nas mensagens enviadas pelo usuário.

Atualmente, essa informação permanece apenas no frontend e **não é enviada ao Gemini**.

---

## 📦 Como Executar o Projeto

### 1. Clone o repositório

````bash
git clone SEU_REPOSITORIO
````

Depois entre na pasta:

````bash
cd nazuna-ai
````

### 2. Instale as dependências

````bash
npm install
````

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

````env
PORT=3000
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-3.6-flash
````

> ⚠️ Nunca publique sua `GEMINI_API_KEY` em um repositório público.

### 4. Inicie o servidor

````bash
node server.js
````

Depois abra no navegador:

````text
http://localhost:3000
````

---

## 🔐 Segurança

A chave da API do Gemini deve permanecer exclusivamente no backend.

Recomenda-se manter o arquivo `.env` fora do controle de versão:

````text
.env
````

O arquivo `.env` não deve ser enviado para o GitHub ou disponibilizado publicamente.

---

## 🚧 Em Desenvolvimento

A Nazuna AI ainda está em desenvolvimento e novas funcionalidades estão sendo planejadas.

Algumas ideias para futuras versões:

- **🧠 Sistema de Memória Persistente**
- **💬 Histórico Real de Conversas**
- **👤 Perfil Completo do Usuário**
- **⚙️ Página de Configurações**
- **🎨 Personalização da Interface**
- **🔐 Sistema de Autenticação**
- **🗄️ Banco de Dados**
- **🔊 Interação por Voz**
- **🖼️ Suporte a Imagens**
- **📱 Integração com Instagram**
- **💜 Evolução da Personalidade da Nazuna**

---

## 📊 Status do Projeto

| Recurso | Status |
|---|---|
| Interface | ✅ Concluído |
| Backend | ✅ Concluído |
| Integração com Gemini | ✅ Concluído |
| Personalidade da Nazuna | ✅ Concluído |
| Parser JSON | ✅ Concluído |
| User Info | ✅ Concluído |
| LocalStorage | ✅ Concluído |
| Memória persistente | 🚧 Em desenvolvimento |
| Histórico de conversas | 🚧 Planejado |
| Banco de dados | 🚧 Planejado |
| Autenticação | 🚧 Planejado |

---

## 📬 Autor

Projeto **Nazuna AI**.

Criado com a ideia de transformar um simples chatbot em uma assistente virtual com **personalidade, identidade e memória próprias**.

<div align="center">

### 🌙 Nazuna AI

<em>Não é só um chatbot... é a Nazuna.</em>

</div>