'use client';

import { useEffect } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

export default function PaymentBrick() {
    useEffect(() => {
        initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);
    }, []);

    const initialization = {
        amount: 100,
        preferenceId: '<PREFERENCE_ID>', // Reemplazalo por uno real
    };

    const customization = {
        paymentMethods: {
            ticket: 'all' as const,
            creditCard: 'all' as const,
            prepaidCard: 'all' as const,
            debitCard: 'all' as const,
            mercadoPago: 'all' as const,

        },
    };

    const onSubmit = async ({ formData }: any) => {
        return fetch('/api/process_payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        }).then((res) => res.json());
    };

    return (
        <Payment
            initialization={initialization}
            customization={customization}
            onSubmit={onSubmit}
            onReady={() => console.log('Listo')}
            onError={(err) => console.error(err)}
        />
    );
}