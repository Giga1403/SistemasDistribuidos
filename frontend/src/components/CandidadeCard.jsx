export default function CandidateCard({
  candidato,
  selecionado,
  onSelect,
  disabled,
}) {
  const active = selecionado === candidato.id;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(candidato.id)}
      className={[
        "w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition",
        "hover:shadow-md",
        active ? "ring-2 ring-indigo-500" : "",
        disabled ? "opacity-50" : "",
      ].join(" ")}
      aria-pressed={active}
    >
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-lg bg-indigo-50 text-3xl">
          {candidato.emoji}
        </div>
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-slate-800">
            {candidato.nome}
          </div>
          <div className="mx-auto mt-3 w-40 rounded-full bg-indigo-50 px-2 py-1 text-center text-xs font-medium text-indigo-700">
            Candidato {candidato.numero}
          </div>
        </div>
      </div>
    </button>
  );
}
