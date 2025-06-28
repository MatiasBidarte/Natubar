'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    FormControlLabel,
    FormControl,
    RadioGroup,
    Radio,
} from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import PaymentBrick from './mercadoPago/page';
import TransferenciaForm from './transeferencia/page';
import { Padding } from '@mui/icons-material';
import theme from '../ui/theme';

export default function MetodoPago() {
    const [metodo, setMetodo] = useState<'mp' | 'transferencia' | null>(null);
    const [metodoSeleccionado, setMetodoSeleccionado] = useState<'mp' | 'transferencia' | null>(null);
    return (
        <Box sx={{ width: '100%', mx: 'auto', mt: 10 }}>
            {!metodo && (
                <Box mb={3} display={'flex'} flexDirection={'row'} gap={2}>
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Seleccioná tu método de pago
                        </Typography>
                        <Stack spacing={2}>
                            <FormControl>
                                <RadioGroup
                                    value={metodoSeleccionado}
                                    onChange={(e) => setMetodoSeleccionado(e.target.value as 'mp' | 'transferencia')}
                                >
                                    <FormControlLabel value="mp" control={<Radio />} label="Mercado Pago" sx={{
                                        p: 1.2,
                                        border: '1px solid rgba(0, 0, 0, 0.1)',
                                        borderRadius: 3,
                                        margin: 1,
                                        '&.Mui-checked': {
                                            border: '2px solid black',
                                            backgroundColor: '#f5f5f5', // opcional: para un fondo levemente resaltado
                                        },
                                    }} />
                                    <FormControlLabel value="transferencia" control={<Radio />} label="Transferencia Bancaria" sx={{
                                        p: 1.2,
                                        border: '1px solid rgba(0, 0, 0, 0.1)',
                                        borderRadius: 3,
                                        margin: 1,
                                        '&.Mui-checked': {
                                            border: '2px solid black',
                                            backgroundColor: '#f5f5f5', // opcional: para un fondo levemente resaltado
                                        },
                                    }} />
                                </RadioGroup>
                                <Box sx={{
                                    p: 1.2,
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    borderRadius: 3,
                                    margin: 1,
                                    '&.Mui-checked': {
                                        border: '2px solid black',
                                        backgroundColor: '#f5f5f5', // opcional: para un fondo levemente resaltado
                                    },
                                }}>
                                    <Typography variant="body2" color="textSecondary" mt={1}>
                                        <InfoOutlineIcon sx={{ color: theme.palette.secondary.main }} />Serás redirigido a tu proveedor de pago seleccionado para completar la transacción.
                                    </Typography>
                                </Box>
                            </FormControl>
                        </Stack>
                    </Box>
                    <Box width={"40%"}>
                        <Typography variant="h5" gutterBottom>
                            carrito
                        </Typography>
                        <Button className="btn-portada" onClick={() => setMetodo(metodoSeleccionado)} sx={{ width: '100%' }} disabled={!metodoSeleccionado}
>
                            Continuar
                        </Button>
                    </Box>
                </Box>

            )}

            {metodo === 'mp' && (
                <Box mt={3}>
                    <Typography variant="h6">Pago con Mercado Pago</Typography>
                    <PaymentBrick />
                </Box>
            )}

            {metodo === 'transferencia' && (
                <Box mt={3}>
                    <Typography variant="h6">Datos para transferencia</Typography>
                    <TransferenciaForm />
                </Box>
            )}

            {metodo && (
                <Box mt={2}>
                    <Button onClick={() => setMetodo(null)}>← Elegir otro método</Button>
                </Box>
            )}
        </Box>
    );
}