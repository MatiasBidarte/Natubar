"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import {
  Add,
  Remove,
  DeleteOutline,
  ArrowBack,
  ShoppingBag,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { usePedidos } from "../hooks/usePedidos";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { useRouter } from "next/navigation";

const ResumenCompraPage = () => {
  const {
    items,
    removeFromCart,
    updateCartItem,
    clearCart,
    crearPedido,
    addToCart,
    loadingPedidos,
    errorPedidos,
  } = usePedidos();
  const { usuario, estaLogueado, esEmpresa } = useUsuarioStore();
  const router = useRouter();
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Añade esta función dentro del componente ResumenCompraPage
  const addTestProducts = () => {
    // Datos de prueba
    const testProducts = [
      {
        producto: {
          id: 1,
          nombre: "Barra Proteica Chocolate",
          descripcion: "Barra de proteína con sabor a chocolate",
          precioPersonas: 120,
          precioEmpresas: 100,
          urlImagen:
            "https://res.cloudinary.com/dpozwwyuy/image/upload/v1749679888/barras_surtidas_nrrzmw.jpg",
        },
        cantidad: 3,
        sabores: [
          { sabor: { id: 1, nombre: "Chocolate" }, cantidad: 2 },
          { sabor: { id: 2, nombre: "Vainilla" }, cantidad: 1 },
        ],
      },
      {
        producto: {
          id: 2,
          nombre: "Barra Energética Frutos Rojos",
          descripcion: "Barra energética natural con frutos rojos",
          precioPersonas: 150,
          precioEmpresas: 130,
          urlImagen:
            "https://res.cloudinary.com/dpozwwyuy/image/upload/v1749679888/barras_surtidas_nrrzmw.jpg",
        },
        cantidad: 2,
        sabores: [
          { sabor: { id: 3, nombre: "Frutilla" }, cantidad: 1 },
          { sabor: { id: 4, nombre: "Arándanos" }, cantidad: 1 },
        ],
      },
      {
        producto: {
          id: 3,
          nombre: "Barra Cereal Almendras",
          descripcion: "Barra de cereal con almendras y miel",
          precioPersonas: 135,
          precioEmpresas: 115,
          urlImagen:
            "https://res.cloudinary.com/dpozwwyuy/image/upload/v1749679888/barras_surtidas_nrrzmw.jpg",
        },
        cantidad: 1,
        sabores: [{ sabor: { id: 5, nombre: "Almendra" }, cantidad: 1 }],
      },
    ];

    // Limpia el carrito primero
    clearCart();

    // Agrega cada producto al carrito
    testProducts.forEach((item) => {
      addToCart(item);
    });
  };

  useEffect(() => {
    addTestProducts();
  }, []);

  // Calcular totales
  const subtotal = items.reduce(
    (sum, item) => sum + item.producto.precioPersonas * item.cantidad,
    0
  );
  const impuestos = subtotal * 0.22; // IVA 22%
  const total = subtotal + impuestos;

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) return;

    const item = items[index];
    updateCartItem(index, {
      ...item,
      cantidad: newQuantity,
    });
  };

  const handleCheckout = async () => {
    if (!estaLogueado) {
      router.push("/login?redirect=resumenCompra");
      return;
    }

    try {
      setProcesando(true);
      setError(null);
      await crearPedido(usuario?.id || "");
      router.push("/perfil/compras");
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
    <Box className="w-full max-w-5xl mx-auto p-4 pt-24 md:pt-32">
      <Box className="flex items-center gap-2 mb-6">
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          sx={{ color: "#B99342" }}
        >
          Seguir comprando
        </Button>
        <Typography
          variant="h5"
          className="font-semibold text-[#201B21] ml-auto"
        >
          Carrito de Compras
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4 rounded-lg">
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid itemID="1">
          <Paper
            elevation={0}
            className="p-4 md:p-6 rounded-xl bg-[#FFF9ED] mb-4"
          >
            <Box
              className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 pb-2 mb-4"
              sx={{ borderBottom: "1px solid #EAEAEA" }}
            >
              <Typography
                variant="subtitle2"
                className="font-medium text-gray-600"
              >
                Producto
              </Typography>
              <Typography
                variant="subtitle2"
                className="font-medium text-gray-600 text-center"
              >
                Precio
              </Typography>
              <Typography
                variant="subtitle2"
                className="font-medium text-gray-600 text-center"
              >
                Cantidad
              </Typography>
              <Typography
                variant="subtitle2"
                className="font-medium text-gray-600 text-center"
              >
                Subtotal
              </Typography>
            </Box>

            {/* Lista de productos */}
            {items.map((item, index) => (
              <Box
                key={index}
                className="py-4 border-b border-gray-100 last:border-b-0"
              >
                {/* Vista móvil */}
                <Box className="md:hidden grid grid-cols-[100px_1fr] gap-3">
                  <Box className="relative h-[100px] w-[100px] rounded-lg overflow-hidden">
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
                    <Typography
                      variant="subtitle1"
                      className="font-medium mb-1"
                    >
                      {item.producto.nombre}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mb-2">
                      ${item.producto.precioPersonas.toFixed(2)}
                    </Typography>

                    <Box className="flex justify-between items-center">
                      <Box className="flex items-center">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleUpdateQuantity(index, item.cantidad - 1)
                          }
                          sx={{ color: "#B99342" }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>{item.cantidad}</Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleUpdateQuantity(index, item.cantidad + 1)
                          }
                          sx={{ color: "#B99342" }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                      <IconButton
                        onClick={() => removeFromCart(index)}
                        sx={{ color: "#EB5757" }}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                {/* Vista desktop */}
                <Box className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center">
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
                    <Typography variant="body1" className="font-medium">
                      {item.producto.nombre}
                    </Typography>
                  </Box>

                  <Typography variant="body2" className="text-center">
                    ${item.producto.precioPersonas.toFixed(2)}
                  </Typography>

                  <Box className="flex items-center justify-center">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleUpdateQuantity(index, item.cantidad - 1)
                      }
                      sx={{ color: "#B99342" }}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>{item.cantidad}</Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleUpdateQuantity(index, item.cantidad + 1)
                      }
                      sx={{ color: "#B99342" }}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box className="flex items-center gap-2">
                    <Typography variant="body2" className="font-medium">
                      $
                      {(item.producto.precioPersonas * item.cantidad).toFixed(
                        2
                      )}
                    </Typography>
                    <IconButton
                      onClick={() => removeFromCart(index)}
                      sx={{ color: "#EB5757" }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}

            <Box className="flex justify-between mt-4">
              <Button
                onClick={clearCart}
                variant="outlined"
                color="error"
                className="border-red-300 text-red-500"
                startIcon={<DeleteOutline />}
                sx={{ borderRadius: "20px" }}
              >
                Vaciar carrito
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid itemID="2">
          <Paper elevation={0} className="p-4 md:p-6 rounded-xl bg-[#FFF9ED]">
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
                <Typography>IVA (22%)</Typography>
                <Typography>${impuestos.toFixed(2)}</Typography>
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

            <Button
              variant="contained"
              fullWidth
              disabled={procesando}
              onClick={handleCheckout}
              className="mt-6"
              sx={{
                bgcolor: "#B99342",
                "&:hover": { bgcolor: "#8B7031" },
                borderRadius: "24px",
                py: 1.5,
              }}
            >
              {procesando ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Finalizar Compra"
              )}
            </Button>

            {!estaLogueado && (
              <Typography
                variant="body2"
                className="mt-2 text-center text-gray-500"
              >
                Necesitas iniciar sesión para finalizar la compra
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumenCompraPage;
