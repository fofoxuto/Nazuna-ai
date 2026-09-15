require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const chatRoutes = require("./routes/chat.routes");
const healthRoutes = require("./routes/health.routes");

const {
    testDatabaseConnection
} = require("./config/database");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(
    path.join(__dirname, "public")
));

app.use("/api/chat", chatRoutes);
app.use("/api", healthRoutes);

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
});

async function startServer() {
    try {
        await testDatabaseConnection();

        app.listen(PORT, () => {
            console.log(
                `🚀 Nazuna-ai rodando na porta ${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "❌ [SERVER] Falha ao conectar ao PostgreSQL:"
        );

        console.error(error);

        process.exit(1);
    }
}

startServer();