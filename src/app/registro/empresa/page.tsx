"use client";
import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Snackbar, Box, CircularProgress } from "@mui/material";
import ArrowBack from "@/app/ui/arrowBack";
import { useRouter } from "next/navigation";
import { useClientes } from "@/app/hooks/useClientes";
import { decodeToken } from "@/app/utils/decodeJwt";
import useNotificaciones from "@/app/hooks/useNotificaciones";

export default function RegistroEmpresa() {
  const router = useRouter();
  const { registerClient, loadingClientes } = useClientes();
  const { suscribir, canSubscribe, loadingNotificaciones } = useNotificaciones();
  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombreEmpresa: "",
    rut: "",
    nombreContacto: "",
    email: "",
    contrasena: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    telefono: "",
    observaciones: "",
    tipo: "Empresa",
  });

  const [errors, setErrors] = useState({
    nombreEmpresa: "",
    rut: "",
    nombreContacto: "",
    email: "",
    contrasena: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    telefono: "",
  });

    const renderContent = () => {
    if (loadingClientes || loadingNotificaciones) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: "#B99342" }} />
        </Box>
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      nombreEmpresa: form.nombreEmpresa
        ? ""
        : "El nombre de la empresa es requerido.",
      rut: form.rut ? "" : "El RUT es requerido.",
      nombreContacto: form.nombreContacto
        ? ""
        : "El nombre de contacto es requerido.",
      email: form.email.includes("@") ? "" : "Email inválido.",
      contrasena:
        form.contrasena.length >= 8
          ? ""
          : "La contraseña debe tener al menos 8 caracteres.",
      departamento: form.departamento ? "" : "El departamento es requerido.",
      ciudad: form.ciudad ? "" : "La ciudad es requerida.",
      direccion: form.direccion ? "" : "La dirección es requerida.",
      telefono:
        form.telefono.length < 8
          ? "El teléfono debe tener al menos 8 dígitos."
          : "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (!hasErrors) {
      try {
        const token = await registerClient(form);
        if (!canSubscribe) {
        setApiError("Notificaciones bloqueadas");
      } else {
        await suscribir();
      }
        setApiError(null);
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            ...decodeToken(token.access_token),
            token: token.access_token,
          })
        );
        window.dispatchEvent(new Event("auth-change"));
        router.push("/");
      } catch (error) {
        const errorData = error as { statusCode?: number; message?: string };
        if (errorData.statusCode === 500)
          setApiError("Error del servidor. Intente más tarde.");
        else if (errorData.statusCode === 400)
          setApiError("Datos inválidos. Por favor, revise los campos.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-lg">
      {apiError && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!apiError}
          message={apiError}
          autoHideDuration={6000}
          onClose={() => setApiError(null)}
        />
      )}
      <Paper elevation={0} className="p-8 w-full max-w-md">
        <ArrowBack />
        <Typography variant="h5" className="mb-6 text-center">
          Crear cuenta
        </Typography>
        {renderContent()}
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4">
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="standard"
            value={form.email}
            onChange={handleChange}
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Contraseña"
            name="contrasena"
            type="password"
            variant="standard"
            value={form.contrasena}
            onChange={handleChange}
            error={!!errors.contrasena}
            helperText={errors.contrasena}
          />
          <TextField
            label="Nombre de la empresa"
            name="nombreEmpresa"
            variant="standard"
            value={form.nombreEmpresa}
            onChange={handleChange}
            fullWidth
            error={!!errors.nombreEmpresa}
            helperText={errors.nombreEmpresa}
          />
          <TextField
            label="RUT"
            name="rut"
            variant="standard"
            value={form.rut}
            onChange={handleChange}
            fullWidth
            error={!!errors.rut}
            helperText={errors.rut}
          />
          <TextField
            label="Nombre de contacto"
            name="nombreContacto"
            variant="standard"
            value={form.nombreContacto}
            onChange={handleChange}
            fullWidth
            error={!!errors.nombreContacto}
            helperText={errors.nombreContacto}
          />
          <TextField
            label="Departamento"
            name="departamento"
            variant="standard"
            value={form.departamento}
            onChange={handleChange}
            fullWidth
            error={!!errors.departamento}
            helperText={errors.departamento}
          />
          <TextField
            label="Ciudad"
            name="ciudad"
            variant="standard"
            value={form.ciudad}
            onChange={handleChange}
            fullWidth
            error={!!errors.ciudad}
            helperText={errors.ciudad}
          />
          <TextField
            label="Dirección"
            name="direccion"
            variant="standard"
            value={form.direccion}
            onChange={handleChange}
            fullWidth
            error={!!errors.direccion}
            helperText={errors.direccion}
          />
          <TextField
            label="Teléfono"
            name="telefono"
            variant="standard"
            value={form.telefono}
            onChange={handleChange}
            fullWidth
            error={!!errors.telefono}
            helperText={errors.telefono}
          />
          <TextField
            label="Observaciones"
            name="observaciones"
            variant="outlined"
            value={form.observaciones}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Registrarse
          </Button>
        </form>
      </Paper>
    </div>
  );
}
