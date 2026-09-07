// =========================
// DEPENDÊNCIAS
// =========================

const {
    cleanGeminiResponse
} = require("./response.cleaner");

const {
    extractJson
} = require("./json.extractor");

// =========================
// PARSER DA NAZUNA
// =========================

function parseNazunaResponse(text) {

    const cleaned =
        cleanGeminiResponse(text);

    const parsed =
        extractJson(cleaned);

    // =========================
    // JSON VÁLIDO
    // =========================

    if (
        parsed &&
        Array.isArray(parsed.resp) &&
        parsed.resp.length > 0
    ) {

        const responses =
            parsed.resp
                .map(item => ({

                    id:
                        item?.id ||
                        "chat",

                    resp:
                        typeof item?.resp === "string"
                            ? item.resp.trim()
                            : "",

                    react:
                        typeof item?.react === "string"
                            ? item.react
                            : ""

                }))
                .filter(
                    item =>
                        item.resp.length > 0
                );

        if (
            responses.length > 0
        ) {

            return {

                response:
                    responses,

                aprender:
                    parsed.aprender || null,

                json: true

            };

        }

    }

    // =========================
    // FALLBACK
    // =========================

    console.log(
        "⚠️ Resposta não estava em JSON válido. Usando fallback."
    );

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
// EXPORT
// =========================

module.exports = {
    parseNazunaResponse
};

