"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import { Cliente } from "../../hooks/useClientes";
import { useClientes } from "../../hooks/useClientes";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";

export default function MenuClientes() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const { getClientes } = useClientes();
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

  const handleOnClick = (cliente: Cliente) => {
    router.push(`/admin/clientes/${cliente.id}`);
  };

  if (loading) {
    return <Typography textAlign="center">Cargando clientes...</Typography>;
  }

  const clientesFiltrados = clientes.filter((cliente: Cliente) =>
    tab === 0 ? cliente.tipo === "Persona" : cliente.tipo === "Empresa"
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom textAlign="center">
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

      {clientesFiltrados.length === 0 ? (
        <Typography variant="body1" textAlign="center" width="100%">
          No se encontraron clientes
        </Typography>
      ) : (
        clientesFiltrados.map((cliente) => (
          <Accordion key={cliente.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ flex: 1 }}>
                {cliente.tipo === "Persona"
                  ? `${cliente.nombre} ${cliente.apellido}`
                  : cliente.nombreEmpresa}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {cliente.email}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {cliente.tipo === "Persona" && (
                <>
                  <Typography>Nombre: {cliente.nombre}</Typography>
                  <Typography>Apellido: {cliente.apellido}</Typography>
                  <Typography>Mail: {cliente.email}</Typography>
                  <Typography>Departamento: {cliente.departamento}</Typography>
                  <Typography>Ciudad: {cliente.ciudad}</Typography>
                  <Typography>Dirección: {cliente.direccion}</Typography>
                  <Typography>Teléfono: {cliente.telefono}</Typography>
                  <Typography>
                    Observaciones: {cliente.observaciones}
                  </Typography>
                </>
              )}
              {cliente.tipo === "Empresa" && (
                <>
                  <Typography>
                    Nombre empresa: {cliente.nombreEmpresa}
                  </Typography>
                  <Typography>
                    Nombre de contacto: {cliente.nombreContacto}
                  </Typography>
                  <Typography>RUT: {cliente.rut || "No disponible"}</Typography>
                  <Typography>Mail: {cliente.email}</Typography>
                  <Typography>Departamento: {cliente.departamento}</Typography>
                  <Typography>Ciudad: {cliente.ciudad}</Typography>
                  <Typography>Dirección: {cliente.direccion}</Typography>
                  <Typography>Teléfono: {cliente.telefono}</Typography>
                  <Typography>
                    Observaciones: {cliente.observaciones}
                  </Typography>
                </>
              )}
              <Button onClick={() => handleOnClick(cliente)}>
                Ver Más Detalles
              </Button>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}
