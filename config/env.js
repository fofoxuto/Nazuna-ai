
// =========================
// AMBIENTE
// =========================

require("dotenv").config();

// =========================
// CONFIGURAÇÕES
// =========================

const PORT =
    process.env.PORT || 3000;

const GEMINI_API_KEY =
    process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
    process.env.GEMINI_MODEL || "gemini-3.6-flash";

// =========================
// EXPORT
// =========================

module.exports = {
    PORT,
    GEMINI_API_KEY,
    GEMINI_MODEL
};
