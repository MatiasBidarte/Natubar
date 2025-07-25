"use client";

import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import NavLinksMobile from "./nav-links-mobile";
import { useEffect } from "react";
import NavLinksDesktop from "./nav-links-desktop";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import dynamic from "next/dynamic";

const EnvioBanner = dynamic(() => import("./EnvioBanner"), { ssr: false });

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
    const handleAuthChange = () => {
      inicializarUsuario();
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [inicializarUsuario]);

  const { verificarIntegridad, usuario } = useUsuarioStore();

  useEffect(() => {
    verificarIntegridad();
  });

  return (
    <ThemeProvider theme={theme}>
      {!usuario || usuario.tipo != "ADMINISTRADOR" ? <EnvioBanner />: ""}
      
      <NavLinksDesktop />
      <div className="flex justify-center min-h-screen pb-24 md:pb-4 pt-11 md:pt-28">
        {children}
      </div>
      <NavLinksMobile />
    </ThemeProvider>
  );
}
