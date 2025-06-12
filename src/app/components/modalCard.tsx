import { Box, Button, Divider, FormControlLabel, Modal, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import NumericInput from "./numericImput";
import { Product } from "../types/product";
import theme from "../ui/theme";

interface CustomModalProps {
  open: boolean;
  handleClose: () => void;
  producto: Product
}

function CustomModal({ open, handleClose,producto }: CustomModalProps) {
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
        src={producto?.urlImagen || "/placeholder.png"}
        alt={producto?.nombre || "Producto"}
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
        <FormControlLabel key="Chocolate" control={<NumericInput />} label="Chocolate" sx={{ my: 1 }} />
        <FormControlLabel key="Arándanos" control={<NumericInput />} label="Arándanos" sx={{ my: 1 }} />
        <FormControlLabel key="Maní" control={<NumericInput />} label="Maní" sx={{ my: 1 }} />
        <FormControlLabel key="Nueces" control={<NumericInput />} label="Nueces" sx={{ my: 1 }} />
        <FormControlLabel key="Pasas de uva" control={<NumericInput />} label="Pasas de uva" sx={{ my: 1 }} />
    </Stack>

    <TextField fullWidth label="Observaciones" multiline rows={3} sx={{ mt: 2 }} />

    <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleClose}>
      Agregar al carrito
    </Button>
  </Box>
</Modal>
  );
}

export default CustomModal;
