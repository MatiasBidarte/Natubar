"use client";
import { Box, Typography, Paper, Button, Divider, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

export default function TransferenciaForm() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/perfil/compras");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 2,
        backgroundColor: "#FFF9ED",
        maxWidth: 600,
        mx: "auto",
        mt: 2,
      }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <AccountBalanceIcon sx={{ fontSize: 40, color: "#B99342", mr: 2 }} />
        <Typography variant="h5" fontWeight="medium">
          Datos para transferencia bancaria
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="body1" mb={3}>
        Realizá la transferencia a la siguiente cuenta:
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Banco
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              ITAU
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Número de cuenta
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              4724059
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Titular
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              Natalia Duran
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Tipo de cuenta
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              Caja de ahorro - Pesos uruguayos
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: "rgba(185, 147, 66, 0.1)",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="body2">
          Una vez realizada la transferencia, envianos el comprobante al{" "}
          <Typography component="span" fontWeight="bold">
            099916215
          </Typography>{" "}
        </Typography>
      </Paper>

      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="contained"
          onClick={handleRedirect}
          sx={{
            backgroundColor: "#B99342",
            borderRadius: "24px",
            px: 4,
            py: 1.5,
            "&:hover": {
              backgroundColor: "#8B7031",
            },
          }}
        >
          Ver en mis compras
        </Button>
      </Box>
    </Paper>
  );
}
