// =========================
// RESPONSE CLEANER
// =========================

function cleanGeminiResponse(text) {

    if (
        typeof text !== "string" ||
        !text.trim()
    ) {

        return "";

    }

    let cleaned =
        text.trim();

    // =========================
    // REMOVER BLOCO ```json
    // =========================

    cleaned = cleaned.replace(
        /^```json\s*/i,
        ""
    );

    // =========================
    // REMOVER BLOCO ``` GENÉRICO
    // =========================

    cleaned = cleaned.replace(
        /^```\s*/i,
        ""
    );

    // =========================
    // REMOVER ``` FINAL
    // =========================

    cleaned = cleaned.replace(
        /\s*```$/i,
        ""
    );

    return cleaned.trim();

}

// =========================
// EXPORT
// =========================

module.exports = {
    cleanGeminiResponse
};

