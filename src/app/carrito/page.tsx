
"use client";
import {
  Box, Typography, IconButton, Button, Stack, Paper, Snackbar, Container
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { usePedidos } from '../hooks/usePedidos';
import { useState } from 'react';
import { homemadeApple } from '../ui/fonts';
import Grid from "@mui/material/Grid";
import NumericImput from "../components/numericImput";
import theme from "../ui/theme";
import { useRouter } from 'next/navigation';

const Carrito = () => {
  const { items } = usePedidos();
  const [apiError, setApiError] = useState<string | null>(null);
  const updateCantidad = usePedidos((state) => state.updateCantidad);
  const handleCantidadChange = (numeral: number, delta: number) => {
    updateCantidad(numeral,delta);
  };
  const router = useRouter();

  const removeFromCart = usePedidos((state) => state.removeFromCart);
  const eliminarItem = (numeral: number) => {
    console.log("eliminar: "+numeral)
    removeFromCart(numeral);
    console.log("Carrito items:", items);
  }

  const calcularTotal = () => {
    return items.reduce((acc, item) => acc + (item.producto.precioPersonas * (item.cantidad)), 0);
  };

  //console.log(items);
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
      <Container sx={{
            width: '100%',
            mx: 'auto',
            px: 2,
          }}>
      <Typography variant="h6" p-top={16} mb={2} textAlign="center" className={homemadeApple.className}>
        Carrito de Compras
      </Typography>

      <Stack spacing={2}>
        {  items.length === 0 ? (
            <Typography textAlign="center" color="text.secondary" mt={4}>
              El carrito está vacío.
            </Typography>

        ) :
        (
        items.map((item) => (
          <Paper key={item.numeral} elevation={1} sx={{ p: 2, borderRadius: 2, display: 'flex', gap: 2 }}>
            <Box
              component="img"
              src={item.producto.urlImagen ?? '/placeholder.png'}
              width={80}
              height={80}
              sx={{ borderRadius: 1, objectFit: 'cover' }}
              alt={item.producto.nombre}
            />
            <Box flex={1}>
              <Typography fontWeight="bold">{item.producto.nombre} {item.producto.esCajaDeBarras && `x${item.producto.cantidadDeBarras}`} </Typography>
              
              
              <Typography variant="body2" color="text.secondary">
                {item.producto.esCajaDeBarras && item.sabores.map((s) => s.sabor.nombre + " (" + s.cantidad +")").join(', ')}
              </Typography>
              <Box mt={1} display="flex" alignItems="center" gap={1}>
                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <NumericImput
                value={item.cantidad}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleCantidadChange(item.numeral, Number(e.target.value))
                }
              />
            </Grid>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <IconButton onClick={() => eliminarItem(item.numeral)}>
                <DeleteOutlineIcon />
              </IconButton>
              <Typography variant="body2">${item.producto.precioPersonas} c/u</Typography>
              <Typography fontWeight="bold">
                ${item.producto.precioPersonas * (item.cantidad)}
              </Typography>
            </Box>
          </Paper>
        )))}

        <Box p={2} bgcolor="white" borderRadius={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight="bold">Subtotal</Typography>
            <Typography fontWeight="bold">${calcularTotal()}</Typography>
          </Stack>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: theme.palette.secondary.main,
            py: 1.5,
            borderRadius: '28px',
            fontWeight: 'bold',
            fontSize: '16px',
            '&:hover': {
              bgcolor: '#a8772f'
            }
          }}
        >
          Comprar ahora
        </Button>
          <Button
          variant="outlined"
          fullWidth
          sx={{
            borderColor: theme.palette.secondary.main,
            color: theme.palette.secondary.main,
            py: 1.5,
            borderRadius: '28px',
            fontWeight: 'bold'
          }}
          onClick={() => router.push("/")}
        >
          Seguir comprando
        </Button>
        
      </Stack>
    </Container>
    </div>
  );
};

export default Carrito;
