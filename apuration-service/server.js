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
    // Totais gerais (todos os eleitores)
    const totaisSql = `
      SELECT
        COUNT(*) FILTER (WHERE tipo_voto = 'valido') AS total_votos_validos,
        COUNT(*) FILTER (WHERE tipo_voto = 'branco') AS total_votos_brancos,
        COUNT(*) FILTER (WHERE tipo_voto = 'nulo') AS total_votos_nulos,
        COUNT(*) AS total_votos
      FROM eleitores;
    `;
    const totaisRes = await pool.query(totaisSql);

    // Totais por candidato
    const candidatosSql = `
      SELECT c.id, c.nome, c.foto_url,
             COUNT(e.id) FILTER (WHERE e.tipo_voto = 'valido') AS total_votos_validos,
             COUNT(e.id) FILTER (WHERE e.tipo_voto = 'branco') AS total_votos_brancos,
             COUNT(e.id) FILTER (WHERE e.tipo_voto = 'nulo') AS total_votos_nulos,
             COUNT(e.id) AS total_votos
      FROM candidatos c
      LEFT JOIN eleitores e ON e.candidato_id = c.id
      GROUP BY c.id, c.nome, c.foto_url
      ORDER BY total_votos DESC;
    `;
    const candidatosRes = await pool.query(candidatosSql);

    // Votos válidos por estado para cada candidato
    // Observação: este query assume que a coluna de estado está em eleitores (e.estado).
    const votosPorCandidatoEstadoSql = `
      SELECT
        c.id AS candidato_id,
        c.nome AS candidato,
        COALESCE(e.estado, 'Sem Estado') AS estado,
        COUNT(*) FILTER (WHERE e.tipo_voto = 'valido') AS votos_validos_por_estado
      FROM candidatos c
      LEFT JOIN eleitores e ON e.candidato_id = c.id
      GROUP BY c.id, c.nome, COALESCE(e.estado, 'Sem Estado')
      ORDER BY c.id, votos_validos_por_estado DESC;
    `;
    const votosPorCandidatoEstadoRes = await pool.query(votosPorCandidatoEstadoSql);

    // Agregação por estado (totais por estado)
    const porEstadoSql = `
      SELECT COALESCE(e.estado, 'Sem Estado') AS estado,
             COUNT(*) FILTER (WHERE e.tipo_voto = 'valido') AS votos_validos,
             COUNT(*) FILTER (WHERE e.tipo_voto = 'branco') AS votos_brancos,
             COUNT(*) FILTER (WHERE e.tipo_voto = 'nulo') AS votos_nulos,
             COUNT(*) AS total_votos
      FROM eleitores e
      GROUP BY COALESCE(e.estado, 'Sem Estado')
      ORDER BY total_votos DESC;
    `;
    const porEstadoRes = await pool.query(porEstadoSql);

    res.json({
      status: "success",
      data: {
        totais_gerais: totaisRes.rows[0],
        candidatos: candidatosRes.rows,
        votos_validos_por_candidato_estado: votosPorCandidatoEstadoRes.rows,
        por_estado: porEstadoRes.rows
      }
    });
  } catch (err) {
    console.error("Erro ao apurar votos:", err);
    res.status(500).json({ status: "error", message: "Erro interno" });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Process-service rodando na porta ${process.env.PORT || 4000}`);
});
