const express = require("express");
const cors = require("cors");
const path = require("path");

// =========================
// CONFIGURAR EXPRESS
// =========================

function configureServer(app) {

    // =========================
    // CORS
    // =========================

    app.use(cors());

    // =========================
    // JSON
    // =========================

    app.use(
        express.json({
            limit: "1mb"
        })
    );

    // =========================
    // FRONTEND
    // =========================

    app.use(
        express.static(
            path.join(
                __dirname,
                "..",
                "public"
            )
        )
    );

}

module.exports = configureServer;