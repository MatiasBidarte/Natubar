"use client";
import { Button, Skeleton, Stack } from "@mui/material";
import ProductCard from "./components/card";
import useProducts from "./hooks/useProductsStore";
import { Product } from "./types/product";
import { useEffect, useState } from "react";
import { homemadeApple } from "./ui/fonts";
import ModalCard from "./components/modalCard";

interface ModalCard {
  open: boolean;
  handleClose: () => void;
  producto: Product;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => void;
}

export default function Home() {
  const { products, fetchProducts, loading, error } = useProducts() as UseProductsReturn;
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpen = (producto: Product): void => {
    setSelectedProduct(producto);
    setOpen(true);
  };

  const handleClose = (): void => setOpen(false);

  return (
    <div className=" md:border-amber-600">
      <div className="portada flex items-center justify-center">
        <div className="text-center">
          <h1 className={homemadeApple.className}>La felicidad en barra</h1>
          <h2>NatuBar Barras Artesanales</h2>
          <Button className="btn-portada">
            Comprar ahora
          </Button>
        </div>
      </div>
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        direction="row"
        useFlexGap
        sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {loading ? (
          <>
            <Skeleton sx={{ bgcolor: 'grey.900' }} variant="rounded" width={313.021} height={400} />
            <Skeleton sx={{ bgcolor: 'grey.900' }} variant="rounded" width={313.021} height={400} />
            <Skeleton sx={{ bgcolor: 'grey.900' }} variant="rounded" width={313.021} height={400} />
          </>
        ) : (
          error ? (
            <p>Error: {error}</p>
          ) : (
            products.map((producto: Product) => (
              <div key={producto.id} onClick={() => handleOpen(producto)}>
                <ProductCard product={producto} />
              </div>
            ))
          )
        )}
        {selectedProduct && (
          <ModalCard
            open={open}
            handleClose={handleClose}
            producto={selectedProduct}
          />
        )}
      </Stack>
    </div>
  );
}
