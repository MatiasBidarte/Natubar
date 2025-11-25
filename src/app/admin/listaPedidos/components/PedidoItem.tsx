"use client";
import { memo, JSX, useState } from "react";
import {
  DetallePedido,
  EstadosPagoPedido,
  EstadosPedido,
  Pedido,
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
import usePedidos from "@/app/hooks/usePedidos";
import { Sabor } from "@/app/types/producto";
import useNotificaciones from "@/app/hooks/useNotificaciones";
import EliminarPedidoModal from "./EliminarPedidoModal";

interface PedidoItemProps {
  pedido: Pedido;
  isExpanded: boolean;
  togglePedidoExpand: (id: number) => void;
  getStatusColor: (estado: EstadosPedido) => string;
  getStatusIcon: (estado: EstadosPedido) => JSX.Element | null;
}

const PedidoItem = memo(
  ({
    pedido,
    isExpanded,
    togglePedidoExpand,
    getStatusColor,
    getStatusIcon,
  }: PedidoItemProps) => {
    const primerProducto = pedido.productos?.[0] ?? null;
    const [loading, setLoading] = useState(false);
    const { cambiarEstadoPago, cambiarEstado } = usePedidos();
    const { recordarPago } = useNotificaciones();
    const [modalOpen, setModalOpen] = useState(false);

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

    const handleChangeState = async () => {
      const nextState = getNextState(pedido.estado);
      if (!nextState) return;

      setLoading(true);
      try {
        await cambiarEstado(nextState, pedido.id);
      } catch (error) {
        console.error("Error al actualizar el estado del pedido:", error);
      } finally {
        setLoading(false);
      }
    };

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

    const handleEliminarPedido = () => {
      setModalOpen(true);
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

    const pagarPedido = (pedidoId: number) => {
      cambiarEstadoPago(EstadosPagoPedido.pagado, pedidoId);
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
              Cliente:{" "}
              {pedido.cliente?.tipo === "Empresa"
                ? pedido.cliente.nombreEmpresa
                : `${pedido.cliente?.nombre} ${pedido.cliente?.apellido}`}
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
            {pedido.estadoPago == EstadosPagoPedido.pendiente &&
              pedido.ultimoRecordatorioPago && (
                <Typography variant="body2" className="text-gray-500">
                  Último recordatorio de pago:{" "}
                  {new Date(pedido.ultimoRecordatorioPago).toLocaleString(
                    "es-UY",
                    {
                      dateStyle: "short",
                      timeStyle: "short",
                    }
                  )}
                </Typography>
              )}
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
            {primerProducto?.urlImagen && primerProducto?.nombre && (
              <Box className="w-16 h-16 mr-4 rounded-lg overflow-hidden relative">
                <Image
                  src={primerProducto.urlImagen}
                  alt={primerProducto.nombre}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 100px, 100px"
                />
              </Box>
            )}
            <Box>
              <Typography variant="body1" className="font-medium">
                {primerProducto?.nombre ?? "Pedido"}
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
                    {item.cantidad}x {item.nombre}
                  </Typography>
                  <Typography>
                    $
                    {pedido.cliente?.tipo === "Persona"
                      ? (item.cantidad * item.precioPersonas).toFixed(2)
                      : (item.cantidad * item.precioEmpresas).toFixed(2)}
                  </Typography>
                </Box>
                {item.sabores && item.sabores?.length > 0 && (
                  <Box className="ml-4 mt-1">
                    <Typography variant="caption" className="text-gray-600">
                      Sabores:
                    </Typography>
                    <Box className="flex flex-wrap gap-1">
                      {item.sabores.map((sabor: Sabor, idx: number) => (
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

            <Divider className="my-3" />
            <Box className="flex justify-between">
              <Typography variant="subtitle1" className="font-bold">
                Total
              </Typography>
              <Typography variant="subtitle1" className="font-bold">
                ${pedido.montoTotal.toFixed(2)}
              </Typography>
            </Box>

            <Box className="mt-4 flex justify-between">
              <Box className="flex gap-2">
                {pedido.estadoPago == EstadosPagoPedido.pendiente && (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ margin: 1 }}
                      onClick={() => recordarPago(pedido.id)}
                    >
                      Recordar pago
                    </Button>

                    <Box>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ margin: 1 }}
                        onClick={() => pagarPedido(pedido.id)}
                      >
                        Marcar como pago
                      </Button>
                    </Box>
                  </>
                )}
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
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={handleEliminarPedido}
              >
                Eliminar pedido
              </Button>
            </Box>
          </Box>
        </Collapse>
        {modalOpen && (
          <EliminarPedidoModal
            pedido={pedido}
            open={modalOpen}
            onClose={() => setModalOpen(!modalOpen)}
          />
        )}
      </Paper>
    );
  }
);

PedidoItem.displayName = "PedidoItem";

export default PedidoItem;
