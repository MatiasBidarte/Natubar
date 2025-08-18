"use client";
import { usePedidos } from "@/app/hooks/usePedidos";
import { DetallePedido, EstadosPedido } from "@/app/types/pedido";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
  useTheme,
  Button,
} from "@mui/material";
import {
  AccessTime,
  LocalShipping,
  CalendarMonth,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { formatDateToLocalDate, formatDateToString } from "@/app/utils/date";
import { Cliente } from "@/app/hooks/useClientes";
import { mapDetallePedidoToLineaCarrito } from "@/app/types/lineaCarrito";

import { useRouter } from "next/navigation";
const ComprasCliente = () => {
  const router = useRouter();
  const {
    pedidosEnCurso,
    pedidosFinalizados,
    fetchPedidosCliente,
    repetirPedido,
    loadingPedidos,
    errorPedidos,
  } = usePedidos();
  const theme = useTheme();

  const [tabValue, setTabValue] = useState(0);
  const [usuario, setUsuario] = useState<Cliente>();
  const [expandedPedidos, setExpandedPedidos] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const usuarioData = localStorage.getItem("usuario");
        if (usuarioData) {
          const usuario = JSON.parse(usuarioData);
          setUsuario(usuario);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      fetchPedidosCliente(usuario.id!);
    }
  }, [usuario, fetchPedidosCliente]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (estado: EstadosPedido) => {
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
  };

  const getStatusIcon = (estado: EstadosPedido) => {
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
  };

  const togglePedidoExpand = (id: number) => {
    setExpandedPedidos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRepetirPedido = (productos: DetallePedido[]) => {
    repetirPedido(mapDetallePedidoToLineaCarrito(productos ?? []))
    router.push("/carrito");
  }
  const renderPedidos = () => {
    const pedidosActuales =
      tabValue === 0 ? pedidosEnCurso : pedidosFinalizados;

    if (loadingPedidos) {
      return (
        <Box className="flex justify-center my-12">
          <CircularProgress sx={{ color: "#B99342" }} />
        </Box>
      );
    }

    if (errorPedidos) {
      return (
        <Alert severity="error" className="my-6 rounded-lg">
          {errorPedidos}
        </Alert>
      );
    }

    if (pedidosActuales.length === 0) {
      return (
        <Paper
          elevation={0}
          className="p-8 rounded-xl bg-[#FFF9ED] text-center"
        >
          <Typography className="text-gray-500 mb-2">
            No tienes pedidos {tabValue === 0 ? "en curso" : "finalizados"}.
          </Typography>
          <Typography className="text-sm text-gray-400">
            Tus pedidos aparecerán aquí cuando realices una compra.
          </Typography>
        </Paper>
      );
    }

    return pedidosActuales.map((pedido) => {
      const primerProducto =
        pedido.productos && pedido.productos.length > 0
          ? pedido.productos[0]
          : null;

      const isExpanded = expandedPedidos[pedido.id] || false;

      return (
        <Paper
          key={pedido.id}
          elevation={1}
          className="mb-5 rounded-xl overflow-hidden"
        >
          <Box className="flex justify-between items-center p-4 bg-[#FFF9ED]">
            <Box>
              <Typography
                variant="subtitle1"
                className="font-bold text-[#201B21] !text-sm md:!text-base"
              >
                Pedido del {formatDateToString(pedido.fechaCreacion)}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {tabValue === 0
                  ? `Entrega estimada: ${formatDateToLocalDate(
                    pedido.fechaEntregaEstimada
                  )}`
                  : pedido.fechaEntrega
                    ? `Entregado el: ${formatDateToLocalDate(
                      pedido.fechaEntrega
                    )}`
                    : `Entrega estimada: ${formatDateToLocalDate(
                      pedido.fechaEntregaEstimada
                    )}`}
              </Typography>
            </Box>
            <Box>
              <span
                className={`px-3 text-xs md:text-base py-1 rounded-full flex items-center ${getStatusColor(
                  pedido.estado
                )}`}
              >
                {getStatusIcon(pedido.estado)}
                {pedido.estado}
              </span>
            </Box>
          </Box>

          <Box
            className="p-4 bg-white flex items-center justify-between cursor-pointer"
            onClick={() => togglePedidoExpand(pedido.id)}
          >
            <Box className="flex items-center">
              {primerProducto?.urlImagen && primerProducto?.nombre && (
                <Box className="w-16 h-16 mr-4 rounded-lg overflow-hidden relative">
                  <Image
                    src={primerProducto.urlImagen}
                    alt={primerProducto.nombre}
                    fill
                    className="object-cover"
                  />
                </Box>
              )}
              <Box>
                <Typography variant="body1" className="font-medium">
                  {primerProducto ? primerProducto.nombre : "Pedido"}
                </Typography>
                {primerProducto &&
                  pedido.productos &&
                  pedido.productos.length > 1 && (
                    <Typography variant="body2" className="text-gray-500">
                      + {pedido.productos.length - 1} productos más
                    </Typography>
                  )}
              </Box>
            </Box>

            <Box className="flex items-center">
              <Typography variant="subtitle1" className="font-bold mr-3">
                ${pedido.montoTotal.toFixed(2)}
              </Typography>
              <IconButton size="small">
                {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={isExpanded}>
            <Box className="p-4 pt-0 bg-white border-t border-gray-100">
              <Typography
                variant="body1"
                className="font-medium text-[#201B21]"
              >
                Detalle completo
              </Typography>

              <Box className="space-y-3 mb-4">
                {pedido.productos &&
                  pedido.productos.map((item, index) => (
                    <Box
                      key={index}
                      className="py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <Box className="flex justify-between items-start mb-2">
                        <Typography
                          variant="body2"
                          className="font-medium text-gray-800"
                        >
                          {item.cantidad}x {item.nombre}
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          $
                          {usuario?.tipo === "Persona"
                            ? (item.cantidad * item.precioPersonas).toFixed(2)
                            : (item.cantidad * item.precioEmpresas).toFixed(2)}
                        </Typography>
                      </Box>

                      {item.sabores && item.sabores.length > 0 && (
                        <Box className="ml-4 mt-1">
                          <Typography
                            variant="caption"
                            className="text-gray-600 mb-1 block"
                          >
                            Sabores:
                          </Typography>
                          <Box className="flex flex-wrap gap-1">
                            {item.sabores.map((sabor, idx) => (
                              <Typography
                                key={idx}
                                variant="caption"
                                className="bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                              >
                                {sabor.nombre} x{sabor.cantidad}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ))}
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Button
                  onClick={() => handleRepetirPedido(pedido.productos || [])}
                  variant="contained"
                  color="primary"
                  sx={{
                    bgcolor: "#B99342",
                    "&:hover": { bgcolor: "#8E6C1F" },
                  }}>
                  Repetir pedido
                </Button>
                {pedido.fechaEntrega && (
                  <Box className="mb-3 flex items-center text-gray-600">
                    <CalendarMonth fontSize="small" className="mr-2" />
                    <Typography variant="body2">
                      Entregado el: {formatDateToLocalDate(pedido.fechaEntrega)}
                    </Typography>

                  </Box>
                )}
              </Box>


              <Divider className="my-3" />
              <Box className="flex justify-between items-center">
                <Typography variant="subtitle1" className="font-bold">
                  Total
                </Typography>
                <Typography variant="subtitle1" className="font-bold">
                  ${pedido.montoTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </Paper>
      );
    });
  };

  return (
    <Box className="w-full max-w-4xl mx-auto p-4">
      <Box className="rounded-t-xl p-2 mt-12">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            "& .MuiTab-root": {
              color: theme.palette.text.primary,
              fontWeight: 500,
              "&.Mui-selected": {
                color: theme.palette.secondary.main,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
          className="mb-2"
        >
          <Tab label="En Curso" />
          <Tab label="Finalizados" />
        </Tabs>
      </Box>

      <Box className="mt-4">{renderPedidos()}</Box>
    </Box>
  );
};

export default ComprasCliente;
