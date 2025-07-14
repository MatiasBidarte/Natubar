"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { usePedidos } from "../hooks/usePedidos";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { useRouter } from "next/navigation";
import CheckoutStepper from "../ui/CheckoutStepper";
import { LineaCarrito } from "../types/lineaCarrito";

const ResumenCompraPage = () => {
  const { items, crearPedidoEnStore } = usePedidos();
  const { usuario, estaLogueado, esEmpresa } = useUsuarioStore();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [observaciones, setObservaciones] = useState("");

  // Función para cargar productos de prueba
  const addTestProducts = () => {
    // Limpiar el carrito actual
    const clearCart = usePedidos.getState().clearCart;
    clearCart();

    // Productos de prueba
    const testProducts: LineaCarrito[] = [
      {
        numeral: 1,
        producto: {
          id: 1,
          nombre: "Caja de Barras Mixta",
          descripcion: "Selección de nuestras mejores barras de cereal",
          precioPersonas: 450,
          precioEmpresas: 410,
          peso: 500,
          stock: true,
          urlImagen:
            "https://res.cloudinary.com/dpozwwyuy/image/upload/v1749679888/barras_surtidas_nrrzmw.jpg",
          esCajaDeBarras: true,
          cantidadDeBarras: 12,
        },
        cantidad: 1,
        sabores: [
          {
            sabor: { id: 1, nombre: "Chocolate" },
            cantidad: 4,
          },
          {
            sabor: { id: 2, nombre: "Mani" },
            cantidad: 4,
          },
          {
            sabor: { id: 3, nombre: "Nueces" },
            cantidad: 4,
          },
        ],
      },
      {
        numeral: 2,
        producto: {
          id: 2,
          nombre: "Barra Proteica Premium",
          descripcion:
            "Alta en proteínas, ideal para después del entrenamiento",
          precioPersonas: 180,
          precioEmpresas: 165,
          peso: 70,
          stock: true,
          urlImagen:
            "https://res.cloudinary.com/dpozwwyuy/image/upload/v1749679888/barras_surtidas_nrrzmw.jpg",
          esCajaDeBarras: false,
        },
        cantidad: 3,
        sabores: [],
      },
      {
        numeral: 3,
        producto: {
          id: 3,
          nombre: "Mix Energético",
          descripcion: "Combinación de frutos secos y semillas",
          precioPersonas: 250,
          precioEmpresas: 230,
          peso: 200,
          stock: true,
          urlImagen:
            "https://res.cloudinary.com/dpozwwyuy/image/upload/v1749679888/barras_surtidas_nrrzmw.jpg",
          esCajaDeBarras: false,
        },
        cantidad: 2,
        sabores: [],
      },
    ];

    const addToCart = usePedidos.getState().addToCart;
    testProducts.forEach((product) => {
      addToCart(product);
    });
  };

  useEffect(() => {
    if (items.length === 0) {
      addTestProducts();
    }
  }, []);

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

  const subtotal = calcularSubtotal();
  const envio = process.env.NEXT_PUBLIC_VALOR_ENVIO;
  const costoParaEnvio = Number(
    process.env.NEXT_PUBLIC_VALOR_MINIMO_PARA_ENVIO
  );
  const costoCompraMinimoEmpresas = Number(
    process.env.NEXT_PUBLIC_COSTO_COMPRA_MINIMO_EMPRESAS
  );

  const envioGratis = esEmpresa || subtotal >= costoParaEnvio;
  const total = subtotal + (envioGratis ? 0 : Number(envio));

  const empresaPuedeComprar = esEmpresa && total >= costoCompraMinimoEmpresas;

  const handleCheckout = async () => {
    if (!estaLogueado) {
      router.push("/login?redirect=resumenCompra");
      return;
    }

    try {
      setProcesando(true);
      setError(null);
      crearPedidoEnStore(observaciones, total, usuario?.id || "");
      router.push("/metodoPago");
    } catch (err) {
      setError(typeof err === "string" ? err : "Error al procesar el pedido");
    } finally {
      setProcesando(false);
    }
  };

  if (items.length === 0) {
    return (
      <Box className="w-full max-w-4xl mx-auto p-4 pt-24 md:pt-32">
        <Paper
          elevation={0}
          className="p-8 rounded-xl bg-[#FFF9ED] text-center"
        >
          <ShoppingBag sx={{ fontSize: 60, color: "#B99342", mb: 2 }} />
          <Typography variant="h5" className="mb-4 font-medium">
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
              bgcolor: "#B99342",
              "&:hover": { bgcolor: "#8B7031" },
              borderRadius: "24px",
              px: 4,
            }}
          >
            Ver productos
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="w-full max-w-7xl mx-auto p-4 pt-24 md:pt-32">
      <CheckoutStepper stepActivo={0} />
      <Typography
        variant={isMobile ? "h6" : "h5"}
        className="font-semibold text-[#201B21] mb-6"
      >
        Resumen de compra
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4 rounded-lg">
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Paper
            elevation={0}
            className="p-4 md:p-6 rounded-xl bg-[#FFF9ED] mb-4"
          >
            {isMobile ? (
              items.map((item, index) => (
                <Box
                  key={index}
                  className="flex gap-3 py-4 border-b border-gray-200 last:border-b-0"
                >
                  <Box className="relative h-[70px] w-[70px] rounded-lg overflow-hidden flex-shrink-0">
                    {item.producto.urlImagen && (
                      <Image
                        src={item.producto.urlImagen}
                        alt={item.producto.nombre || ""}
                        fill
                        className="object-cover"
                      />
                    )}
                  </Box>
                  <Box className="flex-grow flex flex-col justify-center">
                    <Box className="flex justify-between">
                      <Typography variant="subtitle2" fontWeight={500}>
                        {item.producto.nombre}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={600}>
                        $
                        {(
                          (esEmpresa
                            ? item.producto.precioEmpresas!
                            : item.producto.precioPersonas!) * item.cantidad
                        ).toFixed(2)}
                      </Typography>
                    </Box>

                    {item.producto.esCajaDeBarras &&
                      item.sabores &&
                      item.sabores.length > 0 && (
                        <Box mt={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            Sabores:{" "}
                            {item.sabores
                              .map((s) => `${s.sabor.nombre} (${s.cantidad})`)
                              .join(", ")}
                          </Typography>
                        </Box>
                      )}
                  </Box>
                </Box>
              ))
            ) : (
              <>
                {items.map((item, index) => (
                  <Box
                    key={index}
                    className="py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <Box className="flex justify-between gap-4 items-center">
                      <Box className="flex items-center gap-3">
                        <Box className="relative h-[80px] w-[80px] rounded-lg overflow-hidden">
                          {item.producto.urlImagen && (
                            <Image
                              src={item.producto.urlImagen}
                              alt={item.producto.nombre || ""}
                              fill
                              className="object-cover"
                            />
                          )}
                        </Box>
                        <Box>
                          <Typography variant="body1" className="font-medium">
                            {item.producto.nombre} x{item.cantidad}
                          </Typography>

                          {item.producto.esCajaDeBarras &&
                            item.sabores &&
                            item.sabores.length > 0 && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                Sabores:{" "}
                                {item.sabores.map((s, idx) => (
                                  <span key={idx}>
                                    {s.sabor.nombre} ({s.cantidad})
                                    {idx < item.sabores.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </Typography>
                            )}
                        </Box>
                      </Box>

                      <Box className="flex items-center gap-2">
                        <Typography variant="body2" className="font-medium">
                          $
                          {(
                            (esEmpresa
                              ? item.producto.precioEmpresas!
                              : item.producto.precioPersonas!) * item.cantidad
                          ).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </Paper>

          <Paper
            elevation={0}
            className="p-4 md:p-6 rounded-xl bg-[#FFF9ED] mb-4"
          >
            <Typography variant="subtitle1" fontWeight={600} className="mb-3">
              Dirección de envío
            </Typography>
            {estaLogueado && usuario ? (
              <Box>
                <Typography variant="body2">
                  {`${usuario.direccion || "Malvín"}, ${
                    usuario.ciudad || "Montevideo"
                  }, ${usuario.departamento || "11400"}`}
                </Typography>
              </Box>
            ) : (
              <Typography color="text.secondary" variant="body2">
                Inicia sesión para completar tu dirección de envío
              </Typography>
            )}
          </Paper>

          <Paper
            elevation={0}
            className="p-4 md:p-6 rounded-xl bg-[#FFF9ED] mb-4"
          >
            <Typography variant="subtitle1" fontWeight={600} className="mb-3">
              Observaciones
            </Typography>
            <TextField
              multiline
              rows={3}
              placeholder="Por ejemplo: Solo puedo recibir a la mañana."
              fullWidth
              variant="outlined"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.12)",
                  },
                },
              }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Paper
            elevation={0}
            className="p-4 md:p-6 rounded-xl bg-[#FFF9ED] sticky"
            sx={{ top: isMobile ? "auto" : "100px" }}
          >
            <Typography variant="h6" className="font-semibold mb-4">
              Resumen de Compra
            </Typography>
            <Divider className="mb-4" />

            <Box className="space-y-3">
              <Box className="flex justify-between">
                <Typography>Subtotal</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography>Envío</Typography>
                <Typography color={envioGratis ? "success.main" : "inherit"}>
                  {envioGratis ? "Gratis" : `$${envio}`}
                </Typography>
              </Box>
              <Divider className="my-3" />
              <Box className="flex justify-between">
                <Typography variant="subtitle1" className="font-semibold">
                  Total
                </Typography>
                <Typography variant="subtitle1" className="font-semibold">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" gap={2} mt={4}>
              <Button
                variant="contained"
                fullWidth
                disabled={
                  procesando ||
                  !estaLogueado ||
                  (esEmpresa && !empresaPuedeComprar)
                }
                onClick={handleCheckout}
                sx={{
                  bgcolor: theme.palette.secondary.dark,
                  "&:hover": { bgcolor: "#8B7031" },
                  borderRadius: "24px",
                  py: 1.5,
                  fontWeight: 500,
                }}
              >
                {procesando ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Continuar"
                )}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/"
                sx={{
                  color: "#B99342",
                  borderColor: "#B99342",
                  borderRadius: "24px",
                  py: 1.5,
                }}
              >
                Cancelar
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumenCompraPage;
