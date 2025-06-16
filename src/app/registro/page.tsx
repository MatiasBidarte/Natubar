"use client";

import { useRouter } from "next/navigation";
import { Button, Typography } from "@mui/material";

export default function Registro() {
  const router = useRouter();

  const handleClick = (tipo: "persona" | "empresa") => {
    router.push(`/registro/${tipo}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12">
      <Typography
        variant="h5"
        sx={{ color: "text.secondary" }}
        className="text-xl font-semibold mb-4"
      >
        ¿Qué tipo de usuario eres?
      </Typography>
      <div className="flex gap-20">
        <Button variant="outlined" onClick={() => handleClick("persona")}>
          Persona
        </Button>
        <Button variant="outlined" onClick={() => handleClick("empresa")}>
          Empresa
        </Button>
      </div>
    </div>
  );
}
