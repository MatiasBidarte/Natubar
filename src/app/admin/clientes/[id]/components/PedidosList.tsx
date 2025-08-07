"use client";
import { Pedido, EstadosPedido, EstadosPagoPedido } from "@/app/types/pedido";
import {
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { formatDateToString } from "@/app/utils/date";

interface PedidosListProps {
  pedidos: Pedido[];
}

const PedidosList: React.FC<PedidosListProps> = ({ pedidos }) => {
  const pedidosOrdenados = [...pedidos].sort(
    (a, b) =>
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
  );

  const getStatusColor = (estado: EstadosPedido) => {
    switch (estado) {
      case EstadosPedido.enPreparacion:
        return "warning";
      case EstadosPedido.pendientePago:
        return "default";
      case EstadosPedido.enCamino:
        return "info";
      case EstadosPedido.entregado:
        return "success";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (estado: EstadosPagoPedido) => {
    switch (estado) {
      case EstadosPagoPedido.pagado:
        return "success";
      case EstadosPagoPedido.pendiente:
        return "warning";
      case EstadosPagoPedido.rechazado:
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: "#FFF9ED",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight="medium">
          Historial de Pedidos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {pedidos.length} pedidos
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {pedidosOrdenados.length === 0 ? (
        <Typography align="center" py={4} color="text.secondary">
          Este cliente aún no ha realizado pedidos
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Pago</TableCell>
                <TableCell>Productos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidosOrdenados.map((pedido) => (
                <TableRow
                  key={pedido.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(185, 147, 66, 0.08)",
                    },
                  }}
                  onClick={() =>
                    console.log(`Pedido seleccionado: ${pedido.id}`)
                  }
                >
                  <TableCell>{pedido.id}</TableCell>
                  <TableCell>
                    {formatDateToString(pedido.fechaCreacion)}
                  </TableCell>
                  <TableCell>${pedido.montoTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={pedido.estado}
                      color={getStatusColor(pedido.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pedido.estadoPago}
                      color={getPaymentStatusColor(pedido.estadoPago)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{pedido.productos?.length || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default PedidosList;
