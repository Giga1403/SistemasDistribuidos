import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Espera dados no formato [{ regiao: 'Norte', Ana: 100, Carlos: 80, Maria: 120 }, ...]
function AgrupadoBarVotos({ data, candidatos }) {
  const colors = [
    "#6C4AB6", // Roxo
    "#FFD600", // Amarelo
    "#FF6384", // Rosa
    "#2196F3", // Azul
    "#43A047", // Verde
    "#FF6384", // Rosa
    "#FF9800", // Laranja
  ];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <XAxis dataKey="regiao" />
        <YAxis />
        <Tooltip />
        <Legend />
        {candidatos.map((c, idx) => (
          <Bar key={c.id} dataKey={c.nome} fill={colors[idx % colors.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default AgrupadoBarVotos;
