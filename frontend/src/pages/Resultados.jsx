import { useEffect, useState } from "react";
import { fetchResultados } from "../api";

export default function Resultados() {
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    async function loadResultados() {
      const data = await fetchResultados();
      setResultados(data);
    }
    loadResultados();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-800">
          📊 Resultados
        </h2>
        {resultados.length > 0 ? (
          <ul className="space-y-4">
            {resultados.map((resultado) => (
              <li
                key={resultado.id}
                className="rounded-lg border border-slate-300 bg-white p-4 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-700">
                  Candidato: {resultado.nome} ({resultado.votos} votos)
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">Nenhum resultado disponível.</p>
        )}
      </div>
    </main>
  );
}
