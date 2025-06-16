"use client";

import { Paper, Snackbar, Typography, Container, Grid, Button } from "@mui/material";
import { useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import Image from "next/image";
import IconCarrito from "../../components/IconCarrito";
import useProductos from "../../hooks/useProductos";
import { useParams } from "next/navigation";

export default function  DetalleProducto () {
    const params = useParams();
    const [apiError, setApiError] = useState<string | null>(null);
    const { getProductById } = useProductos();
    const product = getProductById(Number(params.id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography variant="h6">Producto no encontrado.</Typography>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      {apiError && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!apiError}
          message={apiError}
          autoHideDuration={6000}
          onClose={() => setApiError(null)}
        />
      )}     
        <Paper sx={{ p: 2, width: '100%' }}>
            <Container>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Typography variant="h5" className="mb-6 text-center">
                            {product.nombre}
                        </Typography>
                    </Grid>
                    <Grid size={4}>
                        <Image
                        src={product.urlImagen ?? ""}
                        alt="imagen de producto"
                        width={300}
                        height={300}
                        style={{ objectFit: "contain" }}
                        />
                    </Grid>
                    <Grid size={8}>
                        <Typography>
                            {product.descripcion}
                        </Typography>
                        <Button size="small" variant="contained">
                            <IconCarrito/>
                            Agregar al carrito
                        </Button>
                    </Grid>
                    
                </Grid>
            </Container>
        </Paper>
      <ArrowBack />
       
    </div>
  );
};