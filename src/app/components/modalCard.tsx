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
import { useState } from "react";
import IconCarrito from "./IconCarrito";
import NumericImput from "./numericImput";
import { saborLinea } from "../types/lineaCarrito";
import { usePedidos } from "../hooks/usePedidos";

interface CustomModalProps {
  open: boolean;
  handleClose: () => void;
  producto: Product;
}

function ModalCard({ open, handleClose, producto }: CustomModalProps) {
  console.log(producto);
  const [error, setError] = useState("");
  const addToCart = usePedidos((state) => state.addToCart);
  const [cantidadTotal, setCantidadTotal] = useState(1); // o 0 si prefieres
  const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});
  const handleChange = (saborId: number, value: number) => {
    setCantidades((prev) => ({
      ...prev,
      [saborId]: value,
    }));
  };

  const handleAddToCart = () => {
    const saboresSeleccionados: saborLinea[] = (producto.sabores ?? [])
      .filter((sabor) => (cantidades[sabor.id] || 0) > 0)
      .map((sabor) => ({
        sabor,
        cantidad: cantidades[sabor.id],
        cantidadTotal: cantidadTotal,
      }));

    if (saboresSeleccionados.length === 0) return;
    const sumaSabores = saboresSeleccionados.reduce(
      (acc, saborLinea) => acc + saborLinea.cantidad,
      0
    );
    if (sumaSabores !== 12) {
      setError("Debes seleccionar exactamente 12 unidades entre los sabores.");
      return;
    }
    setError("");

    addToCart({
      producto,
      sabores: saboresSeleccionados,
      cantidad: cantidadTotal,
    });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
            p: { xs: 2 },
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            textAlign="center"
            sx={{ pb: 2 }}
          >
            Personaliza tu pedido
          </Typography>

          <Box
            sx={{
              width: "100%",
              height: 300,
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            <Image
              src={producto.urlImagen ?? "/placeholder.png"}
              alt={producto.nombre ?? "Imagen del producto"}
              width={640}
              height={400}
              unoptimized
            />
          </Box>

          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            sx={{ px: 2, margin: "10px" }}
          >
            <Typography sx={{ fontSize: "22px" }}>{producto.nombre}</Typography>
            <Typography>${producto.precioPersonas}</Typography>
          </Stack>

          <Divider
            sx={{
              width: "calc(100% + 32px)",
              marginLeft: "-16px",
              borderBottomWidth: 1,
              borderColor: theme.palette.primary.main,
            }}
          />

          <Stack sx={{ px: 2, margin: "10px" }}>
            <Typography>
              ¡Elige los sabores que más te gustan y agrega las barras a tu
              pedido!
            </Typography>
            {producto.sabores?.map((sabor) => (
              <Box
                key={sabor.id}
                display="flex"
                alignItems="center"
                sx={{ my: 1 }}
              >
                <Typography sx={{ minWidth: 120 }}>{sabor.nombre}</Typography>
                <NumericImput
                  value={cantidades[sabor.id] || 0}
                  onChange={(e) =>
                    handleChange(sabor.id, Number(e.target.value))
                  }
                />
              </Box>
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
                <IconCarrito />
                Agregar al carrito
              </Button>
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
export default ModalCard;
