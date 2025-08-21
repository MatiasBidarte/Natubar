"use client";

import {
  Paper,
  Snackbar,
  Typography,
  Container,
  Grid,
  Button,
  TextField,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClientes } from "@/app/hooks/useClientes";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { decodeToken } from "@/app/utils/decodeJwt";
import useNotificaciones from "../hooks/useNotificaciones";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginClient } = useClientes();
  const { suscribir } = useNotificaciones();
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    contrasena: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await loginClient(form);
      setApiError(null);
      const usuarioParsed = JSON.parse(
        JSON.stringify({
          ...decodeToken(token.access_token),
          token: token.access_token,
        })
      );
      localStorage.setItem("usuario", JSON.stringify(usuarioParsed));
      window.dispatchEvent(new Event("auth-change"));
      await suscribir();
      if(usuarioParsed.tipo == "Administrador"){
        router.push("/admin/")
      }else{
        router.push("/");
      }
    } catch (error) {
      const errorData = error as { statusCode?: number; message?: string };
      if (errorData.statusCode === 500)
        setApiError("Error del servidor. Intente más tarde.");
      else if (errorData.statusCode === 400 || errorData.statusCode === 401)
        setApiError(`${errorData.message}`);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      {apiError && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!apiError}
          message={apiError}
          autoHideDuration={6000}
          onClose={() => setApiError(null)}
        />
      )}

      <Paper
        sx={{ p: 4, width: "100%", maxWidth: 500, borderRadius: 4 }}
        elevation={0}
      >
        <Container>
          <Grid container spacing={3} justifyContent="center">
            <Grid textAlign="center">
              <Typography variant="h6" fontWeight={500} gutterBottom>
                Iniciar Sesión
              </Typography>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Bienvenido a NatuBar
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                ¡Iniciá sesión y disfrutá de las barras más ricas y saludables
                de Montevideo!
              </Typography>
            </Grid>

            <Grid>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid width="100%">
                    <TextField
                      fullWidth
                      label="Correo Electrónico"
                      variant="outlined"
                      type="email"
                      name="email"
                      placeholder="ejemplo@ejemplo.com"
                      onChange={handleChange}
                      value={form.email}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid width="100%">
                    <TextField
                      fullWidth
                      label="Contraseña"
                      variant="outlined"
                      name="contrasena"
                      type={showPassword ? "text" : "password"}
                      placeholder="* * * * *"
                      value={form.contrasena}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>

                  <Grid textAlign="right">
                    <Link href="/" variant="body2" sx={{ color: "#7B1FA2" }}>
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </Grid>

                  <Grid width="100%">
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      type="submit"
                      sx={{
                        backgroundColor: "#B88A3A",
                        borderRadius: "999px",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#A97B32",
                        },
                      }}
                    >
                      {"Iniciar Sesión"}
                    </Button>
                  </Grid>

                  <Grid textAlign="center">
                    <Typography variant="body2">
                      ¿No tienes una cuenta?{" "}
                      <Link
                        href="/registro"
                        sx={{ color: "#7B1FA2", fontWeight: "bold" }}
                      >
                        Regístrate aquí
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </div>
  );
}
