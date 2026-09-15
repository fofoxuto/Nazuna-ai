// =========================
// CONFIGURAÇÃO DA API
// =========================

const API_URL =
    "https://nazuna-ai.onrender.com";


// =========================
// ELEMENTOS
// =========================

const sidebar =
    document.getElementById("sidebar");

const menuButton =
    document.getElementById("menuButton");

const chat =
    document.getElementById("chat");

const welcome =
    document.getElementById("welcome");

const messages =
    document.getElementById("messages");

const chatForm =
    document.getElementById("chatForm");

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const newChatButton =
    document.getElementById("newChat");

const clearChatButton =
    document.getElementById("clearChat");

const suggestions =
    document.querySelectorAll(".suggestion");

const historyList =
    document.getElementById("historyList");

const settingsButton =
    document.getElementById("settingsButton");

const userNameElement =
    document.getElementById("userName");

const userAvatarElement =
    document.getElementById("userAvatar");


// =========================
// ESTADO
// =========================

let isLoading = false;


// =========================
// IDENTIDADE DO USUÁRIO
// =========================

const USER_ID_KEY =
    "nazunaUserId";

function getUserId() {

    let id =
        localStorage.getItem(
            USER_ID_KEY
        );

    if (
        id &&
        /^[a-f0-9-]{36}$/i.test(id)
    ) {

        return id;

    }

    id =
        crypto.randomUUID();

    localStorage.setItem(
        USER_ID_KEY,
        id
    );

    console.log(
        "🆔 [USER] Novo ID criado:",
        id
    );

    return id;

}

const userId =
    getUserId();


// =========================
// NOME DO USUÁRIO
// =========================

const USER_NAME_KEY =
    "nazunaUserName";

let userName =
    localStorage.getItem(
        USER_NAME_KEY
    );


function getUserName() {

    return (
        userName ||
        "Você"
    );

}


// =========================
// ATUALIZAR INTERFACE DO USUÁRIO
// =========================

function updateUserUI() {

    const name =
        getUserName();

    if (userNameElement) {

        userNameElement.textContent =
            name;

    }

    if (userAvatarElement) {

        userAvatarElement.textContent =
            name
                .charAt(0)
                .toUpperCase();

    }

}


// =========================
// SALVAR NOME
// =========================

function saveUserName(name) {

    const cleanName =
        name
            .trim()
            .slice(0, 40);

    if (!cleanName) {

        return false;

    }

    userName =
        cleanName;

    localStorage.setItem(
        USER_NAME_KEY,
        userName
    );

    updateUserUI();

    return true;

}


// =========================
// MODAL DE NOME
// =========================

function showNameModal() {

    if (userName) {

        return;

    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "name-modal-overlay";


    const modal =
        document.createElement("div");

    modal.className =
        "name-modal";


    const icon =
        document.createElement("div");

    icon.className =
        "name-modal-icon";

    icon.textContent =
        "N";


    const title =
        document.createElement("h2");

    title.textContent =
        "Como posso te chamar?";


    const description =
        document.createElement("p");

    description.textContent =
        "Só pra eu saber como chamar você por aqui.";


    const input =
        document.createElement("input");

    input.type =
        "text";

    input.placeholder =
        "Insira seu nome...";

    input.maxLength =
        40;

    input.autocomplete =
        "name";


    const button =
        document.createElement("button");

    button.type =
        "button";

    button.textContent =
        "Continuar";


    function confirmName() {

        const name =
            input.value.trim();

        if (!name) {

            input.focus();

            input.classList.add(
                "invalid"
            );

            return;

        }

        if (!saveUserName(name)) {

            return;

        }

        overlay.classList.add(
            "closing"
        );

        setTimeout(
            () => {

                overlay.remove();

                messageInput.focus();

            },
            180
        );

    }


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                confirmName();

            }

        }
    );


    input.addEventListener(
        "input",
        () => {

            input.classList.remove(
                "invalid"
            );

        }
    );


    button.addEventListener(
        "click",
        confirmName
    );


    modal.appendChild(
        icon
    );

    modal.appendChild(
        title
    );

    modal.appendChild(
        description
    );

    modal.appendChild(
        input
    );

    modal.appendChild(
        button
    );

    overlay.appendChild(
        modal
    );

    document.body.appendChild(
        overlay
    );


    requestAnimationFrame(
        () => {

            overlay.classList.add(
                "visible"
            );

            input.focus();

        }
    );

}


// =========================
// UTILIDADES
// =========================

function scrollToBottom(
    smooth = true
) {

    requestAnimationFrame(
        () => {

            chat.scrollTo({

                top:
                    chat.scrollHeight,

                behavior:
                    smooth
                        ? "smooth"
                        : "auto"

            });

        }
    );

}


function autoResizeInput() {

    messageInput.style.height =
        "auto";

    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            150
        ) + "px";

}


// =========================
// ADICIONAR MENSAGEM
// =========================

function addMessage(
    content,
    type,
    react = ""
) {

    welcome.style.display =
        "none";


    const message =
        document.createElement("div");

    message.className =
        `message ${type}`;


    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";

    avatar.textContent =
        type === "ai"
            ? "N"
            : getUserName()
                .charAt(0)
                .toUpperCase();


    const messageContent =
        document.createElement("div");

    messageContent.className =
        "message-content";


    const name =
        document.createElement("div");

    name.className =
        "message-name";

    name.textContent =
        type === "ai"
            ? "Nazuna"
            : getUserName();


    const text =
        document.createElement("div");

    text.className =
        "message-text";

    text.textContent =
        typeof content === "string"
            ? content
            : String(
                content ?? ""
            );


    messageContent.appendChild(
        name
    );

    messageContent.appendChild(
        text
    );


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


    message.appendChild(
        avatar
    );

    message.appendChild(
        messageContent
    );

    messages.appendChild(
        message
    );

    scrollToBottom();

    return message;

}


// =========================
// DIGITANDO
// =========================

function showTyping() {

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

    messages.appendChild(
        typing
    );

    scrollToBottom(false);

}


// =========================
// REMOVER DIGITANDO
// =========================

function removeTyping() {

    const typing =
        document.getElementById(
            "typingMessage"
        );

    if (typing) {

        typing.remove();

    }

}


// =========================
// COMUNICAR COM BACKEND
// =========================

async function sendToAI(message) {

    const response =
        await fetch(
            `${API_URL}/api/chat`,
            {
                method:
                    "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        message,
                        userId
                    })
            }
        );


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


// =========================
// EXIBIR RESPOSTA DA IA
// =========================

function displayAIResponse(data) {

    const response =
        data?.response;


    if (
        Array.isArray(response)
    ) {

        let displayed =
            false;

        response.forEach(
            item => {

                if (!item) {

                    return;

                }

                const text =
                    typeof item.resp === "string"
                        ? item.resp.trim()
                        : "";

                if (!text) {

                    return;

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

                displayed =
                    true;

            }
        );


        if (displayed) {

            return;

        }

    }


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


    console.error(
        "Resposta inesperada da API:",
        data
    );

    throw new Error(
        "A resposta da Nazuna veio em um formato inesperado."
    );

}


// =========================
// ENVIAR MENSAGEM
// =========================

async function sendMessage(message) {

    message =
        message.trim();


    if (
        !message ||
        isLoading
    ) {

        return;

    }


    addMessage(
        message,
        "user"
    );


    messageInput.value =
        "";

    autoResizeInput();


    isLoading =
        true;

    sendButton.disabled =
        true;


    showTyping();


    try {

        const data =
            await sendToAI(
                message
            );


        removeTyping();

        displayAIResponse(
            data
        );


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
            "Não consegui falar com meu cérebro agora. Tenta novamente daqui a pouco.",
            "ai"
        );

    } finally {

        isLoading =
            false;

        sendButton.disabled =
            false;

        messageInput.focus();

    }

}


// =========================
// NOVA CONVERSA
// =========================

function newConversation() {

    removeTyping();

    messages.innerHTML =
        "";

    welcome.style.display =
        "block";

    messageInput.value =
        "";

    autoResizeInput();

    isLoading =
        false;

    sendButton.disabled =
        false;

    sidebar.classList.remove(
        "open"
    );

    messageInput.focus();

}


// =========================
// FORMULÁRIO
// =========================

chatForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        sendMessage(
            messageInput.value
        );

    }
);


// =========================
// ENTER
// =========================

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


// =========================
// INPUT
// =========================

messageInput.addEventListener(
    "input",
    autoResizeInput
);


// =========================
// SUGESTÕES
// =========================

suggestions.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

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


// =========================
// BOTÕES
// =========================

newChatButton.addEventListener(
    "click",
    newConversation
);


clearChatButton.addEventListener(
    "click",
    newConversation
);


if (settingsButton) {

    settingsButton.addEventListener(
        "click",
        () => {

            console.log(
                "⚙ Configurações ainda não implementadas."
            );

        }
    );

}


// =========================
// MENU MOBILE
// =========================

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


// =========================
// HISTÓRICO
// =========================

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


// =========================
// INICIALIZAÇÃO
// =========================

updateUserUI();

autoResizeInput();


if (!userName) {

    showNameModal();

} else {

    messageInput.focus();

}


console.log(
    "🌙 Nazuna AI frontend carregado."
);

console.log(
    "🆔 [USER] ID atual:",
    userId
);