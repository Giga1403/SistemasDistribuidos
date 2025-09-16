export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-3">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-20 rounded-lg  object-cover"
        />
      </div>
    </header>
  );
}
