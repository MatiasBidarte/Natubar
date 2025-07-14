"use client";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack,
  Paper,
  Snackbar,
  Container,
  Alert,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { usePedidos } from "../hooks/usePedidos";
import { useState } from "react";
import { homemadeApple } from "../ui/fonts";
import Link from "next/link";
import { useUsuarioStore } from "../hooks/useUsuarioStore";

const Carrito = () => {
  const { items } = usePedidos();
  const [apiError, setApiError] = useState<string | null>(null);
  const { usuario = null, esEmpresa = false } = useUsuarioStore();

  const updateCantidad = usePedidos((state) => state.updateCantidad);
  const handleCantidadChange = (numeral: number, delta: number) => {
    updateCantidad(numeral, delta);
  };

  const removeFromCart = usePedidos((state) => state.removeFromCart);
  const eliminarItem = (numeral: number) => {
    removeFromCart(numeral);
  };

  const calcularSubtotal = () => {
    if (typeof usuario === "undefined" || typeof esEmpresa === "undefined") {
      return items.reduce(
        (acc, item) => acc + item.producto.precioPersonas * item.cantidad,
        0
      );
    } else {
      return items.reduce(
        (acc, item) =>
          acc +
          (usuario
            ? esEmpresa
              ? item.producto.precioEmpresas
              : item.producto.precioPersonas
            : item.producto.precioPersonas) *
            item.cantidad,
        0
      );
    }
  };

  const envio = process.env.NEXT_PUBLIC_VALOR_ENVIO;
  const costoParaEnvio = Number(
    process.env.NEXT_PUBLIC_VALOR_MINIMO_PARA_ENVIO
  );
  const costoCompraMinimoEmpresas = Number(
    process.env.NEXT_PUBLIC_COSTO_COMPRA_MINIMO_EMPRESAS
  );

  const subtotal = calcularSubtotal();
  const envioGratis = esEmpresa || subtotal >= costoParaEnvio;
  const total = subtotal + (envioGratis ? 0 : Number(envio));

  const empresaPuedeComprar = esEmpresa && total >= costoCompraMinimoEmpresas;

  const getMensajeCompra = () => {
    if (!usuario) {
      return "Inicia sesión para continuar con la compra";
    }
    if (esEmpresa && !empresaPuedeComprar) {
      return `El monto mínimo de compra para empresas es de $${costoCompraMinimoEmpresas}`;
    }
    return null;
  };

  const mensajeCompra = getMensajeCompra();
  const botonDeshabilitado = !usuario || (esEmpresa && !empresaPuedeComprar);

  if (items.length === 0) {
    return (
      <Container className="p-8 w-full max-w-md">
        <Typography
          variant="h6"
          p-top={16}
          mb={4}
          textAlign="center"
          className={homemadeApple.className}
        >
          Carrito de Compras
        </Typography>

        <Paper
          elevation={0}
          className="p-8 rounded-xl bg-[#FFF9ED] text-center"
        >
          <Typography variant="h6" className="mb-4">
            Tu carrito está vacío
          </Typography>
          <Typography className="text-gray-500 mb-6">
            Parece que aún no has agregado productos a tu carrito.
          </Typography>
          <Button
            component={Link}
            href="/"
            variant="contained"
            sx={{
              bgcolor: "#b78b36",
              "&:hover": { bgcolor: "#a8772f" },
              borderRadius: "24px",
              px: 4,
            }}
          >
            Ver productos
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <div className="flex bg-white px-4 p-14 w-full">
      {apiError && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!apiError}
          message={apiError}
          autoHideDuration={6000}
          onClose={() => setApiError(null)}
        />
      )}
      <Container className="p-8 w-full max-w-md">
        <Typography
          variant="h6"
          p-top={16}
          mb={2}
          textAlign="center"
          className={homemadeApple.className}
        >
          Carrito de Compras
        </Typography>

        <Stack spacing={2}>
          {items.map((item) => (
            <Paper
              key={item.numeral}
              elevation={1}
              sx={{ p: 2, borderRadius: 2, display: "flex", gap: 2 }}
            >
              <Box
                component="img"
                src={item.producto.urlImagen ?? "/placeholder.png"}
                width={80}
                height={80}
                sx={{ borderRadius: 1, objectFit: "cover" }}
                alt={item.producto.nombre}
              />
              <Box flex={1}>
                <Typography fontWeight="bold">
                  {item.producto.nombre}{" "}
                  {item.producto.esCajaDeBarras &&
                    `x${item.producto.cantidadDeBarras}`}{" "}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {item.producto.esCajaDeBarras &&
                    item.sabores
                      .map((s) => s.sabor.nombre + " (" + s.cantidad + ")")
                      .join(", ")}
                </Typography>
                <Box mt={1} display="flex" alignItems="center" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      item.cantidad > 1 &&
                      handleCantidadChange(item.numeral ?? 1, item.cantidad - 1)
                    }
                  >
                    -
                  </Button>
                  <Typography>{item.cantidad}</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      handleCantidadChange(item.numeral ?? 1, item.cantidad + 1)
                    }
                  >
                    +
                  </Button>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="flex-end">
                <IconButton onClick={() => eliminarItem(item.numeral ?? 1)}>
                  <DeleteOutlineIcon />
                </IconButton>
                <Typography variant="body2">
                  $
                  {usuario
                    ? esEmpresa
                      ? item.producto.precioEmpresas
                      : item.producto.precioPersonas
                    : item.producto.precioPersonas}{" "}
                  c/u
                </Typography>
                <Typography fontWeight="bold">
                  $
                  {(usuario
                    ? esEmpresa
                      ? item.producto.precioEmpresas
                      : item.producto.precioPersonas
                    : item.producto.precioPersonas) * item.cantidad}
                </Typography>
              </Box>
            </Paper>
          ))}

          <Box p={2} bgcolor="white" borderRadius={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Subtotal</Typography>
              <Typography>${calcularSubtotal()}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Envío</Typography>
              <Typography color={envioGratis ? "green" : "inherit"}>
                {envioGratis ? "Gratis" : `$${envio}`}
                {!envioGratis && !esEmpresa && (
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                    align="right"
                  >
                    Envío gratis a partir de ${costoParaEnvio}
                  </Typography>
                )}
              </Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight="bold">Total</Typography>
              <Typography fontWeight="bold">${total.toFixed(2)}</Typography>
            </Stack>
          </Box>

          {esEmpresa && !empresaPuedeComprar && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              El monto mínimo de compra para empresas es de $
              {costoCompraMinimoEmpresas}
            </Alert>
          )}

          <Tooltip
            title={mensajeCompra || ""}
            placement="top"
            arrow
            open={!!mensajeCompra}
          >
            <span>
              <Button
                variant="contained"
                fullWidth
                component={Link}
                href={
                  usuario == null ? "/login?redirect=carrito" : "/resumenCompra"
                }
                disabled={botonDeshabilitado}
                sx={{
                  bgcolor: "#b78b36",
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  fontSize: "16px",
                  "&:hover": {
                    bgcolor: "#a8772f",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#e0e0e0",
                    color: "rgba(0, 0, 0, 0.38)",
                  },
                }}
              >
                Comprar ahora
              </Button>
            </span>
          </Tooltip>
          <Button
            variant="outlined"
            fullWidth
            component={Link}
            sx={{
              borderColor: "#b78b36",
              color: "#b78b36",
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
            }}
            href="/"
          >
            Seguir comprando
          </Button>
        </Stack>
      </Container>
    </div>
  );
};

export default Carrito;
