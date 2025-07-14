"use client";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { LocalShipping } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useUsuarioStore } from "../hooks/useUsuarioStore";

const EnvioBanner = () => {
  const theme = useTheme();
  const { estaLogueado, esEmpresa } = useUsuarioStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [montoMinimo, setMontoMinimo] = useState<number>(500);
  const [costoCompraMinimoEmpresas, setCostoCompraMinimoEmpresas] =
    useState<number>(1000);
  let textoDeBanner = `¡Envío GRATIS en compras mayores a $${montoMinimo.toLocaleString()}!`;

  if (estaLogueado && esEmpresa) {
    textoDeBanner = `Valor de compra minimo de $${costoCompraMinimoEmpresas.toLocaleString()}`;
  }

  useEffect(() => {
    const valorMinimo = process.env.NEXT_PUBLIC_VALOR_MINIMO_PARA_ENVIO;
    const valorCompraMinimoEmpresas =
      process.env.NEXT_PUBLIC_COSTO_COMPRA_MINIMO_EMPRESAS;
    if (valorMinimo) {
      setMontoMinimo(Number(valorMinimo));
    }
    if (valorCompraMinimoEmpresas) {
      setCostoCompraMinimoEmpresas(Number(valorCompraMinimoEmpresas));
    }
  }, []);

  return (
    <Box
      className="fixed top-0 left-0 w-full z-50 shadow-sm"
      sx={{
        background: isMobile ? "#201B21" : theme.palette.secondary.dark,
        height: { xs: "auto", md: "44px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        className="flex items-center justify-center gap-2"
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 1.5, md: 1 },
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        <LocalShipping
          fontSize={isMobile ? "small" : "medium"}
          sx={{
            color: isMobile ? theme.palette.secondary.dark : "inherit",
          }}
        />
        <Typography
          variant={isMobile ? "caption" : "body1"}
          sx={{
            fontWeight: isMobile ? 600 : 400,
            letterSpacing: isMobile ? 0.5 : "18%",
            color: isMobile ? theme.palette.secondary.dark : "inherit",
            textTransform: "uppercase",
            fontSize: isMobile ? "0.7rem" : "inherit",
          }}
        >
          {textoDeBanner}
        </Typography>
      </Box>
    </Box>
  );
};

export default EnvioBanner;
