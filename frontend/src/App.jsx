import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [candidato, setCandidato] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [resultados, setResultados] = useState([]);

  const votar = async () => {
    try {
      const res = await axios.post("http://localhost:3000/votar", { candidato });
      setMensagem(res.data.message);
      setCandidato("");
    } catch (err) {
      setMensagem("Erro ao votar");
    }
  };

  const apurar = async () => {
    try {
      const res = await axios.get("http://localhost:4000/apurar");
      setResultados(res.data.data);
    } catch (err) {
      setMensagem("Erro ao buscar apuração");
    }
  };

  useEffect(() => {
    apurar();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sistema de Votação Online</h1>

      <div>
        <h2>Votar</h2>
        <input
          type="text"
          value={candidato}
          placeholder="Digite o nome do candidato"
          onChange={(e) => setCandidato(e.target.value)}
        />
        <button onClick={votar}>Confirmar Voto</button>
      </div>

      {mensagem && <p>{mensagem}</p>}

      <div>
        <h2>Resultados</h2>
        <button onClick={apurar}>Atualizar Apuração</button>
        <ul>
          {resultados.map((r, idx) => (
            <li key={idx}>
              {r.candidato} - {r.total_votos} votos
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
