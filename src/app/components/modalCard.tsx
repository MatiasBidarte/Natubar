import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { Product } from "../types/product";
import theme from "../ui/theme";
import { useState, useEffect } from "react";
import NumericImput from "./numericImput";
import { saborLinea } from "../types/lineaCarrito";
import useProductos from "../hooks/useProductos";
import { usePedidos } from "../hooks/usePedidos";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useUsuarioStore } from "../hooks/useUsuarioStore";


interface CustomModalProps {
  open: boolean;
  handleClose: () => void;
  producto: Product;
}

function ModalCard({ open, handleClose, producto }: CustomModalProps) {
  const { sabores = [], getSabores } = useProductos() ?? {
    sabores: [],
    getSabores: () => {},
  };

  useEffect(() => {
    getSabores();
  }, [getSabores]);


  useEffect(() => {
  if (!open) {
    setError("");
    setCantidades({});
    setCantidadTotal(1);
  }
}, [open]);

  const [error, setError] = useState("");
  const addToCart = usePedidos((state) => state.addToCart);
  const [cantidadTotal, setCantidadTotal] = useState(1);
  const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});

  const { usuario, esEmpresa } = useUsuarioStore();

  const precioProducto = usuario
    ? esEmpresa
      ? producto.precioEmpresas
      : producto.precioPersonas
    : producto.precioPersonas;

  const handleChange = (saborId: number, value: number) => {
    setCantidades((prev) => ({
      ...prev,
      [saborId]: value,
    }));
  };

  const handleOnClose = () => {
    setError("");
    handleClose();
  };

  const handleAddToCart = () => {
    const saboresSeleccionados: saborLinea[] = (sabores ?? [])
      .filter((sabor) => (cantidades[sabor.id] || 0) > 0)
      .map((sabor) => ({
        sabor,
        cantidad: cantidades[sabor.id],
      }));
    if (producto.esCajaDeBarras) {
      const sumaSabores = saboresSeleccionados.reduce(
        (acc, saborLinea) => acc + saborLinea.cantidad,
        0
      );

      if (sumaSabores !== producto.cantidadDeBarras) {
        setError(
          `Debes seleccionar exactamente ${producto.cantidadDeBarras} unidades entre los sabores.`
        );
        return;
      }
    }

    setError("");

    addToCart({
      producto,
      sabores: saboresSeleccionados,
      cantidad: cantidadTotal,
    });
    handleClose();

    setError("");
  };

  return (
    <Modal
      open={open}
      onClose={handleOnClose}
      aria-labelledby="modal-title"
      sx={{ borderRadius: 5 }}
    >
      <Box>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: { xs: "95%", sm: 600, md: 800 },
            maxWidth: "95vw",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Typography
              id="modal-title"
              variant="h6"
              width={"100%"}
              textAlign="center"
              sx={{ p: 2 }}
            >
              Personaliza tu pedido
            </Typography>
            <IconButton>
              <Close onClick={handleOnClose} />
            </IconButton>
          </Box>

          <Box
            sx={{
              width: "100%",
              position: "relative",
              paddingTop: "60%", // Relación de aspecto 5:3
              overflow: "hidden",
            }}
          >
            <Image
              src={producto.urlImagen!}
              alt={producto.nombre ?? "Imagen del producto"}
              fill
              sizes="(max-width: 600px) 95vw, (max-width: 1200px) 600px"
              style={{
                objectFit: "cover",
              }}
            />
          </Box>

          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems={"center"}
            sx={{ px: 2, margin: "10px" }}
          >
            <Typography sx={{ fontSize: "22px" }}>{producto.nombre}</Typography>
            <Typography>${precioProducto.toFixed(2)}</Typography>
          </Stack>

          <Divider
            sx={{
              width: "100%",
              borderBottomWidth: 1,
              borderColor: theme.palette.secondary.main,
            }}
          />

          <Stack sx={{ px: 2, margin: "10px" }}>
            <Typography>
              ¡Elige los sabores que más te gustan y agrega las barras a tu
              pedido!
            </Typography>
            {producto.esCajaDeBarras &&
              (sabores.length === 0 ? (
                <Typography>Cargando sabores...</Typography>
              ) : (
                sabores.map((sabor) => (
                  <Box
                    key={sabor.id}
                    display="flex"
                    justifyContent={"space-between"}
                    alignItems="center"
                    sx={{ my: 1 }}
                  >
                    <Typography sx={{ minWidth: 120 }}>
                      {sabor.nombre}
                    </Typography>
                    <NumericImput
                      width="130px"
                      value={cantidades[sabor.id] || 0}
                      onChange={(e) =>
                        handleChange(sabor.id, Number(e.target.value))
                      }
                    />
                  </Box>
                ))
              ))}
          </Stack>
          <Grid
            container
            spacing={2}
            sx={{
              margin: 2,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <NumericImput
                width="100%"
                value={cantidadTotal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCantidadTotal(Number(e.target.value))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 8, md: 9 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  borderRadius: "28px",
                  backgroundColor: theme.palette.secondary.main,
                  fontWeight: "bold",
                  fontSize: "16px",
                  py: 2,
                  boxShadow: "none",
                  "&:hover": { backgroundColor: theme.palette.primary.main },
                }}
                onClick={handleAddToCart}
              >
                Agregar al carrito
              </Button>
            </Grid>
          </Grid>
          {error && (
            <Typography
              color="error"
              sx={{ mb: 2, pr: 2, pl: 2, textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
export default ModalCard;
