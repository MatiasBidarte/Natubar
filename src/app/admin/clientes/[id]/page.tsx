"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import usePedidos from "@/app/hooks/usePedidos";
import { Cliente, useClientes } from "@/app/hooks/useClientes";
import ClienteInfo from "./components/ClienteInfo";
import PedidosList from "./components/PedidosList";

const DetalleClientePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    fetchPedidosCliente,
    pedidosEnCurso,
    pedidosFinalizados,
    loadingPedidos,
    errorPedidos,
  } = usePedidos();
  const { obtenerClientePorId } = useClientes();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cargandoCliente, setCargandoCliente] = useState<boolean>(true);
  const [errorCliente, setErrorCliente] = useState<string | null>(null);

  const obtenerDatosCliente = useCallback(async () => {
    if (!id) return;

    setCargandoCliente(true);
    setErrorCliente(null);
    try {
      const clienteData = await obtenerClientePorId(id.toString());
      setCliente(clienteData);
    } catch (error) {
      setErrorCliente(
        error instanceof Error
          ? error.message
          : "Error al obtener datos del cliente"
      );
    } finally {
      setCargandoCliente(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    obtenerDatosCliente();
  }, [obtenerDatosCliente]);

  useEffect(() => {
    if (id) {
      fetchPedidosCliente(id as string);
    }
  }, [id, fetchPedidosCliente]);

  const handleVolver = () => {
    router.back();
  };

  const todosLosPedidos = [...pedidosEnCurso, ...pedidosFinalizados];

  const renderContent = () => {
    if (cargandoCliente || loadingPedidos) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: "#B99342" }} />
        </Box>
      );
    }

    if (errorCliente) {
      return (
        <Alert severity="error" sx={{ mt: 4 }}>
          {errorCliente}
        </Alert>
      );
    }

    if (errorPedidos) {
      return (
        <Alert severity="error" sx={{ mt: 4 }}>
          {errorPedidos}
        </Alert>
      );
    }

    if (!cliente) {
      return (
        <Alert severity="warning" sx={{ mt: 4 }}>
          No se encontró información del cliente
        </Alert>
      );
    }

    return (
      <>
        <ClienteInfo cliente={cliente} />
        <PedidosList pedidos={todosLosPedidos} />
      </>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, mt: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={handleVolver} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          Detalle de Cliente
        </Typography>
      </Box>
      {renderContent()}
    </Box>
  );
};

export default DetalleClientePage;
