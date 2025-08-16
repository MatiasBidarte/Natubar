"use client";
import {
    Paper,
    Snackbar,
    Typography,
    Container,
    Grid,
    Button,
    TextField,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Switch,
} from "@mui/material";
import { useState } from "react";
import { es } from 'date-fns/locale';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useNotificaciones from "@/app/hooks/useNotificaciones";
import { NotificacionIndividual } from "@/app/types/suscripcionNotificacion";

export default function MandarNotificacionPage() {
    const [apiError, setApiError] = useState<string | null>(null);
    const [programarFecha, setProgramarFecha] = useState(false);
    const { mandarNotificacion } = useNotificaciones();
    const [form, setForm] = useState<NotificacionIndividual>({
        cabezal: "",
        mensaje: "",
        tipoCliente: "Todos",
        fecha: null,
    });
    const [errors, setErrors] = useState({
        cabezal: "",
        mensaje: "",
        tipoCliente: "",
        fecha: ""
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors });
    };

    const handleFechaChange = (fechas: Date | null) => {
        setForm((prev) => ({
            ...prev,
            fecha: fechas,
        }));
        setErrors((prev) => ({
            ...prev,
            fecha: "",
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = {
            cabezal: form.cabezal ? "" : "El cabezal es requerido.",
            mensaje: form.mensaje ? "" : "El mensaje es requerido.",
            tipoCliente: form.tipoCliente ? "" : "El tipo de cliente es requerido.",
            fecha: programarFecha && !form.fecha ? "La fecha es requerida." : ""

        };
        setErrors(newErrors);
        console.log(errors)
        if (!programarFecha) form.fecha = null;
        const hasErrors = Object.values(newErrors).some((e) => e);
        if (!hasErrors) {
            try {
                await mandarNotificacion(form);
                setApiError(null);

            } catch (error) {
                const errorData = error as { statusCode?: number; message?: string };
                if (errorData.statusCode === 500)
                    setApiError("Error del servidor. Intente más tarde.");
                else if (errorData.statusCode === 409)
                    setApiError(
                        errorData.message ||
                        "Datos inválidos. Por favor, revise los campos."
                    );
                else if (errorData.statusCode === 400)
                    setApiError("Datos inválidos. Por favor, revise los campos.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">

            <Paper
                sx={{ p: 4, width: "100%", maxWidth: 500, borderRadius: 4 }}
                elevation={0}
            >
                {apiError && (
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        open={!!apiError}
                        message={apiError}
                        autoHideDuration={6000}
                        onClose={() => setApiError(null)}
                    />
                )}
                <Container>
                    <Grid>
                        <Typography variant="h4" fontWeight="bold" mb={4}>
                            Mandar notificacion
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid width="100%">
                                    <TextField
                                        fullWidth
                                        label="Cabezal"
                                        variant="outlined"
                                        type="text"
                                        name="cabezal"
                                        onChange={handleChange}
                                        value={form.cabezal}
                                        required
                                        InputProps={{
                                            sx: {
                                                borderRadius: 2,
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid width="100%">
                                    <TextField
                                        fullWidth
                                        label="Mensaje"
                                        variant="outlined"
                                        type="text"
                                        name="mensaje"
                                        onChange={handleChange}
                                        value={form.mensaje}
                                        required
                                        InputProps={{
                                            sx: {
                                                borderRadius: 2,
                                            },
                                        }}
                                    />
                                </Grid>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Tipo cliente</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="tipoCliente"
                                        value={form.tipoCliente}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="Todos" control={<Radio />} label="Todos" />
                                        <FormControlLabel value="Persona" control={<Radio />} label="Persona" />
                                        <FormControlLabel value="Empresa" control={<Radio />} label="Empresa" />
                                    </RadioGroup>
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={programarFecha}
                                            onChange={(e) => setProgramarFecha(e.target.checked)}
                                        />
                                    }
                                    label="Programar fecha"
                                />

                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                    <DatePicker
                                        label="Fecha"
                                        value={form.fecha}
                                        onChange={handleFechaChange}
                                        disabled={!programarFecha}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: programarFecha && !!errors.fecha,
                                                helperText: programarFecha ? errors.fecha : "",

                                            },
                                        }}

                                    />
                                </LocalizationProvider>

                                <Grid width="100%">
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        type="submit"
                                        sx={{
                                            backgroundColor: "#B88A3A",
                                            borderRadius: "999px",
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            "&:hover": {
                                                backgroundColor: "#A97B32",
                                            },
                                        }}
                                    >
                                        {"Mandar notifiacion"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Container>
            </Paper>
        </div >
    );
}
