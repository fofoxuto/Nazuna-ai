const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");

const chat = document.getElementById("chat");
const welcome = document.getElementById("welcome");
const messages = document.getElementById("messages");

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

const newChatButton = document.getElementById("newChat");
const clearChatButton = document.getElementById("clearChat");

const suggestions = document.querySelectorAll(".suggestion");
const historyList = document.getElementById("historyList");

let isLoading = false;

/* =========================
UTILIDADES
========================= */

function scrollToBottom(smooth = true) {

requestAnimationFrame(() => {

    chat.scrollTo({
        top: chat.scrollHeight,
        behavior: smooth ? "smooth" : "auto"
    });

});

}

function autoResizeInput() {

messageInput.style.height = "auto";

messageInput.style.height =
    Math.min(messageInput.scrollHeight, 150) + "px";

}

/* =========================
MENSAGENS
========================= */

function addMessage(content, type, react = "") {

welcome.style.display = "none";

const message = document.createElement("div");

message.className =
    `message ${type}`;

/* =========================
AVATAR
========================= */

const avatar =
    document.createElement("div");

avatar.className =
    "message-avatar";

avatar.textContent =
    type === "ai"
        ? "N"
        : "T";

/* =========================
CONTEÚDO
========================= */

const messageContent =
    document.createElement("div");

messageContent.className =
    "message-content";

/* =========================
NOME
========================= */

const name =
    document.createElement("div");

name.className =
    "message-name";

name.textContent =
    type === "ai"
        ? "Nazuna"
        : "Você";

/* =========================
TEXTO
========================= */

const text =
    document.createElement("div");

text.className =
    "message-text";

/*
    Nunca coloque objetos diretamente
    no textContent.

    Isso evita:
    [object Object]
*/

text.textContent =
    typeof content === "string"
        ? content
        : String(content ?? "");

messageContent.appendChild(name);
messageContent.appendChild(text);

/* =========================
REAÇÃO
========================= */

if (
    type === "ai" &&
    typeof react === "string" &&
    react.trim()
) {

    const reaction =
        document.createElement("div");

    reaction.className =
        "message-reaction";

    reaction.textContent =
        react;

    messageContent.appendChild(
        reaction
    );

}

/* =========================
MONTAR
========================= */

message.appendChild(avatar);

message.appendChild(
    messageContent
);

messages.appendChild(message);

scrollToBottom();

return message;

}

/* =========================
TYPING
========================= */

function showTyping() {

/*
    Evita criar vários indicadores
    ao mesmo tempo.
*/

if (
    document.getElementById(
        "typingMessage"
    )
) {

    return;

}

const typing =
    document.createElement("div");

typing.id =
    "typingMessage";

typing.className =
    "message ai";

typing.innerHTML = `
    <div class="message-avatar">
        N
    </div>

    <div class="message-content">

        <div class="message-name">
            Nazuna
        </div>

        <div class="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>

    </div>
`;

messages.appendChild(typing);

/*
    Scroll instantâneo aqui.
    Não espera animação.
*/

scrollToBottom(false);

}

/* =========================
REMOVER TYPING
========================= */

function removeTyping() {

const typing =
    document.getElementById(
        "typingMessage"
    );

if (typing) {

    typing.remove();

}

}

/* =========================
API
========================= */

async function sendToAI(message) {

const response =
    await fetch(
        "/api/chat",
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                message
            })

        }
    );

/*
    Lê o JSON somente uma vez.
*/

let data;

try {

    data =
        await response.json();

} catch {

    throw new Error(
        "O servidor retornou uma resposta inválida."
    );

}

if (!response.ok) {

    throw new Error(
        data?.error ||
        "Não foi possível conversar com a Nazuna."
    );

}

return data;

}

/* =========================
PROCESSAR RESPOSTA
========================= */

function displayAIResponse(data) {

const response =
    data?.response;

/*
    FORMATO ATUAL:

    response: [
        {
            id: "chat",
            resp: "Olá!",
            react: "👋"
        }
    ]
*/

if (
    Array.isArray(response)
) {

    let displayed = false;

    for (
        const item of response
    ) {

        if (!item) {
            continue;
        }

        const text =
            typeof item.resp === "string"
                ? item.resp.trim()
                : "";

        if (!text) {
            continue;
        }

        const react =
            typeof item.react === "string"
                ? item.react
                : "";

        addMessage(
            text,
            "ai",
            react
        );

        displayed = true;
    }

    if (displayed) {
        return;
    }
}

/*
    COMPATIBILIDADE COM BACKEND ANTIGO
*/

if (
    typeof response === "string" &&
    response.trim()
) {

    addMessage(
        response.trim(),
        "ai"
    );

    return;
}

/*
    RESPOSTA INVÁLIDA
*/

console.error(
    "Resposta inesperada da API:",
    data
);

throw new Error(
    "A resposta da Nazuna veio em um formato inesperado."
);

}

/* =========================
ENVIAR MENSAGEM
========================= */

async function sendMessage(message) {

message =
    message.trim();

if (
    !message ||
    isLoading
) {

    return;

}

/*
    Mostra a mensagem do usuário
    imediatamente.
*/

addMessage(
    message,
    "user"
);

/*
    Limpa o input.
*/

messageInput.value = "";

autoResizeInput();

/*
    Estado de carregamento.
*/

isLoading = true;

sendButton.disabled = true;

/*
    Mostra o "Nazuna está digitando"
    ANTES de chamar a API.
*/

showTyping();

/*
    Deixa o navegador atualizar a UI
    antes da requisição.
*/

await new Promise(
    resolve =>
        requestAnimationFrame(resolve)
);

try {

    /*
        Chama o backend.
    */

    const data =
        await sendToAI(message);

    /*
        Remove o typing assim que
        a resposta chega.
    */

    removeTyping();

    /*
        Mostra a resposta.
    */

    displayAIResponse(data);

    /*
        Memória retornada pelo backend.
    */

    if (
        data?.aprender
    ) {

        console.log(
            "🧠 Informação identificada para memória:",
            data.aprender
        );

    }

} catch (error) {

    removeTyping();

    console.error(
        "❌ Erro ao conversar com a Nazuna:",
        error
    );

    addMessage(
        "Não consegui falar com meu cérebro agora 😭~ Tenta novamente daqui a pouco.",
        "ai"
    );

} finally {

    isLoading = false;

    sendButton.disabled = false;

    messageInput.focus();

}

}

/* =========================
FORMULÁRIO
========================= */

chatForm.addEventListener(
"submit",
event => {

    event.preventDefault();

    if (isLoading) {
        return;
    }

    sendMessage(
        messageInput.value
    );

}

);

/* =========================
ENTER
========================= */

messageInput.addEventListener(
"keydown",
event => {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        if (!isLoading) {

            chatForm.requestSubmit();

        }

    }

}

);

/* =========================
INPUT
========================= */

messageInput.addEventListener(
"input",
autoResizeInput
);

/* =========================
SUGESTÕES
========================= */

suggestions.forEach(
button => {

    button.addEventListener(
        "click",
        () => {

            if (isLoading) {
                return;
            }

            const message =
                button.dataset.message;

            if (
                message &&
                message.trim()
            ) {

                sendMessage(
                    message
                );

            }

        }
    );

}

);

/* =========================
NOVA CONVERSA
========================= */

function newConversation() {

removeTyping();

messages.innerHTML = "";

welcome.style.display =
    "block";

messageInput.value = "";

autoResizeInput();

isLoading = false;

sendButton.disabled = false;

sidebar.classList.remove(
    "open"
);

messageInput.focus();

}

newChatButton.addEventListener(
"click",
newConversation
);

clearChatButton.addEventListener(
"click",
newConversation
);

/* =========================
MENU MOBILE
========================= */

menuButton.addEventListener(
"click",
event => {

    event.stopPropagation();

    sidebar.classList.toggle(
        "open"
    );

}

);

chat.addEventListener(
"click",
() => {

    sidebar.classList.remove(
        "open"
    );

}

);

/* =========================
HISTÓRICO
========================= */

historyList.addEventListener(
"click",
event => {

    const item =
        event.target.closest(
            ".history-item"
        );

    if (!item) {
        return;
    }

    document
        .querySelectorAll(
            ".history-item"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );

    item.classList.add(
        "active"
    );

    sidebar.classList.remove(
        "open"
    );

}

);

/* =========================
INICIALIZAÇÃO
========================= */

autoResizeInput();

messageInput.focus();

console.log(
"Nazuna AI frontend carregado ✨"
);