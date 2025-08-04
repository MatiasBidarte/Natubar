"use client";
import { useMemo, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
} from "@mui/material";
import { formatDateToString } from "../../../utils/date";
import { EstadosPedido, Pedido } from "../../../types/pedido";
import type { ChipProps } from "@mui/material";

interface OrdersTableProps {
  pedidos: Pedido[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ pedidos }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (estado: EstadosPedido): ChipProps["color"] => {
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

  const paginatedPedidos = useMemo(() => {
    return pedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [pedidos, page, rowsPerPage]);

  if (!pedidos || pedidos.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: "#FFF9ED",
        }}
      >
        <Typography variant="h6" fontWeight="medium" mb={2}>
          Listado de Pedidos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No hay pedidos para el período seleccionado
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "#FFF9ED",
      }}
    >
      <Typography variant="h6" fontWeight="medium" mb={2}>
        Listado de Pedidos
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Productos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>
                  {formatDateToString(pedido.fechaCreacion)}
                </TableCell>
                <TableCell>
                  {pedido.cliente
                    ? `${pedido.cliente.nombre || ""} ${
                        pedido.cliente.apellido || ""
                      }`.trim() || pedido.cliente.email
                    : "N/A"}
                </TableCell>
                <TableCell>${pedido.montoTotal.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={pedido.estado}
                    color={getStatusColor(pedido.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{pedido.productos?.length || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={pedidos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        labelRowsPerPage="Filas por página:"
      />
    </Paper>
  );
};

export default OrdersTable;
