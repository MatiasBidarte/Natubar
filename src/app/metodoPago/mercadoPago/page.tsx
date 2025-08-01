"use client";
import { useEffect, useState, Suspense } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { Box, Typography, CircularProgress } from "@mui/material";
import usePedidos from "@/app/hooks/usePedidos";
import { useSearchParams } from "next/navigation";
import { useUsuarioStore } from "@/app/hooks/useUsuarioStore";
import ArrowBack from "@/app/ui/arrowBack";

function PaymentContent() {
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get("pedidoId") || "";

  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { pedido, calcularCostoEnvio } = usePedidos();
  const { esEmpresa } = useUsuarioStore();

  useEffect(() => {
    if (!pedidoId) return;

    const productosParaPreferencia = pedido?.productos.map((item) => ({
      id: item.producto.id?.toString(),
      title: item.producto.nombre,
      quantity: item.cantidad,
      unit_price: esEmpresa
        ? item.producto.precioEmpresas
        : item.producto.precioPersonas,
    }));

    setLoading(true);
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "es-UY",
    });

    const envio = calcularCostoEnvio();

    fetch(
      `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/pedidos/crear-preferencia`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
        },
        body: JSON.stringify({
          productos: productosParaPreferencia,
          pedidoId,
          envio,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setPreferenceId(data.preferenceId);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching preference:", error);
        setLoading(false);
      });
  }, [pedido, pedidoId, esEmpresa, calcularCostoEnvio]);

  const customization = {
    paymentMethods: {
      mercadoPago: "all" as const,
    },
  };

  const initialization = {
    amount: pedido?.montoTotal || 1000,
    preferenceId: preferenceId ?? "",
  };

  if (loading || !preferenceId) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress sx={{ color: "#B99342" }} />
        <Typography mt={2}>Cargando pago...</Typography>
      </Box>
    );
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      sx={{
        px: { xs: 2, sm: 4 },
        boxSizing: "border-box",
      }}
    >
      <ArrowBack />
      <Box
        width="100%"
        maxWidth={400}
        bgcolor="background.paper"
        borderRadius={2}
        boxShadow={3}
        p={{ xs: 2, sm: 4 }}
      >
        <Box mb={2} textAlign="center">
          <Typography variant="h6">Total a pagar:</Typography>
          <Typography variant="h5" fontWeight="bold" color="#B99342">
            ${initialization.amount.toFixed(2)}
          </Typography>
        </Box>
        <Payment
          customization={customization}
          initialization={initialization}
          onSubmit={async () => {
            console.log("Pago enviado");
            return Promise.resolve();
          }}
          onReady={() => console.log("Pago listo")}
          onError={(err) => console.error("Error en pago:", err)}
        />
      </Box>
    </Box>
  );
}

export default function MercadoPagoPage() {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress sx={{ color: "#B99342" }} />
          <Typography mt={2}>Cargando página de pago...</Typography>
        </Box>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
