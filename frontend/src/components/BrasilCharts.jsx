import { useEffect, useRef, useState } from "react";
import Brazil from "@react-map/brazil";
import { NAME_TO_UF } from "../constants";

const deAccent = (s = "") =>
  s.normalize?.("NFD").replace(/[\u0300-\u036f]/g, "") || s;

const cleanName = (s = "") =>
  deAccent(s)
    .replace(/[‹›]/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[-–—].*$/, "")
    .replace(/\s+/g, " ")
    .trim();

const nameToUF = (raw) => {
  if (!raw) return null;
  const s = raw.trim();
  if (/^[A-Z]{2}$/.test(s)) return s;
  const uf = NAME_TO_UF[s] || NAME_TO_UF[deAccent(s)];
  if (uf) return uf;
  const key = cleanName(s);
  for (const nome in NAME_TO_UF) {
    if (deAccent(nome).toLowerCase() === key.toLowerCase()) {
      return NAME_TO_UF[nome];
    }
  }
  return null;
};

const fmt = (n) => (n ?? 0).toLocaleString("pt-BR", { notation: "compact" });
const fmtInt = (n) => (n ?? 0).toLocaleString("pt-BR");

// Nome “bonito” por UF (pode mover para constants se quiser)
const UF_TO_NAME = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

export default function MapaBrasilComLabels({
  votosPorUf = {},
  size = 520,
  showZeros = false,
}) {
  const wrapRef = useRef(null);
  const mapRef = useRef(null);
  const [labels, setLabels] = useState([]);
  const [selectedUF, setSelectedUF] = useState(null);

  const totalValidos = Object.values(votosPorUf).reduce(
    (acc, v) => acc + Number(v || 0),
    0
  );
  const selectedValue = Number(selectedUF ? votosPorUf[selectedUF] || 0 : 0);
  const selectedPct =
    totalValidos > 0 ? (selectedValue / totalValidos) * 100 : 0;

  const recompute = () => {
    const wrap = wrapRef.current;
    const svg = wrap?.querySelector("svg");
    if (!wrap || !svg) return;

    const wrapRect = wrap.getBoundingClientRect();
    const paths = svg.querySelectorAll("path");
    const next = [];

    paths.forEach((p) => {
      const candidates = [
        p.getAttribute("data-name"),
        p.getAttribute("name"),
        p.getAttribute("aria-label"),
        p.getAttribute("id"),
        p.getAttribute("title"),
        p.querySelector("title")?.textContent,
      ]
        .filter(Boolean)
        .map(cleanName);

      let uf = null;
      for (const c of candidates) {
        uf = nameToUF(c);
        if (uf) break;
      }
      if (!uf) return;

      const value = Number(votosPorUf[uf] || 0);
      if (!showZeros && value === 0) return;

      const r = p.getBoundingClientRect();
      const cx = r.left + r.width / 2 - wrapRect.left;
      const cy = r.top + r.height / 2 - wrapRect.top;
      next.push({ uf, x: cx, y: cy, value });
    });

    setLabels(next);
  };

  // Fallback: captura cliques nos path caso a lib não emita onChange
  useEffect(() => {
    const svg = mapRef.current?.querySelector("svg");
    if (!svg) return;

    const handleClick = (e) => {
      const path = e.target.closest("path");
      if (!path) return;

      const candidates = [
        path.getAttribute("data-name"),
        path.getAttribute("name"),
        path.getAttribute("aria-label"),
        path.getAttribute("id"),
        path.getAttribute("title"),
        path.querySelector("title")?.textContent,
      ]
        .filter(Boolean)
        .map(cleanName);

      for (const c of candidates) {
        const uf = nameToUF(c);
        if (uf) {
          setSelectedUF(uf);
          break;
        }
      }
    };

    svg.addEventListener("click", handleClick);
    return () => svg.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(recompute);
    return () => cancelAnimationFrame(id);
  }, [votosPorUf, size]);

  useEffect(() => {
    const ro = new ResizeObserver(recompute);
    if (wrapRef.current) ro.observe(wrapRef.current);

    const mo = new MutationObserver(recompute);
    if (mapRef.current)
      mo.observe(mapRef.current, { childList: true, subtree: true });

    window.addEventListener("resize", recompute, { passive: true });
    window.addEventListener("scroll", recompute, { passive: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", recompute);
      window.removeEventListener("scroll", recompute);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <div ref={mapRef} className="relative flex justify-center">
        <Brazil
          type="select-single"
          size={size}
          mapColor="#e9eff9"
          selectColor="#3b82f6"
          strokeColor="#94a3b8"
          strokeWidth={0.8}
          hoverColor="#7aa2f7"
          onChange={(uf) => {
            const code =
              typeof uf === "string"
                ? uf
                : uf?.uf || uf?.code || uf?.sigla || null;
            if (code && /^[A-Z]{2}$/.test(code)) setSelectedUF(code);
          }}
        />
      </div>

      {labels.map((it) => (
        <span
          key={it.uf}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded bg-white/60 px-1.5 py-0.5 text-[11px] font-semibold text-slate-800 shadow ring-1 ring-black/5"
          style={{ left: it.x, top: it.y }}
          title={`${it.uf}: ${Number(it.value).toLocaleString("pt-BR")} votos`}
        >
          {fmt(it.value)}
        </span>
      ))}

      {/* Painel de informações do estado selecionado */}
      <div className="mt-3 grid place-items-center">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white/70 p-3 shadow-sm backdrop-blur">
          {selectedUF ? (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Estado</p>
                <p className="truncate text-base font-semibold text-slate-800">
                  {UF_TO_NAME[selectedUF] || selectedUF} ({selectedUF})
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">
                  Votos válidos do Vencedor
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {fmtInt(selectedValue)}
                </p>
                <p className="text-xs text-slate-500">
                  {totalValidos > 0
                    ? `${selectedPct.toLocaleString("pt-BR", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}% do total`
                    : "—"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-slate-600">
              Clique em um estado para ver os votos válidos e a porcentagem no
              total.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
