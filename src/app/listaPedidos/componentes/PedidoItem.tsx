"use client";
import { memo, JSX, useState } from "react";
import {
  DetallePedido,
  EstadosPagoPedido,
  EstadosPedido,
  Pedido,
  ProductoSabor,
} from "@/app/types/pedido";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckCircle,
  Schedule,
  Cancel,
} from "@mui/icons-material";
import Image from "next/image";
import { formatDateToLocalDate, formatDateToString } from "@/app/utils/date";

interface PedidoItemProps {
  pedido: Pedido;
  isExpanded: boolean;
  togglePedidoExpand: (id: number) => void;
  getStatusColor: (estado: EstadosPedido) => string;
  getStatusIcon: (estado: EstadosPedido) => JSX.Element | null;
  actualizarEstadoPedido: (
    pedidoId: number,
    nuevoEstado: EstadosPedido
  ) => Promise<void>;
}

const PedidoItem = memo(
  ({
    pedido,
    isExpanded,
    togglePedidoExpand,
    getStatusColor,
    getStatusIcon,
    actualizarEstadoPedido,
  }: PedidoItemProps) => {
    const primerProducto = pedido.productos?.[0] ?? null;
    const [loading, setLoading] = useState(false);

    // Determinar el siguiente estado en la secuencia
    const getNextState = (
      currentState: EstadosPedido
    ): EstadosPedido | null => {
      switch (currentState) {
        case EstadosPedido.enPreparacion:
          return EstadosPedido.enCamino;
        case EstadosPedido.enCamino:
          return EstadosPedido.entregado;
        case EstadosPedido.entregado:
          return null;
        default:
          return null;
      }
    };

    // Manejar el cambio de estado
    const handleChangeState = async () => {
      const nextState = getNextState(pedido.estado);
      if (!nextState) return; // No hay siguiente estado

      setLoading(true);
      try {
        await actualizarEstadoPedido(pedido.id, nextState);
      } catch (error) {
        console.error("Error al actualizar el estado del pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    // Obtener texto para el botón según el estado actual
    const getButtonText = (): string => {
      switch (pedido.estado) {
        case EstadosPedido.pendientePago:
          return "Marcar como En Preparación";
        case EstadosPedido.enPreparacion:
          return "Marcar como En Camino";
        case EstadosPedido.enCamino:
          return "Marcar como Entregado";
        default:
          return "";
      }
    };

    const getPaymentStatusColor = (estadoPago: EstadosPagoPedido): string => {
      switch (estadoPago) {
        case EstadosPagoPedido.pagado:
          return "bg-green-500 text-white";
        case EstadosPagoPedido.pendiente:
          return "bg-yellow-500 text-[#201B21]";
        case EstadosPagoPedido.rechazado:
          return "bg-red-500 text-white";
        default:
          return "bg-gray-400 text-white";
      }
    };

    const getPaymentStatusIcon = (
      estadoPago: EstadosPagoPedido
    ): JSX.Element | null => {
      switch (estadoPago) {
        case EstadosPagoPedido.pagado:
          return <CheckCircle className="mr-1" fontSize="small" />;
        case EstadosPagoPedido.pendiente:
          return <Schedule className="mr-1" fontSize="small" />;
        case EstadosPagoPedido.rechazado:
          return <Cancel className="mr-1" fontSize="small" />;
        default:
          return null;
      }
    };

    return (
      <Paper
        key={pedido.id}
        elevation={1}
        className="mb-5 rounded-xl overflow-hidden"
      >
        <Box className="flex justify-between items-center p-4 bg-[#FFF9ED]">
          <Box>
            <Typography variant="subtitle1" className="font-bold">
              Cliente: {pedido.cliente?.nombre} {pedido.cliente?.apellido}
            </Typography>
            <Typography variant="subtitle1" className="font-bold">
              Pedido del {formatDateToString(pedido.fechaCreacion)}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {pedido.fechaEntrega
                ? `Entregado el: ${formatDateToLocalDate(pedido.fechaEntrega)}`
                : `Entrega estimada: ${formatDateToLocalDate(
                    pedido.fechaEntregaEstimada
                  )}`}
            </Typography>
          </Box>
          <Box className="flex flex-col gap-2">
            <span
              className={`px-3 py-1 rounded-full flex items-center ${getStatusColor(
                pedido.estado
              )}`}
            >
              {getStatusIcon(pedido.estado)}
              {pedido.estado}
            </span>

            <span
              className={`px-3 py-1 rounded-full flex items-center ${getPaymentStatusColor(
                pedido.estadoPago
              )}`}
            >
              {getPaymentStatusIcon(pedido.estadoPago)}
              {pedido.estadoPago}
            </span>
          </Box>
        </Box>

        <Box
          className="p-4 bg-white flex justify-between cursor-pointer"
          onClick={() => togglePedidoExpand(pedido.id)}
        >
          <Box className="flex items-center">
            {primerProducto?.producto.urlImagen &&
              primerProducto?.producto.nombre && (
                <Box className="w-16 h-16 mr-4 rounded-lg overflow-hidden relative">
                  <Image
                    src={primerProducto.producto.urlImagen}
                    alt={primerProducto.producto.nombre}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100px, 100px"
                  />
                </Box>
              )}
            <Box>
              <Typography variant="body1" className="font-medium">
                {primerProducto?.producto.nombre ?? "Pedido"}
              </Typography>
              {pedido.productos && pedido.productos?.length > 1 && (
                <Typography variant="body2" className="text-gray-500">
                  + {pedido.productos.length - 1} productos más
                </Typography>
              )}
            </Box>
          </Box>
          <Box className="flex flex-col items-start">
            <Box className="flex items-center justify-between w-full mb-2">
              <Typography variant="subtitle1" className="font-bold">
                ${pedido.montoTotal.toFixed(2)}
              </Typography>
              <IconButton size="small">
                {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Collapse in={isExpanded}>
          <Box className="p-4 pt-0 bg-white border-t border-gray-100">
            {pedido.productos?.map((item: DetallePedido, index: number) => (
              <Box
                key={index}
                className="py-3 border-b border-gray-100 last:border-b-0"
              >
                <Box className="flex justify-between">
                  <Typography className="font-medium">
                    {item.cantidad}x {item.producto.nombre}
                  </Typography>
                  <Typography>
                    $
                    {pedido.cliente?.tipo === "Persona"
                      ? (item.cantidad * item.producto.precioPersonas).toFixed(
                          2
                        )
                      : (item.cantidad * item.producto.precioEmpresas).toFixed(
                          2
                        )}
                  </Typography>
                </Box>
                {item.productoSabores && item.productoSabores?.length > 0 && (
                  <Box className="ml-4 mt-1">
                    <Typography variant="caption" className="text-gray-600">
                      Sabores:
                    </Typography>
                    <Box className="flex flex-wrap gap-1">
                      {item.productoSabores.map(
                        (sabor: ProductoSabor, idx: number) => (
                          <Typography
                            key={idx}
                            variant="caption"
                            className="bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                          >
                            {sabor.sabor.nombre} x{sabor.cantidad}
                          </Typography>
                        )
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            ))}

            <Divider className="my-3" />
            <Box className="flex justify-between">
              <Typography variant="subtitle1" className="font-bold">
                Total
              </Typography>
              <Typography variant="subtitle1" className="font-bold">
                ${pedido.montoTotal.toFixed(2)}
              </Typography>
            </Box>

            <Box className="mt-4 flex flex-wrap gap-2">
              {pedido.estado == EstadosPedido.pendientePago && (
                <>
                  <Button variant="outlined" size="small" sx={{ margin: 1 }}>
                    Recordar pago
                  </Button>
                  <Button variant="outlined" size="small" sx={{ margin: 1 }}>
                    Finalizar pedido
                  </Button>
                </>
              )}

              {/* Nuevo botón para cambiar estado - solo visible si hay un siguiente estado */}
              {getNextState(pedido.estado) && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={loading}
                  onClick={handleChangeState}
                  sx={{
                    backgroundColor: "#B99342",
                    "&:hover": { backgroundColor: "#9A7835" },
                    margin: 1,
                  }}
                >
                  {loading ? "Actualizando..." : getButtonText()}
                </Button>
              )}
            </Box>
          </Box>
        </Collapse>
      </Paper>
    );
  }
);

PedidoItem.displayName = "PedidoItem";

export default PedidoItem;
