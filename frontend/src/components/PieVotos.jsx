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
  "#FF6384", // Rosa
  "#2196F3", // Azul
  "#43A047", // Verde
  "#FF9800", // Laranja
];

function PieVotos({ candidatos }) {
  // Garante que os votos são números
  const totalVotos = candidatos.reduce(
    (acc, c) => acc + Number(c.total_votos_validos),
    0
  );
  const data = candidatos.map((c, idx) => ({
    name: c.nome,
    value: Number(c.total_votos_validos),
    percent:
      totalVotos > 0
        ? ((Number(c.total_votos_validos) / totalVotos) * 100).toFixed(1)
        : "0.0",
  }));

  // Se não houver votos, não renderiza o gráfico
  if (totalVotos === 0) {
    return <div>Nenhum voto registrado.</div>;
  }

  return (
    <ResponsiveContainer width="80%" height={300}>
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
        <Tooltip
          formatter={(value, name, props) => [
            `${props.payload.percent}% - ${value} votos`,
            name,
          ]}
          itemStyle={{}}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieVotos;
