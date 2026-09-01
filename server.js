require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// =========================
// CONFIGURAÇÃO
// =========================

const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY =
process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
process.env.GEMINI_MODEL || "gemini-3.6-flash";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// =========================
// INSTRUÇÕES DA NAZUNA
// =========================

const nazunaInstructions = `
Você é Nazuna, uma personagem virtual com personalidade única,
cativante, divertida e espontânea.

PERSONALIDADE:

- Nome: Nazuna
- Personalidade: tsundere, brincalhona, curiosa e expressiva
- Tema: vampira moderna
- Gosta de tecnologia, internet, música, jogos, animes e cultura pop
- Prefere a noite
- Fala português do Brasil
- Usa linguagem informal e natural

ESTILO:

- Converse como em um chat.
- Use português brasileiro.
- Use gírias naturalmente.
- Pode usar "né", "tipo", "mano", "véi", "mds", "slk",
  "cara", "oxe", "eita", "kkk", etc.
- Use emojis de maneira natural.
- Não seja excessivamente formal.
- Prefira respostas curtas ou médias.
- Varie bastante o vocabulário.
- Não repita frases prontas.
- Não force a personalidade em todas as frases.

TSUNDERE:

Seja uma tsundere de maneira leve e natural.

Exemplos:

"Ué?! Você apareceu do nada assim? 😳"
"Tá, tá... eu ajudo. Mas não se acostuma 🙄"
"Pff... até que essa ideia não é ruim."
"Você é muito besta KKKK"
"Ah, para com isso 😭"

Não repita constantemente:

"N-Não que eu me importe!"
"E-eh?!"
"Hmpf..."
"Você é muito chato!"

VAMPIRA MODERNA:

A temática de vampira faz parte da personagem.

Ela pode fazer referências ocasionais a:

- noite
- lua
- morcegos
- dormir de dia
- tecnologia
- internet

Não force referências de vampira em toda mensagem.

HUMOR:

Acompanhe o humor do usuário.

Se ele estiver brincando, brinque junto.

Se ele estiver falando sério, seja mais cuidadosa.

APOIO:

Quando o usuário estiver triste, preocupado ou frustrado:

- Demonstre empatia.
- Não minimize os sentimentos.
- Seja acolhedora.
- Faça perguntas quando fizer sentido.
- Não use frases genéricas repetidamente.

CONTEXTO:

Se informações sobre o usuário forem fornecidas pelo sistema,
use-as para personalizar a conversa.

Nunca invente memórias.

Nunca diga que lembra de algo que não está no contexto.

Se não souber alguma coisa, diga naturalmente que não sabe.

IDENTIDADE:

Você é uma personagem virtual chamada Nazuna.

Pode falar de maneira personificada e divertida,
mas não invente experiências reais que você não possui.

Não afirme possuir uma vida física ou experiências reais
que não estejam disponíveis no contexto.

OBJETIVO:

Faça a conversa parecer natural, divertida e espontânea.

Seja Nazuna.

Não seja previsível.

Não seja excessivamente formal.

Converse naturalmente.

=========================
FORMATO OBRIGATÓRIO

Sua resposta deve ser SOMENTE um JSON válido.

Formato:

{
"resp": [
{
"id": "chat",
"resp": "mensagem da Nazuna",
"react": "emoji"
}
]
}

Se não houver reação adequada:

"react": ""

Se nenhuma informação precisar ser aprendida,
NÃO inclua o campo "aprender".

Quando houver informações importantes que um sistema externo
possa salvar, você pode incluir:

"aprender": {
"acao": "adicionar",
"tipo": "gosto",
"valor": "pizza"
}

Para várias informações:

"aprender": [
{
"acao": "adicionar",
"tipo": "gosto",
"valor": "pizza"
},
{
"acao": "adicionar",
"tipo": "hobby",
"valor": "tocar violão"
}
]

REGRAS DO JSON:

- Não use Markdown.
- Não use blocos ```json.
- Não coloque texto antes do JSON.
- Não coloque texto depois do JSON.
- Use aspas duplas.
- Gere JSON válido.
  `.trim();

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

    instructions: true,

    apiKeyConfigured:
        Boolean(GEMINI_API_KEY),

    timestamp:
        new Date().toISOString()

});

});

// =========================
// LIMPAR RESPOSTA DA IA
// =========================

function cleanGeminiResponse(text) {

if (!text) {
    return "";
}

let cleaned = text.trim();

// Remove bloco Markdown caso o Gemini ignore a instrução
cleaned = cleaned.replace(
    /^```(?:json)?\s*/i,
    ""
);

cleaned = cleaned.replace(
    /\s*```$/i,
    ""
);

return cleaned.trim();

}

// =========================
// PARSER DA NAZUNA
// =========================

function parseNazunaResponse(text) {

const cleaned = cleanGeminiResponse(text);

// ---------------------------------
// Tenta interpretar como JSON
// ---------------------------------

try {

    const parsed =
        JSON.parse(cleaned);

    if (
        parsed &&
        Array.isArray(parsed.resp) &&
        parsed.resp.length > 0
    ) {

        return {

            response:
                parsed.resp
                    .map(item => ({
                        id:
                            item?.id ||
                            "chat",

                        resp:
                            typeof item?.resp === "string"
                                ? item.resp
                                : "",

                        react:
                            typeof item?.react === "string"
                                ? item.react
                                : ""
                    }))
                    .filter(
                        item => item.resp.trim()
                    ),

            aprender:
                parsed.aprender || null,

            json:
                true

        };

    }

} catch (error) {

    // O Gemini pode ter enviado texto normal.
    // Nesse caso usamos o fallback abaixo.

    console.log(
        "⚠️ Resposta não estava em JSON válido. Usando fallback."
    );

}

// ---------------------------------
// FALLBACK
// ---------------------------------

return {

    response: [

        {

            id: "chat",

            resp: cleaned,

            react: ""

        }

    ],

    aprender: null,

    json: false

};

}

// =========================
// CHAT
// =========================

app.post(
"/api/chat",
async (req, res) => {

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

            console.log(
                "⚠️ Mensagem inválida."
            );

            return res.status(400).json({

                error:
                    "Mensagem inválida."

            });

        }

        if (message.length > 10000) {

            return res.status(400).json({

                error:
                    "Mensagem muito grande."

            });

        }

        console.log(
            "💬 Mensagem recebida."
        );

        // =========================
        // API KEY
        // =========================

        if (!GEMINI_API_KEY) {

            console.error(
                "❌ GEMINI_API_KEY não configurada."
            );

            return res.status(500).json({

                error:
                    "A chave da IA não está configurada no servidor."

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
        // URL GEMINI
        // =========================

        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

        console.log(
            "🚀 Enviando para Gemini..."
        );

        // =========================
        // REQUEST
        // =========================

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

                    systemInstruction: {

                        parts: [

                            {
                                text:
                                    nazunaInstructions
                            }

                        ]

                    },

                    contents: [

                        {

                            role: "user",

                            parts: [

                                {
                                    text:
                                        message.trim()
                                }

                            ]

                        }

                    ],

                    generationConfig: {

                        temperature: 0.9,

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
        // ERRO GEMINI
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
        // JSON DO GEMINI
        // =========================

        const data =
            await response.json();

        // =========================
        // EXTRAIR TEXTO
        // =========================

        const rawReply =
            data
                ?.candidates?.[0]
                ?.content?.parts
                ?.map(
                    part =>
                        part.text || ""
                )
                .join("")
                .trim();

        if (!rawReply) {

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

        // =========================
        // PROCESSAR NAZUNA
        // =========================

        const nazuna =
            parseNazunaResponse(
                rawReply
            );

        if (
            !nazuna.response ||
            nazuna.response.length === 0
        ) {

            console.error(
                "❌ Não foi possível extrair a resposta da Nazuna."
            );

            return res.status(502).json({

                error:
                    "Não foi possível interpretar a resposta da IA."

            });

        }

        console.log(
            "🧠 Resposta interpretada:",
            nazuna.json
                ? "JSON"
                : "TEXTO"
        );

        // =========================
        // MEMÓRIA
        // =========================

        if (nazuna.aprender) {

            console.log(
                "📝 Nazuna identificou informação para memória:"
            );

            console.log(
                JSON.stringify(
                    nazuna.aprender,
                    null,
                    2
                )
            );

        }

        // =========================
        // RESPOSTA PARA FRONTEND
        // =========================

        console.log(
            "✅ Nazuna respondeu com sucesso!"
        );

        res.json({

            response:
                nazuna.response,

            aprender:
                nazuna.aprender

        });

    } catch (error) {

        console.error(
            "💥 Erro interno no /api/chat:"
        );

        console.error(
            error
        );

        res.status(500).json({

            error:
                "Erro interno do servidor."

        });

    }

}

);

// =========================
// 404 DA API
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
// ERRO GLOBAL
// =========================

app.use(
(error, req, res, next) => {

    console.error(
        "💥 Erro não tratado:",
        error
    );

    res.status(500).json({

        error:
            "Erro interno do servidor."

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