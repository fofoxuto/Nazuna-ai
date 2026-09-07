// =========================
// GEMINI AI
// =========================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL =
    process.env.GEMINI_MODEL || "gemini-3.6-flash";

// =========================
// GERAR RESPOSTA
// =========================

async function generateGeminiResponse({
    systemInstruction,
    message
}) {

    if (!GEMINI_API_KEY) {

        throw new Error(
            "GEMINI_API_KEY não configurada."
        );

    }

    const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    // =========================
    // REQUEST
    // =========================

    const response =
        await fetch(
            url,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "x-goog-api-key":
                        GEMINI_API_KEY

                },

                body:
                    JSON.stringify({

                        systemInstruction: {

                            parts: [

                                {

                                    text:
                                        systemInstruction

                                }

                            ]

                        },

                        contents: [

                            {

                                role: "user",

                                parts: [

                                    {

                                        text:
                                            message

                                    }

                                ]

                            }

                        ],

                        generationConfig: {

                            temperature: 0.9,

                            maxOutputTokens: 2048,

                            responseMimeType:
                                "application/json"

                        }

                    })

            }
        );

    // =========================
    // ERRO DA API
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

        throw new Error(
            "O Gemini recusou a requisição."
        );

    }

    // =========================
    // JSON
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

        throw new Error(
            "A IA retornou uma resposta vazia."
        );

    }

    return rawReply;

}

// =========================
// EXPORT
// =========================

module.exports = {
    generateGeminiResponse,
    GEMINI_MODEL
};

