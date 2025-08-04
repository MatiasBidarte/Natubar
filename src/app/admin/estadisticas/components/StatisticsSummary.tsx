"use client";
import { Box, Paper, Typography, Grid } from "@mui/material";
import {
  AttachMoney,
  ShoppingCart,
  Inventory,
  TrendingUp,
} from "@mui/icons-material";

interface StatisticsSummaryProps {
  totalPedidos: number;
  totalVentas: number;
  ganancia: number;
  isYearFilter: boolean;
  promedioMensual?: {
    pedidos: number;
    ventas: number;
    ganancia: number;
  }[];
}

const StatisticsSummary: React.FC<StatisticsSummaryProps> = ({
  totalPedidos,
  totalVentas,
  ganancia,
  isYearFilter,
  promedioMensual,
}) => {
  let promedioPedidos = 0;
  let promedioVentas = 0;
  let promedioGanancia = 0;

  if (isYearFilter && promedioMensual) {
    const mesesConPedidos =
      promedioMensual.filter((m) => m.pedidos > 0).length || 1;
    promedioPedidos = totalPedidos / mesesConPedidos;
    promedioVentas = totalVentas / mesesConPedidos;
    promedioGanancia = ganancia / mesesConPedidos;
  }

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: "#FFF9ED",
            height: "100%",
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <ShoppingCart sx={{ color: "#B99342", mr: 1 }} />
            <Typography variant="h6" fontWeight="medium">
              Pedidos
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold">
            {totalPedidos}
          </Typography>
          {isYearFilter && (
            <Typography variant="body2" color="text.secondary">
              Promedio: {promedioPedidos.toFixed(1)} / mes
            </Typography>
          )}
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: "#FFF9ED",
            height: "100%",
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <AttachMoney sx={{ color: "#B99342", mr: 1 }} />
            <Typography variant="h6" fontWeight="medium">
              Ventas Totales
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold">
            ${totalVentas.toFixed(2)}
          </Typography>
          {isYearFilter && (
            <Typography variant="body2" color="text.secondary">
              Promedio: ${promedioVentas.toFixed(2)} / mes
            </Typography>
          )}
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: "#FFF9ED",
            height: "100%",
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <TrendingUp sx={{ color: "#B99342", mr: 1 }} />
            <Typography variant="h6" fontWeight="medium">
              Ganancias
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold">
            ${ganancia.toFixed(2)}
          </Typography>
          {isYearFilter && (
            <Typography variant="body2" color="text.secondary">
              Promedio: ${promedioGanancia.toFixed(2)} / mes
            </Typography>
          )}
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: "#FFF9ED",
            height: "100%",
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <Inventory sx={{ color: "#B99342", mr: 1 }} />
            <Typography variant="h6" fontWeight="medium">
              Valor Promedio
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold">
            $
            {totalPedidos > 0
              ? (totalVentas / totalPedidos).toFixed(2)
              : "0.00"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Por pedido
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default StatisticsSummary;
