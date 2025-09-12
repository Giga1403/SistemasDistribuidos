export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-100 text-2xl">
            🗳️
          </span>
          <h1 className="text-lg font-semibold text-slate-800">
            Sistema de Votação Online
          </h1>
        </div>
      </div>
    </header>
  );
}
