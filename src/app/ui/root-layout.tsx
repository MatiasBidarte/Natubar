"use client";

import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import NavLinksMobile from "./nav-links-mobile";
import { useEffect } from "react";
import NavLinksDesktop from "./nav-links-desktop";
import { useUsuarioStore } from "../hooks/useUsuarioStore";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { inicializarUsuario } = useUsuarioStore();

  useEffect(() => {
    inicializarUsuario();
  }, [inicializarUsuario]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleAuthChange = () => {
        inicializarUsuario();
      };
      window.addEventListener("auth-change", handleAuthChange);
      return () => {
        window.removeEventListener("auth-change", handleAuthChange);
      };
    }
  }, [inicializarUsuario]);

  return (
    <ThemeProvider theme={theme}>
      <NavLinksDesktop />
      <div className="flex justify-center min-h-screen pb-24 md:pb-4 pt-0 md:pt-18">
        {children}
      </div>
      <NavLinksMobile />
    </ThemeProvider>
  );
}
