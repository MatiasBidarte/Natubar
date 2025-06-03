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

export default function RegistroCliente() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    departament: "",
    city: "",
    adress: "",
    phone: "",
    observations: "",
    discinator: "Persona",
  });

  const [errors, setErrors] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    departament: "",
    city: "",
    adress: "",
    phone: "",
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
        form.password.length >= 8
          ? ""
          : "La contraseña debe tener al menos 8 caracteres.",
      lastname: form.lastname ? "" : "El apellido es requerido.",
      departament: form.departament ? "" : "El departamento es requerido.",
      city: form.city ? "" : "La ciudad es requerida.",
      adress: form.adress ? "" : "La dirección es requerida.",
      phone:
        form.phone.length < 8
          ? "El teléfono debe tener al menos 8 dígitos."
          : "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (!hasErrors) {
      console.log("Formulario enviado:", form);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: form.email,
        nombre: form.name,
        apellido: form.lastname,
        contrasena: form.password,
        departamento: form.departament,
        ciudad: form.city,
        direccion: form.adress,
        telefono: form.phone,
        observaciones: form.observations,
        discriminador: "Persona",
      });

      fetch("http://localhost:3001/cliente/", {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.statusCode === 201) {
            setApiError(null);
            router.push("/");
          } else {
            setApiError("Error al crear la cuenta. Intente nuevamente.");
          }
        })
        .catch((error) => {
          if (error.statusCode === 500)
            setApiError("Error del servidor. Intente más tarde.");
          else if (error.statusCode === 400)
            setApiError("Datos inválidos. Por favor, revise los campos.");
        });
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
            name="password"
            type="password"
            variant="standard"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Stack direction="row" spacing={2}>
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
              label="Apellido"
              name="lastname"
              variant="standard"
              value={form.lastname}
              onChange={handleChange}
              fullWidth
              error={!!errors.lastname}
              helperText={errors.lastname}
            />
          </Stack>
          <TextField
            label="Departamento"
            name="departament"
            variant="standard"
            value={form.departament}
            onChange={handleChange}
            fullWidth
            error={!!errors.departament}
            helperText={errors.departament}
          />
          <TextField
            label="Ciudad"
            name="city"
            variant="standard"
            value={form.city}
            onChange={handleChange}
            fullWidth
            error={!!errors.city}
            helperText={errors.city}
          />
          <TextField
            label="Dirección"
            name="adress"
            variant="standard"
            value={form.adress}
            onChange={handleChange}
            fullWidth
            error={!!errors.adress}
            helperText={errors.adress}
          />
          <TextField
            label="Teléfono"
            name="phone"
            variant="standard"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField
            label="Observaciones"
            name="observations"
            variant="outlined"
            value={form.observations}
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
