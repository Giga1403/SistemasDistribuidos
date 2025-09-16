import { useMemo, useState, useEffect } from "react";
import { ESTADOS } from "../constants";
import { fetchCandidatos, registrarVoto } from "../api";
import CandidateCard from "../components/CandidadeCard";
import Spinner from "../components/Spinner";

export default function Votacao({ onConfirm }) {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [genero, setGenero] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");

  const [candidatoId, setCandidatoId] = useState(null);
  const [votoBranco, setVotoBranco] = useState(false);
  const [votoNulo, setVotoNulo] = useState(false);

  const [candidatos, setCandidatos] = useState([]);
  const [loadingCandidatos, setLoadingCandidatos] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  function maskCpf(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  }

  useEffect(() => {
    async function loadCandidatos() {
      setLoadingCandidatos(true);
      try {
        const data = await fetchCandidatos();
        setCandidatos(data);
      } finally {
        setLoadingCandidatos(false);
      }
    }
    loadCandidatos();
  }, []);

  const candidatoSelecionado = useMemo(
    () => candidatos.find((c) => c.id === candidatoId),
    [candidatoId, candidatos]
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
    if (!nome.trim()) return "Informe o nome.";
    if (!genero) return "Selecione o gênero.";
    if (!nascimento) return "Informe a data de nascimento.";
    if (!uf) return "Selecione o estado.";
    if (!cidade.trim()) return "Informe a cidade.";
    if (!candidatoId && !votoBranco && !votoNulo)
      return "Escolha um candidato ou marque Branco/Nulo.";
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const erro = validar();
    if (erro) {
      alert(erro);
      return;
    }
    const payload = {
      cpf: cpf.replace(/\D/g, ""),
      nome,
      genero,
      dataNascimento: nascimento,
      estado: uf,
      cidade,
      tipoVoto: votoBranco ? "branco" : votoNulo ? "nulo" : "valido",
      candidatoId: votoBranco || votoNulo ? null : candidatoId,
    };
    setLoadingSubmit(true);
    try {
      await registrarVoto(payload);
      alert("Voto registrado com sucesso!");
      onConfirm();
    } catch (e) {
      alert("Erro ao registrar voto:", e.error);
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <main className="relative mx-auto max-w-8xl px-4 py-5">
      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-md sm:p-8"
      >
        {/* DADOS PESSOAIS */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900">
            Dados Pessoais
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                CPF <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(maskCpf(e.target.value))}
                placeholder="000.000.000-00"
                inputMode="numeric"
                maxLength={14}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/60"
              />
            </div>

            <div className="space-y-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/60"
              />
            </div>

            <div className="space-y-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Gênero <span className="text-red-500">*</span>
              </label>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/60 "
              >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Data de Nascimento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/60"
              />
            </div>

            <div className="space-y-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/60"
              >
                <option value="">Selecione</option>
                {ESTADOS.map((sigla) => (
                  <option key={sigla} value={sigla}>
                    {sigla}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Cidade <span className="text-red-500">*</span>
              </label>
              <input
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex.: Cuiabá"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/60"
              />
            </div>
          </div>
        </section>

        <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <section className="mb-6">
          <h2 className="text-sm font-semibold text-slate-900 pb-4">Votação</h2>

          {/* Candidatos Section */}
          {loadingCandidatos ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Candidatos */}
              <div className="lg:col-span-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {candidatos.map((c) => (
                  <CandidateCard
                    key={c.id}
                    candidato={c}
                    selecionado={candidatoId}
                    onSelect={(id) => {
                      setCandidatoId(id);
                      setVotoBranco(false);
                      setVotoNulo(false);
                    }}
                    size={400}
                    disabled={votoBranco || votoNulo}
                  />
                ))}
              </div>

              {/* Branco / Nulo */}
              <div className="flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={toggleBranco}
                  className={`w-40 rounded-xl p-4 text-center shadow-sm transition hover:shadow-md cursor-pointer ${
                    votoBranco
                      ? "bg-indigo-100 ring-2 ring-indigo-500"
                      : "bg-white"
                  }`}
                >
                  <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-indigo-50 text-lg">
                    &#9745;
                  </div>
                  <div className="text-sm font-medium text-slate-700">
                    Voto em Branco
                  </div>
                </button>
                <button
                  type="button"
                  onClick={toggleNulo}
                  className={`w-40 rounded-xl p-4 text-center shadow-sm transition hover:shadow-md cursor-pointer ${
                    votoNulo ? "bg-red-100 ring-2 ring-red-500" : "bg-white"
                  }`}
                >
                  <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-red-50 text-lg">
                    &#10060;
                  </div>
                  <div className="text-sm font-medium text-slate-700">
                    Voto Nulo
                  </div>
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="rounded-xl bg-yellow-600 px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 cursor-pointer"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? "Processando..." : "Confirmar voto"}
          </button>
        </div>
      </form>
    </main>
  );
}
