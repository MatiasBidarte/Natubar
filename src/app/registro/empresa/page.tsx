"use client";
import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";

export default function RegistroEmpresa() {
  const [form, setForm] = useState({
    companyName: "",
    RUT: "",
    contactName: "",
    email: "",
    password: "",
    departament: "",
    city: "",
    adress: "",
    phone: "",
    observations: "",
    discinator: "Empresa",
  });

  const [errors, setErrors] = useState({
    companyName: "",
    RUT: "",
    contactName: "",
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
      companyName: form.companyName
        ? ""
        : "El nombre de la empresa es requerido.",
      RUT: form.RUT ? "" : "El RUT es requerido.",
      contactName: form.contactName
        ? ""
        : "El nombre de contacto es requerido.",
      email: form.email.includes("@") ? "" : "Email inválido.",
      password:
        form.password.length >= 8
          ? ""
          : "La contraseña debe tener al menos 8 caracteres.",
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
      // Aquí podés hacer la lógica de envío real
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: form.email,
        nombreempresa: form.companyName,
        RUT: form.RUT,
        nombrecontacto: form.contactName,
        contrasena: form.password,
        departamento: form.departament,
        ciudad: form.city,
        direccion: form.adress,
        telefono: form.phone,
        observaciones: form.observations,
        discriminador: "Empresa",
      });

      fetch("http://localhost:3001/cliente/", {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
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
            label="Nombre de la empresa"
            name="companyName"
            variant="standard"
            value={form.companyName}
            onChange={handleChange}
            fullWidth
            error={!!errors.companyName}
            helperText={errors.companyName}
          />
          <TextField
            label="RUT"
            name="RUT"
            variant="standard"
            value={form.RUT}
            onChange={handleChange}
            fullWidth
            error={!!errors.RUT}
            helperText={errors.RUT}
          />
          <TextField
            label="Nombre de contacto"
            name="contactName"
            variant="standard"
            value={form.contactName}
            onChange={handleChange}
            fullWidth
            error={!!errors.contactName}
            helperText={errors.contactName}
          />
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Registrarse
          </Button>
        </form>
      </Paper>
    </div>
  );
}
