function errorMiddleware(
    error,
    req,
    res,
    next
) {

    console.error(
        "💥 Erro não tratado:"
    );

    console.error(
        error
    );

    // Se a resposta já começou a ser enviada,
    // deixa o Express continuar o tratamento.
    if (res.headersSent) {

        return next(error);

    }

    return res.status(500).json({

        error:
            "Erro interno do servidor."

    });

}

// =========================
// EXPORT
// =========================

module.exports = errorMiddleware;

