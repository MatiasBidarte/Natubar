"use client";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { Button, Box, Typography, Paper } from "@mui/material";
import { Logout, AdminPanelSettings } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const { usuario, esAdmin, cerrarSesion } = useUsuarioStore();
  const router = useRouter();

  const handleLogout = () => {
    cerrarSesion();
    router.push("/login");
  };

  if (!usuario || !esAdmin) {
    return null;
  }

  return (
    <main className="p-6">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 800,
          mx: "auto",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              borderColor: "#d32f2f",
              color: "#d32f2f",
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.08)",
                borderColor: "#b71c1c",
              },
            }}
          >
            Cerrar Sesión
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4, mt: 2 }}>
          <AdminPanelSettings
            sx={{
              fontSize: 40,
              color: "#B99342",
              mr: 2,
            }}
          />
          <Typography variant="h3" component="h1" fontWeight="bold">
            Panel de Administración
          </Typography>
        </Box>

        <Typography variant="h6" color="text.secondary" mb={2}>
          Bienvenido, {usuario.nombre}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Desde aquí puedes gestionar todos los aspectos de tu negocio.
        </Typography>
      </Paper>
    </main>
  );
}
