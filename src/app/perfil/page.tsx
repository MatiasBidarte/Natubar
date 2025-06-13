"use client";

import React, { useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeJwt";
import {
  Typography,
  Paper,
  Box,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import {
  Person,
  LocationOn,
  Mail,
  Phone,
  Edit,
  Business,
  AccountCircle,
} from "@mui/icons-material";
import { Client } from "../hooks/useClientes";

const PerfilPage = () => {
  const [usuario, setUsuario] = useState<Partial<Client>>();
  const [editando, setEditando] = useState(false);
  const [formUsuario, setFormUsuario] = useState<Partial<Client>>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("usuario") || "";
      const decoded = decodeToken(token);
      setUsuario(decoded);
      setFormUsuario(decoded);
    }
  }, []);

  const handleEdit = () => {
    setEditando(!editando);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormUsuario({
      ...formUsuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log(formUsuario);
    // setUsuario(formUsuario);
    // localStorage.setItem("usuario", JSON.stringify(formUsuario));
    setEditando(false);
    // Aquí iría la lógica para enviar los cambios al backend
  };

  if (!usuario) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Typography>Cargando perfil...</Typography>
      </Box>
    );
  }

  const esEmpresa = usuario.tipo === "Empresa";

  return (
    <Box className="w-full max-w-4xl mx-auto p-4 pt-24 md:pt-32">
      <Paper elevation={0} className="p-6 rounded-xl bg-[#FFF9ED] mb-6">
        <Typography variant="h6" className="font-semibold text-[#201B21] mb-4">
          Información Personal
        </Typography>
        <Divider className="mb-4" />

        <Box className="flex flex-col">
          <Box className="flex justify-between items-center">
            <Box className="flex items-center gap-3">
              {esEmpresa ? (
                <Business className="text-[#B99342] text-3xl" />
              ) : (
                <AccountCircle className="text-[#B99342] text-3xl" />
              )}
              <Typography variant="h5" className="font-semibold text-[#201B21]">
                {esEmpresa
                  ? usuario.nombreEmpresa
                  : `${usuario.nombre} ${usuario.apellido}`}
              </Typography>
            </Box>

            <Button
              startIcon={<Edit />}
              onClick={handleEdit}
              className="text-[#B99342] hover:text-amber-600"
            >
              {editando ? "Cancelar" : "Editar"}
            </Button>
          </Box>

          {editando ? (
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {esEmpresa ? (
                <>
                  <TextField
                    label="Nombre de empresa"
                    name="nombreEmpresa"
                    value={formUsuario?.nombreEmpresa || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    className="bg-white"
                  />
                  <TextField
                    label="RUT"
                    name="rut"
                    value={formUsuario?.rut || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    className="bg-white"
                  />
                  <TextField
                    label="Nombre de contacto"
                    name="nombreContacto"
                    value={formUsuario?.nombreContacto || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    className="bg-white"
                  />
                </>
              ) : (
                <>
                  <TextField
                    label="Nombre"
                    name="nombre"
                    value={formUsuario?.nombre || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    className="bg-white"
                  />
                  <TextField
                    label="Apellido"
                    name="apellido"
                    value={formUsuario?.apellido || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    className="bg-white"
                  />
                </>
              )}
              <TextField
                label="Email"
                name="email"
                value={formUsuario?.email || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                className="bg-white"
              />
              <TextField
                label="Teléfono"
                name="telefono"
                value={formUsuario?.telefono || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                className="bg-white"
              />
            </Box>
          ) : (
            <Box className="space-y-3 mt-2">
              {esEmpresa && (
                <>
                  <Box className="flex items-center gap-2">
                    <Person className="text-[#B99342]" />
                    <Typography>
                      <span className="font-medium">Contacto:</span>{" "}
                      {usuario.nombreContacto}
                    </Typography>
                  </Box>

                  <Box className="flex items-center gap-2">
                    <Business className="text-[#B99342]" />
                    <Typography>
                      <span className="font-medium">RUT:</span> {usuario.rut}
                    </Typography>
                  </Box>
                </>
              )}

              <Box className="flex items-center gap-2">
                <Mail className="text-[#B99342]" />
                <Typography>
                  <span className="font-medium">Email:</span> {usuario.email}
                </Typography>
              </Box>

              <Box className="flex items-center gap-2">
                <Phone className="text-[#B99342]" />
                <Typography>
                  <span className="font-medium">Teléfono:</span>{" "}
                  {usuario.telefono}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      <Paper elevation={0} className="p-6 rounded-xl bg-[#FFF9ED] mb-6">
        <Typography variant="h6" className="font-semibold text-[#201B21] mb-4">
          Dirección
        </Typography>
        <Divider className="mb-4" />

        <Box className="p-3">
          {editando ? (
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Departamento"
                name="departamento"
                value={formUsuario?.departamento || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                className="bg-white"
              />
              <TextField
                label="Ciudad"
                name="ciudad"
                value={formUsuario?.ciudad || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                className="bg-white"
              />
              <TextField
                label="Dirección"
                name="direccion"
                value={formUsuario?.direccion || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                className="md:col-span-2 bg-white"
              />
            </Box>
          ) : (
            <Box className="flex items-center gap-2">
              <LocationOn className="text-[#B99342]" />
              <Typography>
                <span className="font-medium">Dirección:</span>{" "}
                {usuario.direccion}, {usuario.ciudad}, {usuario.departamento}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {(usuario.observaciones || editando) && (
        <Paper elevation={0} className="p-6 rounded-xl bg-[#FFF9ED] mb-6">
          <Typography
            variant="h6"
            className="font-semibold text-[#201B21] mb-4"
          >
            Observaciones
          </Typography>
          <Divider className="mb-4" />

          <Box className="p-3">
            {editando ? (
              <TextField
                label="Observaciones"
                name="observaciones"
                value={formUsuario?.observaciones || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                size="small"
                className="bg-white"
              />
            ) : (
              <Typography className="italic">
                {usuario.observaciones}
              </Typography>
            )}
          </Box>
        </Paper>
      )}

      {editando && (
        <Box className="flex justify-end mt-4">
          <Button
            variant="contained"
            onClick={handleSave}
            className="bg-[#B99342] hover:bg-amber-600 text-white"
          >
            Guardar cambios
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PerfilPage;
