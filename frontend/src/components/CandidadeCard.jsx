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
          <img
            src={candidato.foto_url}
            alt={candidato.nome}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-slate-800">
            {candidato.nome}
          </div>
        </div>
      </div>
    </button>
  );
}
