require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// =========================
// FRONTEND
// =========================

app.use(express.static(path.join(__dirname, "public")));


// =========================
// HEALTH CHECK
// =========================

app.get("/api/health", (req, res) => {

    res.json({
        status: "online",
        service: "Nazuna AI",
        timestamp: new Date().toISOString()
    });

});


// =========================
// CHAT
// =========================

app.post("/api/chat", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || typeof message !== "string") {

            return res.status(400).json({
                error: "Mensagem inválida."
            });

        }

        if (!process.env.AI_API_KEY) {

            return res.status(500).json({
                error: "AI_API_KEY não configurada no servidor."
            });

        }

        const response = await fetch(
            process.env.AI_API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.AI_API_KEY}`
                },

                body: JSON.stringify({

                    model: process.env.AI_MODEL,

                    messages: [

                        {
                            role: "system",
                            content:
                                "Você é Nazuna, uma assistente virtual amigável, divertida e útil. Responda em português do Brasil."
                        },

                        {
                            role: "user",
                            content: message
                        }

                    ]

                })
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Erro da API:",
                errorText
            );

            return res.status(502).json({
                error: "A API de IA não respondeu corretamente."
            });

        }


        const data =
            await response.json();


        const reply =
            data?.choices?.[0]?.message?.content;


        if (!reply) {

            return res.status(502).json({
                error: "A API retornou uma resposta inesperada."
            });

        }


        res.json({
            response: reply
        });


    } catch (error) {

        console.error(
            "Erro interno:",
            error
        );

        res.status(500).json({
            error: "Erro interno do servidor."
        });

    }

});


// =========================
// 404 API
// =========================

app.use("/api", (req, res) => {

    res.status(404).json({
        error: "Endpoint não encontrado."
    });

});


// =========================
// START
// =========================

app.listen(PORT, () => {

    console.log(`
╭──────────────────────────────╮
│        NAZUNA AI             │
│                              │
│  Server: http://localhost:${PORT} │
│  Status: ONLINE              │
╰──────────────────────────────╯
    `);

});