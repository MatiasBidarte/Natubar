'use client';
import { useEffect, useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { Box } from '@mui/material';

export default function PaymentBrick() {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [estadoPago, setEstadoPago] = useState<'pendiente' | 'aprobado' | 'rechazado' | 'procesando'>('pendiente');
    useEffect(() => {
        initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, { locale: 'es-UY' });

        // Llama a tu backend para obtener el preferenceId
        fetch(`${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/pedidos/crear-preferencia`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "" },
            body: JSON.stringify({ /* datos del pedido */ }),
        })
            .then((res) => res.json())
            .then((data) => setPreferenceId(data.preferenceId));
    }, []);

    const customization = {
        paymentMethods: {
            ticket: 'all' as const,
            creditCard: 'all' as const,
            prepaidCard: 'all' as const,
            debitCard: 'all' as const,
            mercadoPago: 'all' as const,
        },
    };
    const initialization = {
        amount: 1000,
        preferenceId: preferenceId ?? "",
    };

    if (!preferenceId) {
        return <Box textAlign="center">Cargando pago...</Box>;
    }

    const onSubmit = async () => {
    }
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
                px: { xs: 2, sm: 4 },
                boxSizing: "border-box",
            }}
        >
            <Box
                width="100%"
                maxWidth={400}
                bgcolor="background.paper"
                borderRadius={2}
                boxShadow={3}
                p={{ xs: 2, sm: 4 }}
            >
                <Box mb={2} textAlign="center">
                    <strong>Total a pagar:</strong> ${initialization.amount}
                </Box>
                {estadoPago === 'procesando' && (
                    <Box textAlign="center" color="info.main" mb={2}>
                        Pago en proceso... Esperando confirmación.
                    </Box>
                )}
                {estadoPago === 'aprobado' && (
                    <Box textAlign="center" color="success.main" mb={2}>
                        ¡Pago aprobado! Gracias por tu compra.
                    </Box>
                )}
                {estadoPago === 'rechazado' && (
                    <Box textAlign="center" color="error.main" mb={2}>
                        El pago fue rechazado. Intenta nuevamente.
                    </Box>
                )}
                <Payment
                    initialization={initialization}
                    customization={customization}
                    onSubmit={onSubmit}
                    onReady={() => console.log('Listo')}
                    onError={(err) => console.error(err)}
                />
            </Box>
        </Box>
    );
}