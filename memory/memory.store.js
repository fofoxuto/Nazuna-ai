const { pool } = require("../config/database");

const MAX_MEMORIES_PER_USER = 100;
const MAX_KEY_LENGTH = 80;
const MAX_VALUE_LENGTH = 500;
const MAX_CATEGORY_LENGTH = 50;

function isValidUserId(userId) {
    return (
        typeof userId === "string" &&
        /^[a-f0-9-]{36}$/i.test(userId.trim())
    );
}

function normalizeText(value, maxLength) {
    if (typeof value !== "string") {
        return "";
    }

    return value
        .trim()
        .slice(0, maxLength);
}

async function getMemories(userId) {
    if (!isValidUserId(userId)) {
        return [];
    }

    const result = await pool.query(
        `
        SELECT
            categoria,
            chave,
            valor
        FROM memories
        WHERE user_id = $1
        ORDER BY updated_at DESC
        LIMIT $2
        `,
        [
            userId.trim(),
            MAX_MEMORIES_PER_USER
        ]
    );

    return result.rows;
}

async function applyLearning(userId, aprender) {
    if (!isValidUserId(userId)) {
        return {
            success: false,
            action: null,
            reason: "User ID inválido."
        };
    }

    if (!aprender || typeof aprender !== "object") {
        return {
            success: false,
            action: null,
            reason: "Dados de aprendizagem inválidos."
        };
    }

    const categoria = normalizeText(
        aprender.categoria,
        MAX_CATEGORY_LENGTH
    );

    const chave = normalizeText(
        aprender.chave,
        MAX_KEY_LENGTH
    );

    const valor = normalizeText(
        aprender.valor,
        MAX_VALUE_LENGTH
    );

    const acao = normalizeText(
        aprender.acao || aprender.action,
        30
    ).toLowerCase();

    if (!categoria || !chave) {
        return {
            success: false,
            action: null,
            reason: "Categoria ou chave ausente."
        };
    }

    const cleanUserId = userId.trim();

    try {
        if (
            acao === "delete" ||
            acao === "remover" ||
            acao === "remove"
        ) {
            const result = await pool.query(
                `
                DELETE FROM memories
                WHERE user_id = $1
                  AND categoria = $2
                  AND chave = $3
                `,
                [
                    cleanUserId,
                    categoria,
                    chave
                ]
            );

            console.log(
                `🧠 [MEMORY] Memória removida: ${categoria}/${chave}`
            );

            return {
                success: true,
                action: "delete",
                reason:
                    result.rowCount > 0
                        ? "Memória removida."
                        : "Memória não encontrada."
            };
        }

        if (!valor) {
            return {
                success: false,
                action: null,
                reason: "Valor ausente."
            };
        }

        const countResult = await pool.query(
            `
            SELECT COUNT(*)::int AS total
            FROM memories
            WHERE user_id = $1
            `,
            [cleanUserId]
        );

        const existingResult = await pool.query(
            `
            SELECT id
            FROM memories
            WHERE user_id = $1
              AND categoria = $2
              AND chave = $3
            LIMIT 1
            `,
            [
                cleanUserId,
                categoria,
                chave
            ]
        );

        const exists = existingResult.rowCount > 0;
        const total = countResult.rows[0].total;

        if (
            !exists &&
            total >= MAX_MEMORIES_PER_USER
        ) {
            return {
                success: false,
                action: null,
                reason: "Limite de memórias atingido."
            };
        }

        await pool.query(
            `
            INSERT INTO memories (
                user_id,
                categoria,
                chave,
                valor
            )
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (
                user_id,
                categoria,
                chave
            )
            DO UPDATE SET
                valor = EXCLUDED.valor,
                updated_at = NOW()
            `,
            [
                cleanUserId,
                categoria,
                chave,
                valor
            ]
        );

        const action = exists
            ? "update"
            : "create";

        console.log(
            `🧠 [MEMORY] Memória ${action}: ${categoria}/${chave}`
        );

        return {
            success: true,
            action,
            reason:
                exists
                    ? "Memória atualizada."
                    : "Memória criada."
        };

    } catch (error) {
        console.error(
            "❌ [MEMORY] Erro ao salvar memória:",
            error
        );

        return {
            success: false,
            action: null,
            reason: "Erro ao acessar o banco de dados."
        };
    }
}

async function buildMemoryContext(userId) {
    const memories =
        await getMemories(userId);

    if (!memories.length) {
        return "Nenhuma memória persistente registrada.";
    }

    return memories
        .map(memory => {
            return `- [${memory.categoria}] ${memory.chave}: ${memory.valor}`;
        })
        .join("\n");
}

module.exports = {
    getMemories,
    applyLearning,
    buildMemoryContext
};