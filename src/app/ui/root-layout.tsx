"use client";

import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import NavLinks from "./nav-links";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <div className="flex aling-center justify-center header-envios">
        <p>ENVIOS GRATIS EN PEDIDOS DE $500+</p>
      </div>
      <NavLinks />
      {children}
    </ThemeProvider>
  );
}
