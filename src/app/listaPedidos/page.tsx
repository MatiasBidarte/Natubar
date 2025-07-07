'use client';
import * as React from 'react';
import {
    Paper,
    Box,
} from '@mui/material';
import { useEffect } from 'react';
import usePedidos from '../hooks/usePedidos';
import Image from 'next/image';

const TipoServicioPage = () => {
    const { pedidos, fetchPedidos } = usePedidos();

    useEffect(() => {
       fetchPedidos();
     }, [fetchPedidos]);
   


    return (
        <Paper
            elevation={3}
            sx={{
                minHeight: 500,
                maxWidth: {
                    xs: '95vw',
                    sm: '90vw',
                    md: '85vw',
                    lg: '70vw',
                },
                mx: 'auto',
                p: { xs: 1, sm: 2, md: 3 },
            }}
        >
            {pedidos.map((pedido, index) => (
                <Box key={index}>
                    <Image
                        src={pedido.productos?.[0]?.urlImagen ?? "/placeholder.png"}
                        alt={pedido.productos?.[0]?.nombre ?? "Imagen del producto"}
                        width={640}
                        height={400}
                        unoptimized
                    />


                </Box>
            ))}
        </Paper>
    );
};

export default TipoServicioPage;