// =========================
// DEPENDÊNCIAS
// =========================

const express = require("express");

const {
    chatController
} = require("../controllers/chat.controller");

// =========================
// ROUTER
// =========================

const router =
    express.Router();

// =========================
// CHAT
// =========================

router.post(
    "/chat",
    chatController
);

// =========================
// EXPORT
// =========================

module.exports = router;

