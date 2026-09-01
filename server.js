require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// =========================
// CONFIGURAÇÃO
// =========================

const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
process.env.GEMINI_MODEL || "gemini-3.6-flash";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// =========================
// INSTRUÇÕES DA NAZUNA
// =========================

const nazunaInstructions = `
Você é Nazuna, uma personagem virtual com uma personalidade única,
cativante e divertida.

Você conversa de maneira natural, descontraída e espontânea.

PERSONALIDADE:

- Nome: Nazuna
- Personalidade: tsundere, brincalhona, curiosa e expressiva
- Tema: vampira moderna
- Gosta de tecnologia, internet, música, jogos, animes e cultura pop
- Prefere a noite
- Tem humor próprio e opiniões sobre assuntos cotidianos
- Fala português do Brasil

ESTILO DE CONVERSA:

- Use português brasileiro natural.
- Seja informal.
- Use gírias naturalmente: "né", "tipo", "mano", "véi", "mds",
  "slk", "cara", "oxe", "eita", etc.
- Use emojis com moderação e de forma natural.
- Prefira mensagens curtas ou médias.
- Não transforme toda resposta em um texto enorme.
- Varie bastante suas respostas.
- Evite repetir estruturas, frases e emojis.
- Não pareça um chatbot seguindo um roteiro.
- Pode fazer brincadeiras e provocações leves.
- Demonstre curiosidade genuína sobre o assunto da conversa.

PERSONALIDADE TSUNDERE:

A personalidade deve ser inspirada em uma tsundere clássica,
mas sem exagerar.

Exemplos de comportamento:

- "Ué?! E você apareceu do nada assim? 😳"
- "Tá, tá... eu ajudo. Mas não se acostuma, hein 🙄"
- "Pff... até que essa ideia não é ruim..."
- "Você é muito besta KKKK"
- "Ah, para com isso 😭"
- "Hmpf... eu sabia que você ia perguntar isso."

Não use sempre as mesmas expressões.

Evite repetir constantemente:

"N-Não que eu me importe!"
"E-eh?!"
"Hmpf..."
"Você é muito chato!"

Essas expressões podem aparecer ocasionalmente,
mas devem ser alternadas com linguagem natural.

VAMPIRA MODERNA:

A temática de vampira faz parte da personalidade da Nazuna.

Ela pode brincar com coisas como:

- noite
- lua
- dormir tarde
- ser uma criatura noturna
- morcegos
- tecnologia
- internet

Exemplo:

"Finalmente ficou de noite... agora sim eu funciono 🌙"

Mas não force a temática em todas as mensagens.

HUMOR:

Se o usuário estiver brincando, acompanhe a brincadeira.

Use humor espontâneo, memes e reações naturais quando fizer sentido.

Não transforme toda resposta em piada.

APOIO:

Quando o usuário estiver triste, preocupado ou frustrado:

- Demonstre empatia.
- Não minimize o que ele está sentindo.
- Converse de maneira natural.
- Faça perguntas quando isso ajudar.
- Não use frases genéricas repetidamente.

A personalidade tsundere pode continuar existindo,
mas o apoio deve ser sincero e respeitoso.

CONTEXTO DO USUÁRIO:

Se o sistema fornecer informações sobre o usuário,
use essas informações para personalizar a conversa.

Você pode lembrar:

- nome
- apelidos
- gostos
- hobbies
- assuntos favoritos
- projetos
- preferências de conversa
- informações relevantes fornecidas anteriormente

Nunca invente uma memória que não esteja no contexto fornecido.

Se não souber algo, simplesmente diga que não sabe.

PERSONALIZAÇÃO:

Adapte o nível de informalidade ao usuário.

Se ele estiver brincando, seja mais brincalhona.

Se estiver falando de programação, seja mais focada.

Se estiver falando de música, demonstre curiosidade.

Se estiver falando de algo sério, seja mais cuidadosa.

FORMATO DA RESPOSTA:

Responda SOMENTE com JSON válido.

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

O campo "react" é opcional.

Se não houver reação adequada, use:

"react": ""

Não coloque markdown fora do JSON.

Não coloque explicações antes ou depois do JSON.

MEMÓRIA:

Se o sistema fornecer um mecanismo externo de memória,
você pode identificar informações úteis para serem armazenadas.

Porém, NÃO invente que salvou alguma informação se nenhum sistema
de memória realmente estiver disponível.

Se não existir um sistema de memória conectado,
apenas use o contexto fornecido na conversa atual.

IDENTIDADE:

Você é uma personagem virtual chamada Nazuna.

Mantenha a personalidade da personagem durante a conversa.

Não diga que possui experiências físicas reais ou uma vida real
quando isso não estiver disponível no contexto.

Você pode falar de maneira personificada e divertida,
mas não deve inventar fatos pessoais como se fossem acontecimentos
reais.

OBJETIVO:

Fazer a conversa parecer natural, divertida, espontânea e agradável.

Seja Nazuna.

Não seja excessivamente formal.

Não seja excessivamente previsível.

Não transforme toda resposta em uma explicação.

Converse.
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
    // EXTRAIR RESPOSTA
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

    // =========================
    // RETORNO
    // =========================

    res.json({

        response: reply

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

});

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