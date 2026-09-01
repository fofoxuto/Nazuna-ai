require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY =
process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
process.env.GEMINI_MODEL || "gemini-2.5-flash";

// =========================
// CONFIGURAÇÃO
// =========================

app.use(cors());
app.use(express.json());

// =========================
// INSTRUÇÕES DA NAZUNA
// =========================

const instructionsPath = path.join(
__dirname,
"instructions",
"nazuna.txt"
);

let nazunaInstructions = "";

try {

nazunaInstructions = fs
    .readFileSync(instructionsPath, "utf8")
    .trim();

console.log(
    "🧠 Instruções da Nazuna carregadas."
);

} catch (error) {

console.error(
    "⚠️ nazuna.txt não encontrado:",
    error.message
);

nazunaInstructions =
    "Você é Nazuna, uma assistente virtual amigável, divertida e útil. Responda em português do Brasil.";

}

// =========================
// FRONTEND
// =========================

app.use(
express.static(
path.join(__dirname, "public")
)
);

// =========================
// HEALTH CHECK
// =========================

app.get("/api/health", (req, res) => {

res.json({

    status: "online",

    service: "Nazuna AI",

    model: GEMINI_MODEL,

    instructions:
        Boolean(nazunaInstructions),

    apiKeyConfigured:
        Boolean(GEMINI_API_KEY)

});

});

// =========================
// CHAT
// =========================

app.post("/api/chat", async (req, res) => {

console.log(
    "📩 /api/chat recebeu uma mensagem."
);

try {

    const { message } = req.body;


    // =========================
    // VALIDAÇÃO
    // =========================

    if (
        typeof message !== "string" ||
        !message.trim()
    ) {

        return res.status(400).json({
            error: "Mensagem inválida."
        });

    }


    if (message.length > 10000) {

        return res.status(400).json({
            error: "Mensagem muito grande."
        });

    }


    // =========================
    // API KEY
    // =========================

    if (!GEMINI_API_KEY) {

        console.error(
            "❌ GEMINI_API_KEY não configurada."
        );

        return res.status(500).json({
            error:
                "A chave da IA não está configurada."
        });

    }


    console.log(
        "🔑 API Key configurada."
    );

    console.log(
        "🤖 Modelo:",
        GEMINI_MODEL
    );


    // =========================
    // GEMINI
    // =========================

    const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;


    console.log(
        "🚀 Enviando para Gemini..."
    );


    const response = await fetch(
        url,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json",

                "x-goog-api-key":
                    GEMINI_API_KEY

            },

            body: JSON.stringify({

                contents: [

                    {

                        role: "user",

                        parts: [

                            {

                                text:
                                    `${nazunaInstructions}\n\nMensagem do usuário:\n${message.trim()}`

                            }

                        ]

                    }

                ],

                generationConfig: {

                    temperature: 0.8,

                    maxOutputTokens: 2048

                }

            })

        }
    );


    // =========================
    // STATUS
    // =========================

    console.log(
        "📡 Gemini respondeu:",
        response.status
    );


    // =========================
    // ERRO
    // =========================

    if (!response.ok) {

        const errorText =
            await response.text();

        console.error(
            "❌ Erro do Gemini:"
        );

        console.error(
            errorText
        );

        return res.status(502).json({

            error:
                "O Gemini recusou a requisição."

        });

    }


    // =========================
    // JSON
    // =========================

    const data =
        await response.json();


    // =========================
    // RESPOSTA
    // =========================

    const reply =
        data
            ?.candidates?.[0]
            ?.content?.parts
            ?.map(
                part => part.text || ""
            )
            .join("")
            .trim();


    if (!reply) {

        console.error(
            "❌ Gemini retornou resposta vazia."
        );

        console.error(
            JSON.stringify(
                data,
                null,
                2
            )
        );

        return res.status(502).json({

            error:
                "A IA retornou uma resposta vazia."

        });

    }


    console.log(
        "✅ Nazuna respondeu com sucesso!"
    );


    res.json({

        response: reply

    });


} catch (error) {

    console.error(
        "💥 Erro interno:",
        error
    );

    res.status(500).json({

        error:
            "Erro interno do servidor."

    });

}

});

// =========================
// 404 API
// =========================

app.use(
"/api",
(req, res) => {

    res.status(404).json({

        error:
            "Endpoint não encontrado."

    });

}

);

// =========================
// START
// =========================

app.listen(
PORT,
() => {

    console.log(`

╭────────────────────────────────╮
│          NAZUNA AI             │
│                                │
│  Server: http://localhost:${PORT}
│  Model:  ${GEMINI_MODEL}
│  Brain:  ${GEMINI_API_KEY ? "ONLINE" : "OFFLINE"}
│  Status: ONLINE                │
╰────────────────────────────────╯

    `);

}

);