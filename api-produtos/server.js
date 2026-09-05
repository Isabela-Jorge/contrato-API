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

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
