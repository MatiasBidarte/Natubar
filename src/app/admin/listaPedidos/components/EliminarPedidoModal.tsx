import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Delete, Warning } from "@mui/icons-material";
import { useState } from "react";
import { Pedido } from "@/app/types/pedido";
import usePedidos from "@/app/hooks/usePedidos";

interface IEliminarPedidoModal {
  pedido: Pedido;
  open: boolean;
  onClose: () => void;
}

const EliminarPedidoModal = ({
  pedido,
  open,
  onClose,
}: IEliminarPedidoModal) => {
  const esEmpresa = pedido.cliente?.nombreEmpresa ? true : false;
  const { eliminarPedido } = usePedidos();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEliminar = async () => {
    try {
      setLoading(true);
      await eliminarPedido(pedido.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al eliminar el pedido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          pt: 4,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#ffebee",
            borderRadius: "50%",
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Warning sx={{ color: "#d32f2f", fontSize: 28 }} />
        </Box>
        Eliminar Pedido
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Alert severity="warning" icon={false} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              ¿Estás seguro de que deseas eliminar este pedido?
            </Typography>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="text.primary"
            >
              Esta acción no se puede deshacer.
            </Typography>
          </Alert>
        </Box>

        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "12px",
            p: 2.5,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Pedido de:
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold">
              {esEmpresa
                ? pedido.cliente?.nombreEmpresa
                : `${pedido.cliente?.nombre} ${pedido.cliente?.apellido}`}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "1rem",
            borderColor: "#bdbdbd",
            color: "#424242",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#9e9e9e",
            },
          }}
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleEliminar}
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <Delete />
            )
          }
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "1rem",
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
          }}
          disabled={loading}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EliminarPedidoModal;
