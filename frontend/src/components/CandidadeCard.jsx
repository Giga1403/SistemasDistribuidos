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
        "relative w-full overflow-hidden rounded-xl shadow-md transition",
        "hover:shadow-lg cursor-pointer",
        active ? "ring-2 ring-indigo-500" : "",
        disabled ? "opacity-50" : "",
      ].join(" ")}
      aria-pressed={active}
    >
      <img
        src={candidato.foto_url}
        alt={candidato.nome}
        className="h-60 w-full object-cover"
      />

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
        <p className="truncate text-lg font-semibold text-white">
          {candidato.nome}
        </p>
      </div>
    </button>
  );
}
