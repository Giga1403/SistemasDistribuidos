import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());


app.get('/health', (_req, res) => res.json({ status: 'ok' }));


app.get('/candidatos', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, nome, foto_url FROM candidatos ORDER BY id');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao listar candidatos' });
  }
});


app.post('/candidatos', async (req, res) => {
  const { nome, foto_url } = req.body;
  if (!nome) return res.status(400).json({ error: 'nome é obrigatório' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO candidatos (nome, foto_url) VALUES ($1,$2) RETURNING id, nome, foto_url',
      [nome, foto_url || null]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao criar candidato' });
  }
});



app.post('/votos', async (req, res) => {
  const {
    cpf, nome, genero, dataNascimento, cidade, estado,
    tipoVoto, candidatoId
  } = req.body;

  if (!cpf || !nome || !genero || !dataNascimento || !cidade || !estado || !tipoVoto) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  }
  if (tipoVoto === 'valido' && !candidatoId) {
    return res.status(400).json({ error: 'candidatoId é obrigatório quando tipoVoto = valido' });
  }

  try {
    const sql = `
      INSERT INTO eleitores
        (cpf, nome, genero, data_nascimento, cidade, estado, tipo_voto, candidato_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (cpf) DO NOTHING
      RETURNING id, criado_em
    `;
    const params = [
      cpf, nome, genero, dataNascimento, cidade, estado,
      tipoVoto, tipoVoto === 'valido' ? candidatoId : null
    ];

    const { rows } = await pool.query(sql, params);
    if (rows.length === 0) {
      // conflito de UNIQUE
      return res.status(409).json({ error: 'Este CPF já votou.' });
    }
    return res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao salvar voto' });
  }
});



app.get('/votos', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT e.id, e.cpf, e.nome, e.genero, e.data_nascimento, e.cidade, e.estado,
             e.tipo_voto, e.candidato_id,
             c.nome AS candidato_nome
      FROM eleitores e
      LEFT JOIN candidatos c ON c.id = e.candidato_id
      ORDER BY e.id DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao listar votos' });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Process-service rodando na porta ${process.env.PORT || 8080}`);
});