"use client";
import { Paper, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopCustomersChartProps {
  topClientes: {
    clienteId: string;
    nombre: string;
    total: number;
    cantidadPedidos: number;
  }[];
}

const TopCustomersChart: React.FC<TopCustomersChartProps> = ({
  topClientes,
}) => {
  if (!topClientes || topClientes.length === 0) {
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
          Top Clientes por Ventas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No hay datos disponibles
        </Typography>
      </Paper>
    );
  }

  const chartData = topClientes.map((cliente) => ({
    name: cliente.nombre || `Cliente ${cliente.clienteId}`,
    total: cliente.total,
    pedidos: cliente.cantidadPedidos,
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
        Top Clientes por Ventas
      </Typography>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "pedidos") return [value, "Pedidos"];
                return [`$${value}`, "Total Gastado"];
              }}
            />
            <Bar dataKey="total" fill="#B99342" name="Total Gastado" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TopCustomersChart;
