"use client";

import { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Edit, MoreVert, Visibility, VisibilityOff } from "@mui/icons-material";
import { Producto } from "@/app/types/producto";
import Image from "next/image";
import useProductos from "@/app/hooks/useProductos";

interface ProductListProps {
  productos: Producto[];
  onEditClick: (producto: Producto) => void;
}

export default function ProductList({
  productos,
  onEditClick,
}: ProductListProps) {
  const { actualizarProducto } = useProductos();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    producto: Producto
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(producto);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleToggleActivo = async () => {
    if (selectedProduct) {
      await actualizarProducto({
        ...selectedProduct,
        estaActivo: !selectedProduct.estaActivo,
      });
    }
    handleClose();
  };

  if (productos.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No se encontraron productos
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="subtitle1">
          {productos.length} productos encontrados
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={viewMode === "list"}
              onChange={() =>
                setViewMode(viewMode === "grid" ? "list" : "grid")
              }
              color="primary"
            />
          }
          label="Vista detallada"
        />
      </Box>

      {viewMode === "grid" ? (
        <Grid container spacing={3}>
          {productos.map((producto) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={producto.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  opacity: producto.estaActivo ? 1 : 0.6,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3,
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "80%",
                    width: "100%",
                  }}
                >
                  {producto.urlImagen ? (
                    <Image
                      src={producto.urlImagen}
                      alt={producto.nombre || "Producto"}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "grey.300",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography color="text.secondary">Sin imagen</Typography>
                    </Box>
                  )}

                  {!producto.estaActivo && (
                    <Chip
                      icon={<VisibilityOff fontSize="small" />}
                      label="Inactivo"
                      color="default"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: "rgba(0,0,0,0.7)",
                        color: "white",
                      }}
                    />
                  )}

                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(255,255,255,0.8)",
                    }}
                    onClick={(e) => handleMenuClick(e, producto)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom noWrap>
                    {producto.nombre}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Precio para personas:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ${producto.precioPersonas.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Precio para empresas:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ${producto.precioEmpresas.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <IconButton
                    color="primary"
                    sx={{ width: "100%", borderRadius: 1, bgcolor: "#F5F5F5" }}
                    onClick={() => onEditClick(producto)}
                  >
                    <Edit sx={{ mr: 1 }} /> Editar
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          component="table"
          sx={{ width: "100%", borderCollapse: "collapse" }}
        >
          <Box component="thead" sx={{ bgcolor: "#F5F5F5" }}>
            <Box component="tr">
              <Box component="th" sx={{ p: 2, textAlign: "left" }}>
                Producto
              </Box>
              <Box component="th" sx={{ p: 2, textAlign: "center" }}>
                Precio para personas
              </Box>
              <Box component="th" sx={{ p: 2, textAlign: "center" }}>
                Precio para empresas
              </Box>
              <Box component="th" sx={{ p: 2, textAlign: "center" }}>
                Estado
              </Box>
              <Box component="th" sx={{ p: 2, textAlign: "center" }}>
                Acciones
              </Box>
            </Box>
          </Box>
          <Box component="tbody">
            {productos.map((producto) => (
              <Box
                component="tr"
                key={producto.id}
                sx={{
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                  opacity: producto.estaActivo ? 1 : 0.7,
                }}
              >
                <Box
                  component="td"
                  sx={{ p: 2, borderBottom: "1px solid #eee" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        position: "relative",
                        width: 60,
                        height: 60,
                        mr: 2,
                      }}
                    >
                      {producto.urlImagen ? (
                        <Image
                          src={producto.urlImagen}
                          alt={producto.nombre || ""}
                          fill
                          style={{ objectFit: "cover", borderRadius: "4px" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: "grey.300",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="caption">Sin imagen</Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography>{producto.nombre}</Typography>
                  </Box>
                </Box>
                <Box
                  component="td"
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderBottom: "1px solid #eee",
                  }}
                ></Box>
                <Box
                  component="td"
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  ${producto.precioPersonas.toFixed(2)}
                </Box>
                <Box
                  component="td"
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  ${producto.precioEmpresas.toFixed(2)}
                </Box>
                <Box
                  component="td"
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Chip
                    icon={
                      producto.estaActivo ? (
                        <Visibility fontSize="small" />
                      ) : (
                        <VisibilityOff fontSize="small" />
                      )
                    }
                    label={producto.estaActivo ? "Activo" : "Inactivo"}
                    color={producto.estaActivo ? "success" : "default"}
                    size="small"
                  />
                </Box>
                <Box
                  component="td"
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => onEditClick(producto)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="default"
                    onClick={(e) => handleMenuClick(e, producto)}
                    size="small"
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            onEditClick(selectedProduct!);
            handleClose();
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar producto</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleActivo}>
          <ListItemIcon>
            {selectedProduct?.estaActivo ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedProduct?.estaActivo
              ? "Desactivar producto"
              : "Activar producto"}
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
