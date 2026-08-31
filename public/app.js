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

function scrollToBottom() {
requestAnimationFrame(() => {
chat.scrollTo({
top: chat.scrollHeight,
behavior: "smooth"
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

function addMessage(content, type) {

welcome.style.display = "none";

const message = document.createElement("div");
message.className = `message ${type}`;

const avatar = document.createElement("div");
avatar.className = "message-avatar";
avatar.textContent = type === "ai" ? "N" : "T";

const messageContent = document.createElement("div");
messageContent.className = "message-content";

const name = document.createElement("div");
name.className = "message-name";
name.textContent = type === "ai" ? "Nazuna" : "Você";

const text = document.createElement("div");
text.className = "message-text";

text.textContent = content;

messageContent.appendChild(name);
messageContent.appendChild(text);

message.appendChild(avatar);
message.appendChild(messageContent);

messages.appendChild(message);

scrollToBottom();

}

/* =========================
TYPING
========================= */

function showTyping() {

const typing = document.createElement("div");

typing.id = "typingMessage";
typing.className = "message ai";

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

scrollToBottom();

}

function removeTyping() {

const typing =
    document.getElementById("typingMessage");

if (typing) {
    typing.remove();
}

}

/* =========================
API
========================= */

async function sendToAI(message) {

const response = await fetch("/api/chat", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        message
    })

});


let data;

try {
    data = await response.json();
} catch {
    throw new Error(
        "O servidor retornou uma resposta inválida."
    );
}


if (!response.ok) {

    throw new Error(
        data.error ||
        "Não foi possível conversar com a Nazuna."
    );

}


return data.response;

}

/* =========================
ENVIAR MENSAGEM
========================= */

async function sendMessage(message) {

message = message.trim();

if (!message || isLoading) {
    return;
}


addMessage(message, "user");

messageInput.value = "";
autoResizeInput();

isLoading = true;
sendButton.disabled = true;

showTyping();


try {

    const response =
        await sendToAI(message);

    removeTyping();

    addMessage(response, "ai");


} catch (error) {

    removeTyping();

    console.error(
        "Erro ao conversar com a IA:",
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

    sendMessage(messageInput.value);

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

        chatForm.requestSubmit();

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

suggestions.forEach(button => {

button.addEventListener(
    "click",
    () => {

        const message =
            button.dataset.message;

        sendMessage(message);

    }
);

});

/* =========================
NOVA CONVERSA
========================= */

function newConversation() {

messages.innerHTML = "";

welcome.style.display = "block";

messageInput.value = "";

autoResizeInput();

messageInput.focus();

sidebar.classList.remove("open");

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

    sidebar.classList.toggle("open");

}

);

chat.addEventListener(
"click",
() => {

    sidebar.classList.remove("open");

}

);

/* =========================
HISTÓRICO
========================= */

historyList.addEventListener(
"click",
event => {

    const item =
        event.target.closest(".history-item");

    if (!item) {
        return;
    }

    document
        .querySelectorAll(".history-item")
        .forEach(button => {
            button.classList.remove("active");
        });

    item.classList.add("active");

    sidebar.classList.remove("open");

}

);

/* =========================
INICIALIZAÇÃO
========================= */

autoResizeInput();

messageInput.focus();

console.log("Nazuna AI frontend carregado ✨");