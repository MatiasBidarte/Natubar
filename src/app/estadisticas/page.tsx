"use client";
import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUsuarioStore } from "../hooks/useUsuarioStore";

import FilterControls from "./components/FilterControls";
import StatisticsSummary from "./components/StatisticsSummary";
import OrdersChart from "./components/OrdersChart";
import TopCustomersChart from "./components/TopCustomersChart";
import ProductsChart from "./components/ProductsChart";
import OrdersTable from "./components/OrdersTable";
import useEstadisticas from "../hooks/useEstadisticas";
import { EstadisticasResumen } from "../hooks/interfaces/EstadisticasInterfaces";

const EstadisticasPage = () => {
  const router = useRouter();
  const {
    fetchAllPedidosForStats,
    getEstadisticasFiltradas,
    loadingEstadisticas,
  } = useEstadisticas();
  const { esAdmin, estaLogueado } = useUsuarioStore();

  const currentYear = new Date().getFullYear();
  const [mes, setMes] = useState<number | null>(null);
  const [anio, setAnio] = useState<number>(currentYear);
  const [estadisticas, setEstadisticas] = useState<EstadisticasResumen | null>(
    null
  );

  /* useEffect(() => {
    if (!estaLogueado || !esAdmin) {
      router.push("/");
    }
  }, [estaLogueado, esAdmin, router]); */

  useEffect(() => {
    fetchAllPedidosForStats().then(() => {
      const stats = getEstadisticasFiltradas(null, currentYear);
      setEstadisticas(stats);
    });
  }, [fetchAllPedidosForStats, getEstadisticasFiltradas, currentYear]);

  const handleFilterChange = (nuevoMes: number | null, nuevoAnio: number) => {
    setMes(nuevoMes);
    setAnio(nuevoAnio);

    const stats = getEstadisticasFiltradas(nuevoMes, nuevoAnio);
    setEstadisticas(stats);
  };

  /* if (!estaLogueado || !esAdmin) {
    return null;
  } */

  if (loadingEstadisticas || !estadisticas) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress sx={{ color: "#B99342" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: 1600, mx: "auto", p: 3, mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Panel de Estadísticas
      </Typography>

      <FilterControls onFilterChange={handleFilterChange} />

      <Typography variant="h5" mb={3} fontWeight="medium">
        {mes
          ? `Estadísticas de ${new Date(0, mes - 1).toLocaleString("es-ES", {
              month: "long",
            })} ${anio}`
          : `Estadísticas del año ${anio}`}
      </Typography>

      <StatisticsSummary
        totalPedidos={estadisticas.totalPedidos}
        totalVentas={estadisticas.totalVentas}
        ganancia={estadisticas.ganancia}
        isYearFilter={!mes}
        promedioMensual={estadisticas.promedioMensual}
      />

      <OrdersChart
        promedioMensual={estadisticas.promedioMensual}
        isYearFilter={!mes}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TopCustomersChart topClientes={estadisticas.topClientes} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProductsChart productosVendidos={estadisticas.productosVendidos} />
        </Grid>
      </Grid>

      <OrdersTable pedidos={estadisticas.pedidosFiltrados} />
    </Box>
  );
};

export default EstadisticasPage;
