
"use client";
import {
  Box, Typography, IconButton, Button, Divider, Stack, Paper, Snackbar, Container
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { usePedido } from '../hooks/usePedido';
import { useState } from 'react';
import { homemadeApple } from '../ui/fonts';

const Carrito = () => {
  const { items } = usePedido();
  const [apiError, setApiError] = useState<string | null>(null);
  const updateCantidad = usePedido((state) => state.updateCantidad);
  const handleCantidadChange = (numeral: number, delta: number) => {
    updateCantidad(numeral,delta);
  };

  const calcularTotal = () => {
    return items.reduce((acc, item) => acc + item.producto.precioPersonas * (item.cantidad), 0);
  };

  console.log(items);
  return (
    <div className="flex bg-white px-4 p-14">
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
      <Typography variant="h6" p-top={16} mb={2} textAlign="center" className={homemadeApple.className}>
        Carrito de Compras
      </Typography>

      <Stack spacing={2}>
        {items.map((item) => (
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
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleCantidadChange(item.numeral, -1)}
                >
                  -
                </Button>
                <Typography>{item.cantidad}</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleCantidadChange(item.numeral, 1)}
                >
                  +
                </Button>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <IconButton disabled>
                <DeleteOutlineIcon />
              </IconButton>
              <Typography variant="body2">${item.producto.precioPersonas} c/u</Typography>
              <Typography fontWeight="bold">
                ${item.producto.precioPersonas * (item.cantidad)}
              </Typography>
            </Box>
          </Paper>
        ))}

        <Box p={2} bgcolor="white" borderRadius={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Subtotal</Typography>
            <Typography>${calcularTotal()}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Envío</Typography>
            <Typography color="green">Gratis</Typography>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold">${calcularTotal()}</Typography>
          </Stack>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#b78b36',
            py: 1.5,
            borderRadius: 2,
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
            borderColor: '#b78b36',
            color: '#b78b36',
            py: 1.5,
            borderRadius: 2,
            fontWeight: 'bold'
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
