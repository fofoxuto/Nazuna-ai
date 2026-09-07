const {
    PORT,
    GEMINI_API_KEY,
    GEMINI_MODEL
} = require("../config/env");

// =========================
// HEALTH CHECK
// =========================

function healthController(req, res) {

    return res.json({

        status: "online",

        service: "Nazuna AI",

        model: GEMINI_MODEL,

        instructions: true,

        apiKeyConfigured:
            Boolean(GEMINI_API_KEY),

        timestamp:
            new Date().toISOString()

    });

}

// =========================
// EXPORT
// =========================

module.exports = {
    healthController
};

