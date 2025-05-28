"use client";
import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: form.name ? "" : "El nombre es requerido.",
      email: form.email.includes("@") ? "" : "Email inválido.",
      password:
        form.password.length >= 6
          ? ""
          : "La contraseña debe tener al menos 6 caracteres.",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (!hasErrors) {
      console.log("Formulario enviado:", form);
      // Aquí podés hacer la lógica de envío real
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Paper
        elevation={0}
        className="p-8 w-full max-w-md"
        sx={{ backgroundColor: "inherit" }}
      >
        <Typography variant="h5" className="mb-6 text-center">
          Crear cuenta
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4">
          <TextField
            label="Nombre"
            name="name"
            variant="standard"
            value={form.name}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />
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
            name="password"
            type="password"
            variant="standard"
            value={form.password}
            onChange={handleChange}
            fullWidth
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Registrarse
          </Button>
        </form>
      </Paper>
    </div>
  );
}
