"use client";
import { useMemo } from "react";
import { Paper, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface OrdersChartProps {
  promedioMensual?: {
    mes: number;
    pedidos: number;
    ventas: number;
    ganancia: number;
  }[];
  isYearFilter: boolean;
}

const meses = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const OrdersChart: React.FC<OrdersChartProps> = ({
  promedioMensual,
  isYearFilter,
}) => {
  const chartData = useMemo(() => {
    if (!promedioMensual) return [];
    return promedioMensual.map((item) => ({
      name: meses[item.mes - 1],
      pedidos: item.pedidos,
      ventas: item.ventas / 1000,
      ganancia: item.ganancia / 1000,
    }));
  }, [promedioMensual]);

  if (!isYearFilter || !promedioMensual) return null;

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
        Pedidos y Ventas por Mes
      </Typography>

      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Pedidos") return [value, "Pedidos"];
                return [
                  `$${(Number(value) * 1000).toFixed(2)}`,
                  name === "Ventas" ? "Ventas" : "Ganancia",
                ];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="pedidos"
              fill="#8884d8"
              name="Pedidos"
            />
            <Bar
              yAxisId="right"
              dataKey="ventas"
              fill="#82ca9d"
              name="Ventas"
            />
            <Bar
              yAxisId="right"
              dataKey="ganancia"
              fill="#ffc658"
              name="Ganancia"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default OrdersChart;
