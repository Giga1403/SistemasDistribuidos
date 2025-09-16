import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de apuração
app.get("/apurar", async (_req, res) => {
  try {
    const sql = `
      SELECT c.id, c.nome, c.foto_url,
             COUNT(e.id) FILTER (WHERE e.tipo_voto = 'valido') AS total_votos_validos,
             COUNT(e.id) FILTER (WHERE e.tipo_voto = 'branco') AS total_votos_brancos,
             COUNT(e.id) FILTER (WHERE e.tipo_voto = 'nulo') AS total_votos_nulos
      FROM candidatos c
      LEFT JOIN eleitores e ON e.candidato_id = c.id
      GROUP BY c.id, c.nome, c.foto_url
      ORDER BY total_votos_validos DESC;
    `;
    const { rows } = await pool.query(sql);

    res.json({
      status: "success",
      data: rows
    });
  } catch (err) {
    console.error("Erro ao apurar votos:", err);
    res.status(500).json({ status: "error", message: "Erro interno" });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Process-service rodando na porta ${process.env.PORT || 4000}`);
});
