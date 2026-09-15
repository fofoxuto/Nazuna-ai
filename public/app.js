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


// =========================
// ESTADO
// =========================

let isLoading = false;


// =========================
// NOME DO USUÁRIO
// =========================

const USER_NAME_KEY =
    "nazunaUserName";

let userName =
    localStorage.getItem(
        USER_NAME_KEY
    );


// =========================
// CONFIGURAR NOME
// =========================

function saveUserName(name) {

    const cleanName =
        name.trim();

    if (!cleanName) {

        return false;

    }

    userName =
        cleanName;

    localStorage.setItem(
        USER_NAME_KEY,
        userName
    );

    return true;

}


// =========================
// MODAL DE NOME
// =========================

function showNameModal() {

    // Se já existe nome,
    // não precisa perguntar novamente.

    if (userName) {

        return;

    }


    // =========================
    // OVERLAY
    // =========================

    const overlay =
        document.createElement("div");

    overlay.className =
        "name-modal-overlay";


    // =========================
    // MODAL
    // =========================

    const modal =
        document.createElement("div");

    modal.className =
        "name-modal";


    // =========================
    // TÍTULO
    // =========================

    const title =
        document.createElement("h2");

    title.textContent =
        "Como posso te chamar? 💜";


    // =========================
    // DESCRIÇÃO
    // =========================

    const description =
        document.createElement("p");

    description.textContent =
        "Só pra eu saber como chamar você por aqui.";


    // =========================
    // INPUT
    // =========================

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


    // =========================
    // BOTÃO
    // =========================

    const button =
        document.createElement("button");

    button.type =
        "button";

    button.textContent =
        "Continuar";


    // =========================
    // FUNÇÃO CONFIRMAR
    // =========================

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

        if (
            !saveUserName(name)
        ) {

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


    // =========================
    // ENTER
    // =========================

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


    // =========================
    // REMOVER ERRO AO DIGITAR
    // =========================

    input.addEventListener(
        "input",
        () => {

            input.classList.remove(
                "invalid"
            );

        }
    );


    // =========================
    // BOTÃO
    // =========================

    button.addEventListener(
        "click",
        confirmName
    );


    // =========================
    // MONTAR
    // =========================

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


    // =========================
    // ANIMAÇÃO
    // =========================

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
// PEGAR NOME
// =========================

function getUserName() {

    return (
        userName ||
        "Você"
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


    // =========================
    // AVATAR
    // =========================

    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";

    avatar.textContent =
        type === "ai"
            ? "N"
            : (
                getUserName()
                    .charAt(0)
                    .toUpperCase()
            );


    // =========================
    // CONTEÚDO
    // =========================

    const messageContent =
        document.createElement("div");

    messageContent.className =
        "message-content";


    // =========================
    // NOME
    // =========================

    const name =
        document.createElement("div");

    name.className =
        "message-name";

    name.textContent =
        type === "ai"
            ? "Nazuna"
            : getUserName();


    // =========================
    // TEXTO
    // =========================

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


    // =========================
    // REAÇÃO
    // =========================

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


    // =========================
    // MONTAR
    // =========================

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
            "/api/chat",
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        message:
                            message

                    })

            }
        );


    // =========================
    // LER RESPOSTA
    // =========================

    let data;

    try {

        data =
            await response.json();

    } catch {

        throw new Error(
            "O servidor retornou uma resposta inválida."
        );

    }


    // =========================
    // ERRO HTTP
    // =========================

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


    // =========================
    // FORMATO DO BACKEND
    // =========================
    //
    // response: [
    //     {
    //         id: "chat",
    //         resp: "...",
    //         react: "..."
    //     }
    // ]
    //
    // =========================

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


    // =========================
    // COMPATIBILIDADE
    // =========================

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


    // =========================
    // RESPOSTA INVÁLIDA
    // =========================

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


    // =========================
    // USUÁRIO
    // =========================

    addMessage(
        message,
        "user"
    );


    // =========================
    // LIMPAR INPUT
    // =========================

    messageInput.value =
        "";

    autoResizeInput();


    // =========================
    // LOADING
    // =========================

    isLoading =
        true;

    sendButton.disabled =
        true;


    // =========================
    // TYPING
    // =========================

    showTyping();


    // =========================
    // DEIXAR UI ATUALIZAR
    // =========================

    await new Promise(
        resolve =>
            requestAnimationFrame(
                resolve
            )
    );


    try {

        // =========================
        // BACKEND
        // =========================

        const data =
            await sendToAI(
                message
            );


        // =========================
        // REMOVER TYPING
        // =========================

        removeTyping();


        // =========================
        // RESPOSTA
        // =========================

        displayAIResponse(
            data
        );


        // =========================
        // MEMÓRIA
        // =========================

        if (
            data?.aprender
        ) {

            console.log(
                "🧠 Informação identificada para memória:",
                data.aprender
            );

        }

    } catch (error) {

        // =========================
        // ERRO
        // =========================

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

        // =========================
        // FINALIZAR LOADING
        // =========================

        isLoading =
            false;

        sendButton.disabled =
            false;

        messageInput.focus();

    }

}


// =========================
// FORMULÁRIO
// =========================

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

            if (!isLoading) {

                chatForm.requestSubmit();

            }

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


newChatButton.addEventListener(
    "click",
    newConversation
);


clearChatButton.addEventListener(
    "click",
    newConversation
);


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

autoResizeInput();


// =========================
// NOME
// =========================

if (!userName) {

    showNameModal();

} else {

    messageInput.focus();

}


console.log(
    "🌙 Nazuna AI frontend carregado."
);