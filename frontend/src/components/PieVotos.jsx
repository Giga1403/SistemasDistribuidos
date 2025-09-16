import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6C4AB6", // Roxo
  "#FFD600", // Amarelo
  "#2196F3", // Azul
  "#43A047", // Verde
  "#FF6384", // Rosa
  "#FF9800", // Laranja
];

function PieVotos({ candidatos }) {
  const totalVotos = candidatos.reduce(
    (acc, c) => acc + c.total_votos_validos,
    0
  );
  const data = candidatos.map((c, idx) => ({
    name: c.nome,
    value: c.total_votos_validos,
    percent: ((c.total_votos_validos / totalVotos) * 100).toFixed(1),
  }));

  return (
    <ResponsiveContainer width="80%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name, props) => [`${value} votos`, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieVotos;
