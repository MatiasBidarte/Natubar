"use client";

import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import NavLinksMobile from "./nav-links-mobile";
import { useState, useEffect } from "react";
import NavLinksDesktop from "./nav-links-desktop";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [estaLogueado, setEstaLogueado] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEstaLogueado(localStorage.getItem("usuario") !== null);
      const handleAuthChange = () => {
        setEstaLogueado(localStorage.getItem("usuario") !== null);
      };
      window.addEventListener("auth-change", handleAuthChange);
      return () => {
        window.removeEventListener("auth-change", handleAuthChange);
      };
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NavLinksDesktop estaLogueado={estaLogueado} />
      <div className="flex justify-center min-h-screen pb-24 md:pb-4 pt-0 md:pt-18 ">
        {children}
      </div>
      <NavLinksMobile estaLogueado={estaLogueado} />
    </ThemeProvider>
  );
}
