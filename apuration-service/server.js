    const express = require("express");
const cors = require("cors");
const { getResults } = require("./queries");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Endpoint de apuração
app.get("/apurar", async (req, res) => {
  try {
    const resultados = await getResults();
    res.json({
      status: "success",
      data: resultados
    });
  } catch (err) {
    console.error("Erro ao apurar votos:", err);
    res.status(500).json({ status: "error", message: "Erro interno" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serviço de Apuração rodando em http://localhost:${PORT}`);
});
