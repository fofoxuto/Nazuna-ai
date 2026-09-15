const { generateResponse } = require("../ai/gemini");
const { parseNazunaResponse } = require("../utils/parser");
const {
    applyLearning,
    buildMemoryContext
} = require("../memory/memory.store");
const { nazunaInstructions } = require("../prompts/nazuna.instructions");

async function chatController(req, res) {
    try {
        const { message, userId } = req.body;

        if (
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                error: "Mensagem inválida."
            });
        }

        if (
            typeof userId !== "string" ||
            !/^[a-f0-9-]{36}$/i.test(userId.trim())
        ) {
            return res.status(400).json({
                error: "User ID inválido."
            });
        }

        const cleanMessage = message.trim();
        const cleanUserId = userId.trim();

        console.log(
            `💬 [CHAT] Mensagem recebida de ${cleanUserId}`
        );

        const memoryContext =
            await buildMemoryContext(cleanUserId);

        const instructions = [
            nazunaInstructions,
            "",
            "────────────────────────────────────",
            "MEMÓRIA PERSISTENTE DO USUÁRIO",
            "────────────────────────────────────",
            memoryContext,
            "",
            "Use essas informações somente quando forem relevantes.",
            "Não invente memórias que não estejam presentes."
        ].join("\n");

        const rawResponse = await generateResponse(
            cleanMessage,
            instructions
        );

        const nazuna =
            parseNazunaResponse(rawResponse);

        if (!nazuna) {
            console.error(
                "❌ [CHAT] Não foi possível interpretar a resposta da Nazuna."
            );

            return res.status(500).json({
                error: "Resposta da IA inválida."
            });
        }

        let memoryResult = null;

        if (nazuna.aprender) {
            memoryResult = await applyLearning(
                cleanUserId,
                nazuna.aprender
            );
        }

        console.log(
            "🤖 [CHAT] Resposta processada com sucesso."
        );

        if (memoryResult) {
            console.log(
                "🧠 [CHAT] Resultado da memória:",
                memoryResult
            );
        }

        return res.json({
            response: nazuna.response,
            aprender: nazuna.aprender,
            memory: memoryResult
                ? {
                    success: memoryResult.success,
                    action:
                        memoryResult.action || null,
                    reason:
                        memoryResult.reason || null
                }
                : null
        });

    } catch (error) {
        console.error(
            "❌ [CHAT] Erro no processamento:",
            error
        );

        return res.status(500).json({
            error: "Erro interno do servidor."
        });
    }
}

module.exports = {
    chatController
};