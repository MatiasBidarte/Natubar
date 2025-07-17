"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  useMediaQuery,
} from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import TransferenciaForm from "./transeferencia/page";
import theme from "../ui/theme";
import CheckoutStepper from "../ui/CheckoutStepper";
import usePedidos from "../hooks/usePedidos";
import { useRouter } from "next/navigation";
import MercadoPagoPage from "./mercadoPago/page";

export default function MetodoPago() {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { pedido } = usePedidos();
  const router = useRouter();
  const [metodo, setMetodo] = useState<"mp" | "transferencia" | null>(null);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<
    "mp" | "transferencia" | null
  >(null);

  const handlePagarAhora = async () => {
    const pedidoResponse = await fetch(
      `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/pedidos/crear-preferencia`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
        },
        body: JSON.stringify(pedido),
      }
    );
    if (!pedidoResponse.ok) {
      const errorData = await pedidoResponse.json();
      throw new Error(errorData.message || "Error al crear el pedido");
    }
    const pedidoBody = await pedidoResponse.json();
    setMetodo(metodoSeleccionado);

    if (metodoSeleccionado === "mp") {
      router.push(`/metodoPago/mercadoPago?pedidoId=${pedidoBody.id}`);
    }
  };

  return (
    <Box sx={{ width: "100%", mx: "auto", mt: 10 }}>
      <CheckoutStepper stepActivo={1} />
      {!metodo && (
        <Box
          mb={3}
          display={"flex"}
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              Seleccioná tu método de pago
            </Typography>
            <Stack spacing={2}>
              <FormControl>
                <RadioGroup
                  value={metodoSeleccionado}
                  onChange={(e) =>
                    setMetodoSeleccionado(
                      e.target.value as "mp" | "transferencia"
                    )
                  }
                >
                  <FormControlLabel
                    value="mp"
                    control={<Radio />}
                    label="Mercado Pago"
                    sx={{
                      p: 1.2,
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      borderRadius: 3,
                      margin: 1,
                      "&.Mui-checked": {
                        border: "2px solid black",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  />
                  <FormControlLabel
                    value="transferencia"
                    control={<Radio />}
                    label="Transferencia Bancaria"
                    sx={{
                      p: 1.2,
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      borderRadius: 3,
                      margin: 1,
                      "&.Mui-checked": {
                        border: "2px solid black",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  />
                </RadioGroup>
                <Box
                  sx={{
                    p: 1.2,
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: 3,
                    margin: 1,
                    "&.Mui-checked": {
                      border: "2px solid black",
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    <InfoOutlineIcon
                      sx={{ color: theme.palette.secondary.main }}
                    />
                    Serás redirigido a tu proveedor de pago seleccionado para
                    completar la transacción.
                  </Typography>
                </Box>
              </FormControl>
            </Stack>
          </Box>
          <Box width={isMobile ? "100%" : "40%"} alignSelf={"flex-end"}>
            <Button
              className="btn-portada"
              onClick={handlePagarAhora}
              sx={{ width: "100%" }}
              disabled={!metodoSeleccionado}
            >
              Pagar ahora
            </Button>
            <Button
              variant="outlined"
              sx={{ width: "100%", borderRadius: "20px", mt: 2 }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      )}

      {metodo === "mp" && (
        <Box mt={3}>
          <Typography variant="h6">Pago con Mercado Pago</Typography>
          <MercadoPagoPage />
        </Box>
      )}

      {metodo === "transferencia" && (
        <Box mt={3}>
          <Typography variant="h6">Datos para transferencia</Typography>
          <TransferenciaForm />
        </Box>
      )}

      {metodo && (
        <Box mt={2}>
          <Button onClick={() => setMetodo(null)}>← Elegir otro método</Button>
        </Box>
      )}
    </Box>
  );
}
