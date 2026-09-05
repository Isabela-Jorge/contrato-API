const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "aula_crud"
});

// GET /produtos
app.get("/produtos", async (req, res) => {
    try {
        const [resultado] = await db.query(
            "CALL sp_listar_produtos()"
        );

        res.status(200).json(resultado[0]);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar produtos"
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});

