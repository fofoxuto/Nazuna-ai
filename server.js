// =========================
// DEPENDÊNCIAS
// =========================

const express = require("express");

const {
    PORT
} = require("./config/env");

const configureServer =
    require("./config/server.config");

const chatRoutes =
    require("./routes/chat.routes");

const healthRoutes =
    require("./routes/health.routes");

const errorMiddleware =
    require("./middleware/error.middleware");

// =========================
// APLICAÇÃO
// =========================

const app =
    express();

// =========================
// CONFIGURAÇÃO DO SERVIDOR
// =========================

configureServer(app);

// =========================
// ROTAS
// =========================

app.use(
    "/api",
    chatRoutes
);

app.use(
    "/api",
    healthRoutes
);

// =========================
// 404 DA API
// =========================

app.use(
    "/api",
    (req, res) => {

        res.status(404).json({

            error:
                "Endpoint não encontrado."

        });

    }
);

// =========================
// ERRO GLOBAL
// =========================

app.use(
    errorMiddleware
);

// =========================
// INICIAR SERVIDOR
// =========================

app.listen(
    PORT,
    () => {

        console.log(`

╭────────────────────────────────╮
│          NAZUNA AI             │
│                                │
│  Server: http://localhost:${PORT}
│  Status: ONLINE                │
╰────────────────────────────────╯

        `);

    }
);