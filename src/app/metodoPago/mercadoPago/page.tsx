"use client";
import { useEffect, useState } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { Box } from "@mui/material";
import usePedidos from "@/app/hooks/usePedidos";

export default function PaymentBrick({ pedidoId }: { pedidoId: string }) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const { pedido } = usePedidos();
  useEffect(() => {
    if (pedidoId === "") return;
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "es-UY",
    });

    fetch(
      `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/pedidos/crear-preferencia`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
        },
        body: JSON.stringify({
          productos: pedido?.productos,
          pedidoId: pedidoId,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => setPreferenceId(data.preferenceId));
  }, [pedido, pedidoId]);

  const customization = {
    paymentMethods: {
      ticket: "all" as const,
      creditCard: "all" as const,
      prepaidCard: "all" as const,
      debitCard: "all" as const,
      mercadoPago: "all" as const,
    },
  };
  const initialization = {
    amount: 1000, // Monto total del pedido
    preferenceId: preferenceId ?? "",
  };

  if (!preferenceId) {
    return <Box textAlign="center">Cargando pago...</Box>;
  }

  const onSubmit = async (param1, param2) => {
    console.log(param1, param2);
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        px: { xs: 2, sm: 4 },
        boxSizing: "border-box",
      }}
    >
      <Box
        width="100%"
        maxWidth={400}
        bgcolor="background.paper"
        borderRadius={2}
        boxShadow={3}
        p={{ xs: 2, sm: 4 }}
      >
        <Box mb={2} textAlign="center">
          <strong>Total a pagar:</strong> ${initialization.amount}
        </Box>
        <Payment
          customization={customization}
          initialization={initialization}
          onSubmit={onSubmit}
          onReady={() => console.log("Listo")}
          onError={(err) => console.error(err)}
        />
      </Box>
    </Box>
  );
}
