"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBack from "@/app/ui/arrowBack";
import { useClients } from "@/app/hooks/useClients";

export default function RegistroCliente() {
  const router = useRouter();
  const { registerClient } = useClients();
  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    telefono: "",
    observaciones: "",
    discriminador: "Persona",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    telefono: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      nombre: form.nombre ? "" : "El nombre es requerido.",
      email: form.email.includes("@") ? "" : "Email inválido.",
      contrasena:
        form.contrasena.length >= 8
          ? ""
          : "La contraseña debe tener al menos 8 caracteres.",
      apellido: form.apellido ? "" : "El apellido es requerido.",
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
        await registerClient(form);
        setApiError(null);
        localStorage.setItem("user", JSON.stringify(form));
        router.push("/");
      } catch (error) {
        const errorData = error as { statusCode?: number; message?: string };
        if (errorData.statusCode === 500)
          setApiError("Error del servidor. Intente más tarde.");
        else if (errorData.statusCode === 409)setApiError(errorData.message || "Datos inválidos. Por favor, revise los campos.")
        else if (errorData.statusCode === 400)
          setApiError("Datos inválidos. Por favor, revise los campos.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
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
        elevation={0}
        className="p-8 w-full max-w-md"
        sx={{ backgroundColor: "inherit" }}
      >
        <ArrowBack />
        <Typography variant="h5" className="mb-6 text-center">
          Crear cuenta
        </Typography>
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
          <Stack direction="row" spacing={2}>
            <TextField
              label="Nombre"
              name="nombre"
              variant="standard"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
            <TextField
              label="Apellido"
              name="apellido"
              variant="standard"
              value={form.apellido}
              onChange={handleChange}
              fullWidth
              error={!!errors.apellido}
              helperText={errors.apellido}
            />
          </Stack>
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
