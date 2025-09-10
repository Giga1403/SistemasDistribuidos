const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Endpoint para registrar voto
app.post("/votar", async (req, res) => {
  const { candidato } = req.body;
  if (!candidato) {
    return res.status(400).json({ status: "error", message: "Candidato não informado" });
  }

  try {
    await pool.query(
      "INSERT INTO votos (eleitor_id, candidato) VALUES ($1, $2)",
      [uuidv4(), candidato]
    );

    res.json({ status: "success", message: "Voto registrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao registrar voto:", err);
    res.status(500).json({ status: "error", message: "Erro interno" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serviço de Processamento rodando em http://localhost:${PORT}`);
});
