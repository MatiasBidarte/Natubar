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
      <header>
        <div className="c-envios-header">
          <p>ENVíOS GRATISEN PEDIDOS DE $500+</p>
        </div>
        <NavLinks />
      </header>
      {children}
    </ThemeProvider>
  );
}
