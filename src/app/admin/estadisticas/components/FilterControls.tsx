"use client";
import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

interface FilterControlsProps {
  onFilterChange: (mes: number | null, anio: number) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ onFilterChange }) => {
  const currentYear = new Date().getFullYear();
  const [mes, setMes] = useState<number | null>(null);
  const [anio, setAnio] = useState<number>(currentYear);

  const handleApplyFilter = () => {
    onFilterChange(mes, anio);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Mes</InputLabel>
        <Select
          value={mes === null ? "" : mes}
          label="Mes"
          onChange={(e) => setMes(e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value={1}>Enero</MenuItem>
          <MenuItem value={2}>Febrero</MenuItem>
          <MenuItem value={3}>Marzo</MenuItem>
          <MenuItem value={4}>Abril</MenuItem>
          <MenuItem value={5}>Mayo</MenuItem>
          <MenuItem value={6}>Junio</MenuItem>
          <MenuItem value={7}>Julio</MenuItem>
          <MenuItem value={8}>Agosto</MenuItem>
          <MenuItem value={9}>Septiembre</MenuItem>
          <MenuItem value={10}>Octubre</MenuItem>
          <MenuItem value={11}>Noviembre</MenuItem>
          <MenuItem value={12}>Diciembre</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 100 }}>
        <InputLabel>Año</InputLabel>
        <Select
          value={anio}
          label="Año"
          onChange={(e) => setAnio(Number(e.target.value))}
        >
          {[...Array(5)].map((_, i) => (
            <MenuItem key={i} value={currentYear - i}>
              {currentYear - i}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={handleApplyFilter}
        sx={{
          bgcolor: "#B99342",
          "&:hover": { bgcolor: "#9A7835" },
          alignSelf: "center",
        }}
      >
        Aplicar Filtro
      </Button>
    </Box>
  );
};

export default FilterControls;
