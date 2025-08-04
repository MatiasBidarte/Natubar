"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import usePedidos from "../../hooks/usePedidos";
import { EstadosPedido, EstadosPagoPedido } from "../../types/pedido";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  Pagination,
} from "@mui/material";
import { AccessTime, CalendarMonth, LocalShipping } from "@mui/icons-material";
import PedidoItem from "./components/PedidoItem";

const ListaPedidosPage = () => {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<EstadosPedido>(
    EstadosPedido.enPreparacion
  );
  const [expandedPedidos, setExpandedPedidos] = useState<
    Record<number, boolean>
  >({});
  const [estadosCargados, setEstadosCargados] = useState<Set<EstadosPedido>>(
    new Set()
  );
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 5;

  const {
    pedidosEnCurso,
    pedidosFinalizados,
    loadingPedidos,
    errorPedidos,
    fetchPedidos,
    actualizarPedidoEnStore,
    actualizarEstadoPedido,
  } = usePedidos();

  // Actualizar la función para considerar también el estadoPago
  const hayPedidosParaEstado = useCallback(
    (estado: EstadosPedido) => {
      return [...pedidosEnCurso, ...pedidosFinalizados].some(
        (p) =>
          p.estado === estado ||
          (estado === EstadosPedido.pendientePago &&
            p.estado === EstadosPedido.entregado &&
            p.estadoPago === EstadosPagoPedido.pendiente)
      );
    },
    [pedidosEnCurso, pedidosFinalizados]
  );

  useEffect(() => {
    if (
      !hayPedidosParaEstado(EstadosPedido.enPreparacion) &&
      !estadosCargados.has(EstadosPedido.enPreparacion)
    ) {
      fetchPedidos(EstadosPedido.enPreparacion);
      setEstadosCargados((prev) =>
        new Set(prev).add(EstadosPedido.enPreparacion)
      );
    }
  }, [fetchPedidos, hayPedidosParaEstado, estadosCargados]);

  const handleEstadoClick = (estado: EstadosPedido) => {
    setEstadoSeleccionado(estado);
    setPaginaActual(1);

    if (!hayPedidosParaEstado(estado) && !estadosCargados.has(estado)) {
      fetchPedidos(estado);
      setEstadosCargados((prev) => new Set([...prev, estado]));
    }
  };

  const togglePedidoExpand = useCallback((id: number) => {
    setExpandedPedidos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const pedidosFiltrados = useMemo(
    () =>
      [...pedidosEnCurso, ...pedidosFinalizados].filter(
        (p) =>
          (p.estado === estadoSeleccionado &&
            !(
              estadoSeleccionado === EstadosPedido.entregado &&
              p.estadoPago === EstadosPagoPedido.pendiente
            )) ||
          (estadoSeleccionado === EstadosPedido.pendientePago &&
            p.estado === EstadosPedido.entregado &&
            p.estadoPago === EstadosPagoPedido.pendiente)
      ),
    [pedidosEnCurso, pedidosFinalizados, estadoSeleccionado]
  );

  const pedidosPaginados = useMemo(() => {
    const startIndex = (paginaActual - 1) * pedidosPorPagina;
    return pedidosFiltrados.slice(startIndex, startIndex + pedidosPorPagina);
  }, [pedidosFiltrados, paginaActual, pedidosPorPagina]);

  const getStatusColor = useCallback((estado: EstadosPedido) => {
    switch (estado) {
      case EstadosPedido.enPreparacion:
        return "bg-amber-400 text-[#201B21]";
      case EstadosPedido.pendientePago:
        return "bg-amber-300 text-[#201B21]";
      case EstadosPedido.enCamino:
        return "bg-blue-400 text-white";
      case EstadosPedido.entregado:
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  }, []);

  const getStatusIcon = useCallback((estado: EstadosPedido) => {
    switch (estado) {
      case EstadosPedido.enPreparacion:
      case EstadosPedido.pendientePago:
        return <AccessTime className="mr-1" fontSize="small" />;
      case EstadosPedido.enCamino:
        return <LocalShipping className="mr-1" fontSize="small" />;
      case EstadosPedido.entregado:
        return <CalendarMonth className="mr-1" fontSize="small" />;
      default:
        return null;
    }
  }, []);

  const actualizarEstadoPedidoFunc = useCallback(
    async (pedidoId: number, nuevoEstado: EstadosPedido) => {
      try {
        await actualizarEstadoPedido(pedidoId, nuevoEstado);

        if (
          nuevoEstado === EstadosPedido.enCamino ||
          nuevoEstado === EstadosPedido.pendientePago
        ) {
          const pedidosEnCursoActualizados = pedidosEnCurso.map((p) =>
            p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
          );
          actualizarPedidoEnStore({
            pedidosEnCurso: pedidosEnCursoActualizados,
            pedidosFinalizados,
          });
        } else if (nuevoEstado === EstadosPedido.entregado) {
          const pedidoAMover = pedidosEnCurso.find((p) => p.id === pedidoId);
          if (pedidoAMover) {
            const nuevoPedidoFinalizado = {
              ...pedidoAMover,
              estado: nuevoEstado,
            };
            actualizarPedidoEnStore({
              pedidosEnCurso: pedidosEnCurso.filter((p) => p.id !== pedidoId),
              pedidosFinalizados: [
                ...pedidosFinalizados,
                nuevoPedidoFinalizado,
              ],
            });
          }
          actualizarPedidoEnStore({
            pedidosEnCurso,
            pedidosFinalizados: pedidosFinalizados.map((p) =>
              p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
            ),
          });
        }
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
    [
      pedidosEnCurso,
      pedidosFinalizados,
      actualizarPedidoEnStore,
      actualizarEstadoPedido,
    ]
  );

  if (errorPedidos) {
    return (
      <Alert severity="error" className="my-6 rounded-lg">
        {errorPedidos}
      </Alert>
 );
  }

  if (loadingPedidos && !estadosCargados.has(estadoSeleccionado)) {
    return (
      <Box className="flex justify-center my-12">
        <CircularProgress sx={{ color: "#B99342" }} />
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        minHeight: 500,
        width: "50%",
        mx: "auto",
        p: 4,
        mt: 2,
      }}
    >
      <Stack
        display="flex"
        justifyContent={"center"}
        direction="row"
        spacing={2}
        className="mb-4 flex-wrap"
      >
        {Object.values(EstadosPedido).map((estado) => (
          <Button
            key={estado}
            variant={estadoSeleccionado === estado ? "contained" : "outlined"}
            onClick={() => handleEstadoClick(estado)}
            sx={{
              backgroundColor:
                estadoSeleccionado === estado ? "#B99342" : "transparent",
              borderColor: "#B99342",
              color: estadoSeleccionado === estado ? "white" : "#B99342",
              "&:hover": {
                backgroundColor:
                  estadoSeleccionado === estado
                    ? "#9A7835"
                    : "rgba(185, 147, 66, 0.08)",
              },
              mb: { xs: 1, sm: 0 },
            }}
          >
            {estado}
          </Button>
        ))}
      </Stack>

      {loadingPedidos && !estadosCargados.has(estadoSeleccionado) ? (
        <Box className="flex justify-center my-12">
          <CircularProgress sx={{ color: "#B99342" }} />
        </Box>
      ) : pedidosFiltrados.length === 0 ? (
        <Typography>No hay pedidos para este estado.</Typography>
      ) : (
        <>
          {pedidosPaginados.map((pedido) => (
            <PedidoItem
              key={pedido.id}
              pedido={pedido}
              isExpanded={expandedPedidos[pedido.id] || false}
              togglePedidoExpand={togglePedidoExpand}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              actualizarEstadoPedido={actualizarEstadoPedidoFunc}
            />
          ))}

          {pedidosFiltrados.length > pedidosPorPagina && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(pedidosFiltrados.length / pedidosPorPagina)}
                page={paginaActual}
                onChange={(e, page) => setPaginaActual(page)}
                size="large"
                sx={{
                  ".MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#B99342",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#9A7835",
                    },
                  },
                  ".MuiPaginationItem-root": {
                    color: "#B99342",
                    borderRadius: "16px",
                  },
                  ".MuiPagination-ul": {
                    backgroundColor: "white",
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default ListaPedidosPage;
