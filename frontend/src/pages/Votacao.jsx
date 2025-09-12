import { useMemo, useState } from "react";
import { CANDIDATOS, ESTADOS } from "../constants";
import CandidateCard from "../components/CandidadeCard";

export default function Votacao({ onConfirm }) {
  const [cpf, setCpf] = useState("");

  function maskCpf(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  }
  const [nascimento, setNascimento] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");

  const [candidatoId, setCandidatoId] = useState(null);
  const [votoBranco, setVotoBranco] = useState(false);
  const [votoNulo, setVotoNulo] = useState(false);

  const candidatoSelecionado = useMemo(
    () => CANDIDATOS.find((c) => c.id === candidatoId),
    [candidatoId]
  );

  function toggleBranco() {
    const novo = !votoBranco;
    setVotoBranco(novo);
    if (novo) {
      setVotoNulo(false);
      setCandidatoId(null);
    }
  }
  function toggleNulo() {
    const novo = !votoNulo;
    setVotoNulo(novo);
    if (novo) {
      setVotoBranco(false);
      setCandidatoId(null);
    }
  }

  function validar() {
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) return "Informe um CPF válido.";
    if (!nascimento) return "Informe a data de nascimento.";
    if (!uf) return "Selecione o estado.";
    if (!cidade.trim()) return "Informe a cidade.";
    if (!candidatoId && !votoBranco && !votoNulo)
      return "Escolha um candidato ou marque Branco/Nulo.";
    return null;
  }

  function onSubmit(e) {
    e.preventDefault();
    const erro = validar();
    if (erro) {
      alert(erro);
      return;
    }
    const payload = {
      eleitor: { cpf, nascimento, uf, cidade },
      voto: votoBranco
        ? "BRANCO"
        : votoNulo
        ? "NULO"
        : {
            candidatoId,
            nome: candidatoSelecionado?.nome,
          },
      dataHora: new Date().toISOString(),
    };
    onConfirm(payload);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <h2 className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold text-slate-800">
          🧾 Realize seu Voto
        </h2>

        {/* Dados pessoais */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Dados Pessoais
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                CPF *
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(maskCpf(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-400 transition focus:ring-2"
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            <div className="space-y-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-400 transition focus:ring-2"
              />
            </div>

            <div className="space-y-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Estado
              </label>
              <select
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-400 transition focus:ring-2"
              >
                <option value="">Selecione o estado</option>
                {ESTADOS.map((sigla) => (
                  <option key={sigla} value={sigla}>
                    {sigla}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Cidade
              </label>
              <input
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Digite sua cidade"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-400 transition focus:ring-2"
              />
            </div>
          </div>
        </section>

        {/* Candidatos */}
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Escolha seu Candidato
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CANDIDATOS.map((c) => (
              <CandidateCard
                key={c.id}
                candidato={c}
                selecionado={candidatoId}
                onSelect={(id) => {
                  setCandidatoId(id);
                  setVotoBranco(false);
                  setVotoNulo(false);
                }}
                disabled={votoBranco || votoNulo}
              />
            ))}
          </div>
        </section>

        {/* Branco / Nulo */}
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Opções Especiais
          </h3>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={toggleBranco}
              className={[
                "w-40 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition",
                "hover:shadow-md",
                votoBranco ? "ring-2 ring-indigo-500" : "",
              ].join(" ")}
            >
              <div className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded bg-slate-100 text-lg">
                ☑️
              </div>
              <div className="text-sm font-medium text-slate-700">
                Voto em Branco
              </div>
            </button>

            <button
              type="button"
              onClick={toggleNulo}
              className={[
                "w-40 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition",
                "hover:shadow-md",
                votoNulo ? "ring-2 ring-indigo-500" : "",
              ].join(" ")}
            >
              <div className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded bg-slate-100 text-lg">
                ❌
              </div>
              <div className="text-sm font-medium text-slate-700">
                Voto Nulo
              </div>
            </button>
          </div>
          {(votoBranco || votoNulo) && (
            <p className="mt-3 text-xs text-slate-600">
              Marcando Branco/Nulo, a seleção de candidatos fica desabilitada.
            </p>
          )}
        </section>

        <div className="flex justify-center">
          <button className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition hover:bg-indigo-700">
            Confirmar Voto 🗳️
          </button>
        </div>
      </form>
    </main>
  );
}
