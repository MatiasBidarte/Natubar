"use client";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import NavLinks from "./nav-links";
import "../globals.css";
import '@fontsource/roboto/400.css';
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <header className="flex aling-center justify-center header-envios">
        <p>ENVIOS GRATIS EN PEDIDOS DE $500+</p>
      </header>
      <NavLinks />fa
      {children}
    </ThemeProvider>
  );
}
