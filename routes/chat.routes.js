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
    "/",
    chatController
);

// =========================
// EXPORT
// =========================

module.exports = router;

