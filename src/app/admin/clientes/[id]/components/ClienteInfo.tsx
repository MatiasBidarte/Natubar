"use client";
import { Cliente } from "@/app/hooks/useClientes";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import { Email, Phone, LocationOn, Business } from "@mui/icons-material";

interface ClienteInfoProps {
  cliente: Cliente;
}

const ClienteInfo: React.FC<ClienteInfoProps> = ({ cliente }) => {
  const getInitials = (nombre: string, apellido?: string) => {
    return `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase();
  };

  const esEmpresa = cliente.tipo === "Empresa";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: "#FFF9ED",
        mb: 4,
      }}
    >
      <Box display="flex" alignItems="center" mb={3} gap={2}>
        <Avatar
          sx={{
            bgcolor: "#B99342",
            width: 64,
            height: 64,
            fontSize: "1.5rem",
          }}
        >
          {esEmpresa ? (
            <Business fontSize="large" />
          ) : (
            getInitials(cliente.nombre || "", cliente.apellido || "")
          )}
        </Avatar>
        <Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5" fontWeight="medium">
              {esEmpresa
                ? cliente.nombreEmpresa
                : `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim()}
            </Typography>
            <Chip
              label={cliente.tipo}
              size="small"
              color={esEmpresa ? "primary" : "default"}
              sx={esEmpresa ? { bgcolor: "#B99342" } : {}}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Información de contacto
            </Typography>

            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Email fontSize="small" color="action" />
              <Typography>{cliente.email}</Typography>
            </Box>

            {cliente.telefono && (
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Phone fontSize="small" color="action" />
                <Typography>{cliente.telefono}</Typography>
              </Box>
            )}

            {cliente.direccion && (
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <LocationOn fontSize="small" color="action" />
                <Typography>
                  {cliente.direccion}
                  {cliente.ciudad && `, ${cliente.ciudad}`}
                  {cliente.departamento && `, ${cliente.departamento}`}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {esEmpresa && (
            <Box>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Información de la empresa
              </Typography>
              {cliente.rut && (
                <Box mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    RUT
                  </Typography>
                  <Typography>{cliente.rut}</Typography>
                </Box>
              )}
              {cliente.nombreEmpresa && (
                <Box mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Nombre de la Empresa
                  </Typography>
                  <Typography>{cliente.nombreEmpresa}</Typography>
                </Box>
              )}
              {cliente.nombreContacto && (
                <Box mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Nombre de Contacto
                  </Typography>
                  <Typography>{cliente.nombreContacto}</Typography>
                </Box>
              )}
            </Box>
          )}
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Observaciones
          </Typography>
          <Typography>
            {cliente.observaciones || "No hay observaciones."}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ClienteInfo;
