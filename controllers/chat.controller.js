// =========================
// DEPENDÊNCIAS
// =========================

const {
    generateGeminiResponse
} = require("../ai/gemini");

const nazunaInstructions =
    require("../prompts/nazuna.instructions");

const {
    parseNazunaResponse
} = require("../parsers/nazuna.parser");

// =========================
// CHAT CONTROLLER
// =========================

async function chatController(req, res) {

    console.log(
        "📩 /api/chat recebeu uma mensagem."
    );

    try {

        // =========================
        // MENSAGEM
        // =========================

        const {
            message
        } = req.body;

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

        if (
            message.length > 10000
        ) {

            return res.status(400).json({

                error:
                    "Mensagem muito grande."

            });

        }

        const cleanMessage =
            message.trim();

        console.log(
            "💬 Mensagem recebida."
        );

        // =========================
        // GEMINI
        // =========================

        console.log(
            "🤖 Enviando mensagem para Gemini..."
        );

        const rawReply =
            await generateGeminiResponse({

                systemInstruction:
                    nazunaInstructions,

                message:
                    cleanMessage

            });

        // =========================
        // PROCESSAR RESPOSTA
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
        // RESPOSTA
        // =========================

        console.log(
            "✅ Nazuna respondeu com sucesso!"
        );

        return res.json({

            response:
                nazuna.response,

            aprender:
                nazuna.aprender

        });

    } catch (error) {

        console.error(
            "💥 Erro no chatController:"
        );

        console.error(
            error
        );

        return res.status(500).json({

            error:
                "Erro interno do servidor."

        });

    }

}

// =========================
// EXPORT
// =========================

module.exports = {
    chatController
};

