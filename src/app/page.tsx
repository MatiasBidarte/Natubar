"use client";
import { Button, Skeleton, Stack } from "@mui/material";
import ProductCard from "./components/card";
import useProducts from "./hooks/useProductsStore";
import { Product } from "./types/product";
import { useEffect } from "react";

export default function Home() {
  const { products, fetchProducts, loading, error } = useProducts() as { products: Product[]; loading: boolean; error: string | null; fetchProducts: () => void };
    useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);



 

  return (
    <div className=" md:border-amber-600">
      <div className="portada flex items-center justify-center">
        <div className="text-center">
           <h1 className="text-3xl font-bold  ">La felicidad en barra</h1>
           <h2>NatuBar Barras Artesanales</h2>
            <Button className="btn-portada">
              Comprar ahora
            </Button>
        </div>
      </div>
        <Stack
        spacing={{ xs: 1, sm: 2 ,}}
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
                    products.map((product: Product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  )
                )}
        
        </Stack>     
    </div>
  );
}
