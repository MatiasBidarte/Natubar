import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import React from "react";

const CheckoutStepper = ({ stepActivo }: { stepActivo: number }) => {
  return (
    <Stepper activeStep={stepActivo} alternativeLabel className="mb-8">
      <Step>
        <StepLabel>
          <Typography color="secondary.dark" fontWeight={600}>
            Resumen de compra
          </Typography>
        </StepLabel>
      </Step>
      <Step>
        <StepLabel>
          <Typography color="text.secondary">Método de pago</Typography>
        </StepLabel>
      </Step>
      <Step>
        <StepLabel>
          <Typography color="text.secondary">Pedido</Typography>
        </StepLabel>
      </Step>
    </Stepper>
  );
};

export default CheckoutStepper;
