"use client";
import { Paper, Typography, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ProductsChartProps {
  productosVendidos: {
    productoId: number;
    nombre: string;
    cantidad: number;
    total: number;
  }[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#B99342",
];

const ProductsChart: React.FC<ProductsChartProps> = ({ productosVendidos }) => {
  if (!productosVendidos || productosVendidos.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          bgcolor: "#FFF9ED",
          mb: 4,
        }}
      >
        <Typography variant="h6" fontWeight="medium" mb={2}>
          Productos Más Vendidos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No hay datos disponibles
        </Typography>
      </Paper>
    );
  }

  // Limitar a los 6 productos más vendidos para el gráfico
  const topProductos = productosVendidos.slice(0, 6);

  // Preparar datos para el gráfico
  const chartData = topProductos.map((prod) => ({
    name: prod.nombre,
    value: prod.cantidad,
  }));

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "#FFF9ED",
        mb: 4,
      }}
    >
      <Typography variant="h6" fontWeight="medium" mb={2}>
        Productos Más Vendidos
      </Typography>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(Number(percent) * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} unidades`, "Cantidad"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ProductsChart;
