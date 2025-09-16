import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchResultados } from "../api";
import CandidateCard from "../components/CandidadeCard";
import BrasilCharts from "../components/BrasilCharts";
import PieVotos from "../components/PieVotos";
import AgrupadoBarVotos from "../components/AgrupadoBarVotos";
import { REGIAO_BY_UF } from "../constants";

const USE_MOCK = true;
const MOCK_RESULTADOS = [
  {
    id: 1,
    nome: "Ana Silva",
    foto_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80&auto=format&fit=crop",
    total_votos_validos: 412,
    total_votos_brancos: 23,
    total_votos_nulos: 17,
    votos_por_uf: {
      AC: 20,
      AL: 30,
      AP: 10,
      AM: 25,
      BA: 60,
      CE: 40,
      DF: 35,
      ES: 25,
      GO: 30,
      MA: 35,
      MT: 40,
      MS: 20,
      MG: 80,
      PA: 40,
      PB: 20,
      PR: 50,
      PE: 40,
      PI: 15,
      RJ: 70,
      RN: 10,
      RS: 60,
      RO: 10,
      RR: 5,
      SC: 40,
      SP: 100,
      SE: 10,
      TO: 7,
    },
  },
  {
    id: 2,
    nome: "Carlos Santos",
    foto_url:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=256&q=80&auto=format&fit=crop",
    total_votos_validos: 389,
    total_votos_brancos: 23,
    total_votos_nulos: 17,
    votos_por_uf: {
      AC: 15,
      AL: 25,
      AP: 8,
      AM: 20,
      BA: 55,
      CE: 35,
      DF: 30,
      ES: 20,
      GO: 25,
      MA: 30,
      MT: 35,
      MS: 18,
      MG: 70,
      PA: 35,
      PB: 18,
      PR: 45,
      PE: 35,
      PI: 12,
      RJ: 60,
      RN: 8,
      RS: 55,
      RO: 8,
      RR: 4,
      SC: 35,
      SP: 90,
      SE: 8,
      TO: 6,
    },
  },
  {
    id: 3,
    nome: "Maria Oliveira",
    foto_url:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=256&q=80&auto=format&fit=crop",
    total_votos_validos: 451,
    total_votos_brancos: 23,
    total_votos_nulos: 17,
    votos_por_uf: {
      AC: 25,
      AL: 35,
      AP: 12,
      AM: 30,
      BA: 65,
      CE: 45,
      DF: 40,
      ES: 30,
      GO: 35,
      MA: 40,
      MT: 45,
      MS: 22,
      MG: 90,
      PA: 45,
      PB: 22,
      PR: 55,
      PE: 45,
      PI: 18,
      RJ: 80,
      RN: 12,
      RS: 65,
      RO: 12,
      RR: 6,
      SC: 45,
      SP: 110,
      SE: 12,
      TO: 8,
    },
  },
];

const MOCK_VOTOS_POR_UF = {
  AC: 120,
  AL: 340,
  AP: 90,
  AM: 280,
  BA: 980,
  CE: 610,
  DF: 520,
  ES: 430,
  GO: 470,
  MA: 560,
  MT: 620,
  MS: 410,
  MG: 1300,
  PA: 700,
  PB: 360,
  PR: 900,
  PE: 770,
  PI: 300,
  RJ: 1100,
  RN: 290,
  RS: 950,
  RO: 200,
  RR: 120,
  SC: 730,
  SP: 2300,
  SE: 260,
  TO: 240,
};

function sum(arr, key) {
  return arr.reduce((acc, it) => acc + (Number(it?.[key]) || 0), 0);
}

function formatNumber(n) {
  return new Intl.NumberFormat("pt-BR").format(n || 0);
}

function getBarData(resultados) {
  // Agrupa votos por candidato e região
  // Exemplo: [{ regiao: 'Norte', Ana: 100, Carlos: 80, Maria: 120 }, ...]
  const regioes = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];
  // Inicializa estrutura
  const data = regioes.map((regiao) => ({ regiao }));
  resultados.forEach((candidato) => {
    if (candidato.votos_por_uf) {
      Object.entries(candidato.votos_por_uf).forEach(([uf, votos]) => {
        const regiao = REGIAO_BY_UF[uf];
        const regiaoObj = data.find((d) => d.regiao === regiao);
        if (regiaoObj) {
          regiaoObj[candidato.nome] = (regiaoObj[candidato.nome] || 0) + votos;
        }
      });
    }
  });
  return data;
}

export default function Resultados() {
  const [resultados, setResultados] = useState([]);
  const location = useLocation();

  useEffect(() => {
    async function loadResultados() {
      try {
        if (USE_MOCK) {
          setResultados(MOCK_RESULTADOS);
        } else {
          const resultado = await fetchResultados();
          setResultados(resultado?.data || []);
        }
      } catch (error) {
        console.error("Erro ao carregar resultados:", error);
        setResultados([]);
      }
    }
    loadResultados();
  }, [location]);

  // KPIs (somatório)
  const kpis = useMemo(() => {
    const validos = sum(resultados, "total_votos_validos");
    const brancos = sum(resultados, "total_votos_brancos");
    const nulos = sum(resultados, "total_votos_nulos");
    return { validos, brancos, nulos };
  }, [resultados]);

  // vencedor
  const vencedor = useMemo(() => {
    if (!resultados.length) return null;
    return resultados.reduce((max, it) =>
      (it.total_votos_validos || 0) > (max.total_votos_validos || 0) ? it : max
    );
  }, [resultados]);

  return (
    <main className="mx-auto max-w-8xl px-4 py-6 sm:py-8">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-md sm:p-8">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Resultados
        </h2>

        {/* KPIs */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Votos válidos
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatNumber(kpis.validos)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Votos em branco
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatNumber(kpis.brancos)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Votos nulos
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatNumber(kpis.nulos)}
            </p>
          </div>
        </section>

        <section className="mb-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Card do vencedor */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              {vencedor ? (
                <>
                  <h4 className="mb-2 text-base font-semibold text-slate-700 text-center">
                    Candidato Vencedor
                  </h4>
                  <CandidateCard
                    candidato={{
                      id: vencedor.id,
                      nome: vencedor.nome,
                      foto_url: vencedor.foto_url,
                    }}
                    selecionado={vencedor.id}
                    onSelect={() => {}}
                    size={550}
                  />
                  <p className="mt-2 text-sm text-slate-600">
                    Total de votos válidos:{" "}
                    <span className="font-medium">
                      {formatNumber(vencedor.total_votos_validos)}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-600">Ainda sem vencedor.</p>
              )}
            </div>

            {/* Mapa do Brasil por UF */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="mb-2 text-base font-semibold text-slate-700 text-center">
                Votos do candidato vencedor por estado
              </h4>
              <BrasilCharts votosPorUf={MOCK_VOTOS_POR_UF} height={520} />
            </div>

            <div className="flex flex-col gap-6">
              {/* Gráfico de pizza de votos */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col items-center justify-center">
                <h4 className="mb-2 text-base font-semibold text-slate-700">
                  % de votos por candidato
                </h4>
                <PieVotos candidatos={resultados} />
              </div>
              {/* Gráfico de barras agrupadas */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col items-center justify-center">
                <h4 className="mb-2 text-base font-semibold text-slate-700 text-center">
                  Votos por candidato e região
                </h4>
                <AgrupadoBarVotos
                  data={getBarData(resultados)}
                  candidatos={resultados}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
