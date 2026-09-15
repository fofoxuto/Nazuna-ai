const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL não configurada."
    );
}

const pool = new Pool({
    connectionString:
        process.env.DATABASE_URL
});

pool.on("error", error => {
    console.error(
        "❌ [DATABASE] Erro inesperado no PostgreSQL:",
        error
    );
});

async function testDatabaseConnection() {
    const client =
        await pool.connect();

    try {
        await client.query(
            "SELECT 1"
        );

        console.log(
            "🗄️ [DATABASE] PostgreSQL conectado com sucesso."
        );

    } finally {
        client.release();
    }
}

module.exports = {
    pool,
    testDatabaseConnection
};