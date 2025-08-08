"use client";

import { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Grid, Paper } from "@mui/material";
import { Cliente } from "../../hooks/useClientes";
import { useClientes } from "../../hooks/useClientes"


export default function MenuClientes() {
  const [tab, setTab] = useState(0);
  const {getClientes} = useClientes();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const data = await getClientes();
        setClientes(data ?? []);
      } catch (error) {
        console.error("Error al obtener clientes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) {
  return <Typography textAlign="center">Cargando clientes...</Typography>;
    }
  console.log(clientes);
  
  const clientesFiltrados = clientes.filter((cliente: Cliente) =>
    tab === 0 ? cliente.tipo === "PERSONA" : cliente.tipo === "EMPRESA"
  );

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
      >
        Clientes Registrados
      </Typography>

      <Tabs
        value={tab}
        onChange={handleChange}
        centered
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Clientes Persona" />
        <Tab label="Clientes Empresa" />
      </Tabs>

      <Grid container spacing={2}>
        {clientesFiltrados.length === 0 ? (
          <Typography variant="body1" textAlign="center" width="100%">
            No se encontraron clientes
          </Typography>
        ) : (
          clientesFiltrados.map((cliente: Cliente) => (
            <Grid item xs={12} sm={6} md={4} key={cliente.id}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">{cliente.nombre}</Typography>
                <Typography variant="body2">Correo: {cliente.email}</Typography>
                {cliente.tipo === "EMPRESA" && (
                  <>
                    <Typography variant="body2">
                      Empresa: {cliente.nombreEmpresa}
                    </Typography>
                    <Typography variant="body2">
                      RUT: {cliente.rut || "No disponible"}
                    </Typography>
                  </>
                )}
                {cliente.tipo === "PERSONA" && (
                  <Typography variant="body2">
                    NOMBRE: {cliente.nombre || "No disponible"}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
