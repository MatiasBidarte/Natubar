import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { Product } from "../types/product";
import theme from "../ui/theme";
import { useState } from "react";
import IconCarrito from "./IconCarrito";
import { useCartStore } from "../hooks/useCarritoStore";
import type { Sabor } from "@/app/types/product";
import NumericImput from "./numericImput";
import { saborLinea } from "../types/lineaCarrito";




interface CustomModalProps {
  open: boolean;
  handleClose: () => void;
  producto: Product;
}

function ModalCard({ open, handleClose, producto }: CustomModalProps) {

  const addToCart = useCartStore((state) => state.addToCart);

  const sabores: Sabor[] = [
    { id: 1, nombre: "Chocolate" },
    { id: 2, nombre: "Arándanos" },
    { id: 3, nombre: "Maní" },
    { id: 4, nombre: "Nueces" },
    { id: 5, nombre: "Pasas de uva" },
  ];

  const [cantidadTotal, setCantidadTotal] = useState(1); // o 0 si prefieres
  const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});
  const handleChange = (saborId: number, value: number) => {
    setCantidades((prev) => ({
      ...prev,
      [saborId]: value,
    }));
  };

  const handleAddToCart = () => {
    const saboresSeleccionados: saborLinea[] = sabores
      .filter((sabor) => (cantidades[sabor.id] || 0) > 0)
      .map((sabor) => ({
        sabor,
        cantidad: cantidades[sabor.id],
        cantidadTotal: cantidadTotal,
      }));

    if (saboresSeleccionados.length === 0) return; // No agregar si no hay nada

    addToCart({
      producto,
      sabores: saboresSeleccionados,
      cantidad: cantidadTotal,
    });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
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
        <Typography id="modal-title" variant="h6" textAlign="center" sx={{ pb: 2 }}>
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
            src={producto.urlImagen ? producto.urlImagen : "/placeholder.png"}
            alt={producto.nombre || "Producto"}
            width={400}
            height={200}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        <Stack spacing={2} direction="row" justifyContent="space-between" sx={{ px: 2, margin: "10px" }}>
          <Typography sx={{ fontSize: "22px" }}>{producto.nombre}</Typography>
          <Typography>${producto.precioPersonas}</Typography>
        </Stack>

        <Divider sx={{ width: "calc(100% + 32px)", marginLeft: "-16px", borderBottomWidth: 1, borderColor: theme.palette.primary.main }} />

        <Stack sx={{ px: 2, margin: "10px" }}>
          <Typography>¡Elige los sabores que más te gustan y agrega las barras a tu pedido!</Typography>
          {sabores.map((sabor) => (
            <Box key={sabor.id} display="flex" alignItems="center" sx={{ my: 1 }}>
              <Typography sx={{ minWidth: 120 }}>{sabor.nombre}</Typography>
              <NumericImput
                value={cantidades[sabor.id] || 0}
                onChange={(e) => handleChange(sabor.id, Number(e.target.value))}
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
 <Grid item xs={12} sm={4} md={3}>
  <NumericImput
    value={cantidadTotal}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      setCantidadTotal(Number(e.target.value))
    }
  />
</Grid>
  <Grid item xs={12} sm={8} md={9} xl={9} size={8}>
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
      </Box>
    </Modal>
  );
}
export default ModalCard;