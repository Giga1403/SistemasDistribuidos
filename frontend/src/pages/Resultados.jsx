import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchResultados } from "../api";

export default function Resultados() {
  const [resultados, setResultados] = useState([]);
  const location = useLocation();

  useEffect(() => {
    async function loadResultados() {
      try {
        const resultado = await fetchResultados();
        setResultados(resultado.data);
      } catch (error) {
        console.error("Erro ao carregar resultados:", error);
      }
    }
    loadResultados();
  }, [location]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-5">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-md sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-800">
          📊 Resultados
        </h2>
        {resultados.length > 0 ? (
          <ul className="space-y-4">
            {resultados.map((resultado) => (
              <li
                key={resultado.id}
                className="flex items-center gap-4 rounded-lg border border-slate-300 bg-white p-4 shadow-sm"
              >
                <img
                  src={resultado.foto_url}
                  alt={`Foto de ${resultado.nome}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-base font-medium text-slate-800">
                    {resultado.nome}
                  </p>
                  <p className="text-sm text-slate-600">
                    Votos válidos: {resultado.total_votos_validos}
                  </p>
                  <p className="text-sm text-slate-600">
                    Votos brancos: {resultado.total_votos_brancos}
                  </p>
                  <p className="text-sm text-slate-600">
                    Votos nulos: {resultado.total_votos_nulos}
                  </p>
                </div>
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
