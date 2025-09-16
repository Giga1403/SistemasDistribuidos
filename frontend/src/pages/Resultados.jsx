import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchResultados } from "../api";
import CandidateCard from "../components/CandidadeCard";
import BrasilCharts from "../components/BrasilCharts";
import PieVotos from "../components/PieVotos";
import AgrupadoBarVotos from "../components/AgrupadoBarVotos";
import { REGIAO_BY_UF } from "../constants";

function formatNumber(n) {
  return new Intl.NumberFormat("pt-BR").format(Number(n) || 0);
}

function getBarData(votosValidosPorCandidatoEstado) {
  const regioes = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];
  const data = regioes.map((regiao) => ({ regiao }));
  votosValidosPorCandidatoEstado.forEach((item) => {
    const regiao = REGIAO_BY_UF[item.estado] || "Sem Estado";
    const regiaoObj = data.find((d) => d.regiao === regiao);
    if (regiaoObj) {
      regiaoObj[item.candidato] =
        (regiaoObj[item.candidato] || 0) +
        Number(item.votos_validos_por_estado);
    }
  });
  return data;
}

export default function Resultados() {
  const [dados, setDados] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function loadResultados() {
      try {
        const resultado = await fetchResultados();
        setDados(resultado?.data || null);
      } catch (error) {
        console.error("Erro ao carregar resultados:", error);
        setDados(null);
      }
    }
    loadResultados();
  }, [location]);

  if (!dados) return <div>Carregando...</div>;

  // KPIs
  const kpis = {
    validos: dados.totais_gerais.total_votos_validos,
    brancos: dados.totais_gerais.total_votos_brancos,
    nulos: dados.totais_gerais.total_votos_nulos,
    total: dados.totais_gerais.total_votos,
  };

  // Filtra candidatos com votos válidos > 0
  const candidatosComVotos = dados.candidatos.filter(
    (c) => Number(c.total_votos_validos) > 0
  );

  // Vencedor
  const vencedor =
    candidatosComVotos.length > 0
      ? candidatosComVotos.reduce(
          (max, it) =>
            Number(it.total_votos_validos) > Number(max.total_votos_validos)
              ? it
              : max,
          candidatosComVotos[0]
        )
      : null;

  // Votos do vencedor por estado
  const votosPorUfVencedor = {};
  if (vencedor) {
    dados.votos_validos_por_candidato_estado.forEach((item) => {
      if (
        item.candidato_id === vencedor.id &&
        Number(item.votos_validos_por_estado) > 0
      ) {
        votosPorUfVencedor[item.estado] = Number(item.votos_validos_por_estado);
      }
    });
  }

  return (
    <main className="mx-auto max-w-8xl px-4 py-6 sm:py-8">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-md sm:p-8">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Resultados
        </h2>

        {/* KPIs */}
        <section className="mb-8 grid gap-4 sm:grid-cols-4">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total de votos
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatNumber(kpis.total)}
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
              <BrasilCharts votosPorUf={votosPorUfVencedor} height={520} />
            </div>

            <div className="flex flex-col gap-6">
              {/* Gráfico de pizza de votos */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col items-center justify-center">
                <h4 className="mb-2 text-base font-semibold text-slate-700">
                  % de votos por candidato
                </h4>
                <PieVotos candidatos={candidatosComVotos} />
              </div>
              {/* Gráfico de barras agrupadas */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col items-center justify-center">
                <h4 className="mb-2 text-base font-semibold text-slate-700 text-center">
                  Votos por candidato e região
                </h4>
                <AgrupadoBarVotos
                  data={getBarData(
                    dados.votos_validos_por_candidato_estado.filter(
                      (item) => Number(item.votos_validos_por_estado) > 0
                    )
                  )}
                  candidatos={candidatosComVotos}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
