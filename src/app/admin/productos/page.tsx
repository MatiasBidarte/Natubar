"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { useUsuarioStore } from "@/app/hooks/useUsuarioStore";
import ProductList from "./components/ProductList";
import ProductModal from "./components/ProductModal";
import { Producto } from "@/app/types/producto";
import useProductos from "@/app/hooks/useProductos";

export default function AdminProductosPage() {
  const router = useRouter();
  const { esAdmin, estaLogueado } = useUsuarioStore();
  const {
    products: productos,
    obtenerProductosParaAdministrador,
    loading,
    error,
  } = useProductos();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Producto | null>(null);

  useEffect(() => {
    if (!estaLogueado || !esAdmin) {
      router.push("/");
    }
  }, [estaLogueado, esAdmin, router]);

  useEffect(() => {
    obtenerProductosParaAdministrador();
  }, [obtenerProductosParaAdministrador]);

  useEffect(() => {
    if (!productos) return;

    if (!searchTerm.trim()) {
      setFilteredProducts(productos);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = productos.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(term) ||
          p.descripcion?.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, productos]);

  const handleOpenCreateModal = () => {
    setCurrentProduct(null); // Indicar que es un producto nuevo
    setModalOpen(true);
  };

  const handleOpenEditModal = (producto: Producto) => {
    setCurrentProduct(producto);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Recargar productos después de cerrar el modal para actualizar la lista
    obtenerProductosParaAdministrador();
  };

  if (!estaLogueado || !esAdmin) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", p: 3, my: 4 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Grid>
          <Typography variant="h4" fontWeight="bold">
            Administración de Productos
          </Typography>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenCreateModal}
            sx={{
              bgcolor: "#B99342",
              "&:hover": { bgcolor: "#8E6C1F" },
            }}
          >
            Nuevo Producto
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre, descripción o categoría"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: "white", borderRadius: 1 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress sx={{ color: "#B99342" }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : (
        <ProductList
          productos={filteredProducts}
          onEditClick={handleOpenEditModal}
        />
      )}

      {modalOpen && (
        <ProductModal
          open={modalOpen}
          handleClose={handleCloseModal}
          producto={currentProduct}
        />
      )}
    </Box>
  );
}
