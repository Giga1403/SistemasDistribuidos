const pool = require("./db");

// Função para apurar votos por candidato
async function getResults() {
  const query = `
    SELECT candidato, COUNT(*) as total_votos
    FROM votos
    GROUP BY candidato
    ORDER BY total_votos DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

module.exports = { getResults };
