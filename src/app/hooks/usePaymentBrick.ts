import { useEffect } from 'react';

interface UsePaymentBrickProps {
  amount: number;
  preferenceId: string;
}

export function usePaymentBrick({ amount, preferenceId }: UsePaymentBrickProps) {
  useEffect(() => {
    const mp = new (window as any).MercadoPago('TU_PUBLIC_KEY', {
      locale: 'es-UY',
    });

    const bricksBuilder = mp.bricks();

    const renderBrick = async () => {
      await bricksBuilder.create('payment', 'paymentBrick_container', {
        initialization: {
          amount,
          preferenceId,
        },
        customization: {
          paymentMethods: {
            ticket: 'all',
            creditCard: 'all',
            prepaidCard: 'all',
            debitCard: 'all',
            mercadoPago: 'all',
          },
        },
        callbacks: {
          onReady: async () => {
            console.log('Brick listo');
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
            return new Promise((resolve, reject) => {
              fetch('/api/process_payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
              })
                .then((res) => res.json())
                .then((data) => resolve(data))
                .catch((err) => reject(err));
            });
          },
          onError: async (error: any) => {
            console.error(error);
          },
        },
      });
    };

    renderBrick();
  }, [amount, preferenceId]);
}