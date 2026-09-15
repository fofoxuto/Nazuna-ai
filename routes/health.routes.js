// =========================
// DEPENDÊNCIAS
// =========================

const express = require("express");

const {
    healthController
} = require("../controllers/health.controller");

// =========================
// ROUTER
// =========================

const router =
    express.Router();

// =========================
// HEALTH CHECK
// =========================

router.get(
    "/health",
    healthController
);

// =========================
// EXPORT
// =========================

module.exports = router;

