"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  FormControlLabel,
  Switch,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { Close, CloudUpload, Delete } from "@mui/icons-material";
import { Producto } from "@/app/types/producto";
import useProductos from "@/app/hooks/useProductos";
import Image from "next/image";

interface ProductModalProps {
  open: boolean;
  handleClose: () => void;
  producto: Producto | null;
}

export default function ProductModal({
  open,
  handleClose,
  producto,
}: ProductModalProps) {
  const { crearProducto, actualizarProducto, uploadImage } = useProductos();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<Producto>({
    id: 0,
    nombre: "",
    descripcion: "",
    precioPersonas: 0,
    precioEmpresas: 0,
    urlImagen: "",
    estaActivo: true,
    esCajaDeBarras: false,
    costoProduccion: 0,
    cantidadDeBarras: 0,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (producto) {
      setFormData({
        ...producto,
      });

      if (producto.urlImagen) {
        setImagePreview(producto.urlImagen);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precioPersonas: 0,
        precioEmpresas: 0,
        urlImagen: "",
        estaActivo: true,
        esCajaDeBarras: false,
        costoProduccion: 0,
        cantidadDeBarras: 0,
      });
      setImagePreview(null);
    }

    setError(null);
    setSuccess(null);
  }, [producto]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({
      ...formData,
      urlImagen: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let finalImageUrl = formData.urlImagen;

      if (selectedImage) {
        const imageUrl = await uploadImage(selectedImage);
        finalImageUrl = imageUrl;
      }

      const updatedData = {
        ...formData,
        urlImagen: finalImageUrl,
      };

      if (producto) {
        await actualizarProducto(updatedData);
        setSuccess("Producto actualizado correctamente");
      } else {
        await crearProducto(updatedData);
        setSuccess("Producto creado correctamente");

        setFormData({
          id: 0,
          nombre: "",
          descripcion: "",
          precioPersonas: 0,
          precioEmpresas: 0,
          urlImagen: "",
          estaActivo: true,
          esCajaDeBarras: false,
          costoProduccion: 0,
          cantidadDeBarras: 0,
        });
        setImagePreview(null);
        setSelectedImage(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar el producto"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="product-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          maxWidth: 800,
          width: "95%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            zIndex: 1,
          }}
        >
          <Typography id="product-modal-title" variant="h6">
            {producto ? "Editar Producto" : "Crear Nuevo Producto"}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            overflowY: "auto",
            flex: 1,
            p: 3,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="nombre"
                label="Nombre del Producto"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="precioPersonas"
                label="Precio para personas"
                type="number"
                value={formData.precioPersonas}
                onChange={handleNumberChange}
                required
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="precioEmpresas"
                label="Precio para empresas"
                type="number"
                value={formData.precioEmpresas}
                onChange={handleNumberChange}
                required
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="costoProduccion"
                label="Costo de producción"
                type="number"
                value={formData.costoProduccion}
                onChange={handleNumberChange}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                name="descripcion"
                label="Descripción"
                value={formData.descripcion || ""}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" gutterBottom>
                Imagen del Producto
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ mr: 2 }}
                >
                  Seleccionar Imagen
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>

                {(imagePreview || formData.urlImagen) && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemoveImage}
                    startIcon={<Delete />}
                  >
                    Eliminar Imagen
                  </Button>
                )}
              </Box>

              {imagePreview && (
                <Box
                  sx={{
                    mt: 2,
                    position: "relative",
                    width: "100%",
                    maxWidth: 300,
                    height: 200,
                    mx: "auto",
                  }}
                >
                  <Image
                    src={imagePreview}
                    alt="Vista previa"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" gutterBottom>
                Configuración adicional
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="estaActivo"
                      checked={formData.estaActivo}
                      onChange={handleSwitchChange}
                    />
                  }
                  label="Producto Activo"
                />

                <FormControlLabel
                  control={
                    <Switch
                      name="esCajaDeBarras"
                      checked={formData.esCajaDeBarras}
                      onChange={handleSwitchChange}
                    />
                  }
                  label="Es caja de barras"
                />
              </Stack>

              {formData.esCajaDeBarras && (
                <>
                  <TextField
                    name="cantidadDeBarras"
                    label="Cantidad de barras en la caja"
                    type="number"
                    value={formData.cantidadDeBarras}
                    onChange={handleNumberChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Las cajas de barras permiten al cliente seleccionar
                    diferentes sabores. Especifica cuántas barras contiene cada
                    caja.
                  </Alert>
                </>
              )}
            </Grid>

            {producto && (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Información del sistema:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Chip size="small" label={`ID: ${producto.id}`} />
                    <Chip
                      size="small"
                      color={producto.estaActivo ? "success" : "default"}
                      label={producto.estaActivo ? "Activo" : "Inactivo"}
                    />
                    {producto.esCajaDeBarras && (
                      <Chip
                        size="small"
                        color="primary"
                        label="Caja de barras"
                      />
                    )}
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
            position: "sticky",
            bottom: 0,
            bgcolor: "background.paper",
            zIndex: 1,
          }}
        >
          <Button onClick={handleClose} sx={{ mr: 2 }} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={(e) => handleSubmit(e as any)}
            sx={{
              bgcolor: "#B99342",
              "&:hover": { bgcolor: "#8E6C1F" },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : producto ? (
              "Guardar Cambios"
            ) : (
              "Crear Producto"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
