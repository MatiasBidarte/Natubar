import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import NumericInput from "./numericImput";
import { Product } from "../types/product";
import theme from "../ui/theme";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import IconCarrito from "./IconCarrito";
import { useCartStore } from "../hooks/useCarritoStore";




interface CustomModalProps {
  open: boolean;
  handleClose: () => void;
  producto: Product;
}

function ModalCard({ open, handleClose, producto }: CustomModalProps) {

  const sabores = ["Chocolate", "Arándanos", "Maní", "Nueces", "Pasas de uva"];

  const [cantidades, setCantidades] = useState<{ [key: string]: number }>({});
   const handleChange = (sabor: string, value: number) => {
    setCantidades((prev) => ({
      ...prev,
      [sabor]: value,
    }));
  };

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      producto,
      cantidades,
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
      width: { xs: "95%", sm: 600, md: 800 },
      maxWidth: "95vw",
      bgcolor: "background.paper",
      boxShadow: 24,
      borderRadius: 2,
      p: { xs: 2},
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

    <Stack spacing={2} direction="row" justifyContent="space-between" sx={{ px: 2,  margin: "10px"}}>
      <Typography sx={{fontSize:"22px"}}>{producto.nombre}</Typography>
      <Typography>${producto.precioPersonas}</Typography>
    </Stack>

    <Divider sx={{ width: "calc(100% + 32px)", marginLeft: "-16px", borderBottomWidth: 1, borderColor: theme.palette.primary.main }} />

    <Stack sx={{ px: 2 ,margin: "10px"}}>
      <Typography>¡Elige los sabores que más te gustan y agrega las barras a tu pedido!</Typography>
      {sabores.map((sabor) => (
        <Box key={sabor} display="flex" alignItems="center" sx={{ my: 1 }}>
          <Typography sx={{ minWidth: 120 }}>{sabor}</Typography>
          <NumericInput
          value={cantidades[sabor] || 0}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(sabor, Number(e.target.value))
      }
    />
        </Box>
      ))}
    </Stack>

    <TextField fullWidth label="Observaciones" multiline rows={3} sx={{ mt: 2 }} />
    <Grid container spacing={2} sx={{margin: 2}}>
    <Grid size={4}>
      <NumericInput
        value={cantidades["Total"] || 0}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleChange("Total", Number(e.target.value))
        }
      />
    </Grid>
    <Grid size={8} >
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
        "&:hover": { backgroundColor:theme.palette.primary.main },
      }}
          onClick={handleAddToCart}
      >  
      <IconCarrito/>
      Agregar al carrito
      </Button>
    </Grid>
</Grid>
  </Box>
</Modal>
  );
}

export default ModalCard;
