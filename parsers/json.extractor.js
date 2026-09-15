
// =========================
// JSON EXTRACTOR
// =========================

function extractJson(text) {

    if (
        typeof text !== "string" ||
        !text.trim()
    ) {

        return null;

    }

    const cleaned =
        text.trim();

    // =========================
    // JSON DIRETO
    // =========================

    try {

        return JSON.parse(
            cleaned
        );

    } catch (error) {

        // Continua para tentativa
        // de extração abaixo.

    }

    // =========================
    // ENCONTRAR OBJETO JSON
    // =========================

    const start =
        cleaned.indexOf("{");

    const end =
        cleaned.lastIndexOf("}");

    if (
        start === -1 ||
        end === -1 ||
        end <= start
    ) {

        return null;

    }

    const possibleJson =
        cleaned.slice(
            start,
            end + 1
        );

    // =========================
    // TENTAR PARSEAR
    // =========================

    try {

        return JSON.parse(
            possibleJson
        );

    } catch (error) {

        return null;

    }

}

// =========================
// EXPORT
// =========================

module.exports = {
    extractJson
};
