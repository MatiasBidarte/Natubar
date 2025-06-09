"use client";
import { Skeleton, Stack } from "@mui/material";
import ProductCard from "./components/card";
import { useProducts } from "./hooks/useProducts";
import { Product } from "./types/product";

export default function Home() {
  const { products, loading, error } = useProducts() as { products: Product[]; loading: boolean; error: string | null };
  console.log(products)

  if (error) return <p>Error: {error}</p>;

  return (
    <div className=" md:border-amber-600">
      <h1 className="text-3xl font-bold  border">Pagina de inicio de la aplicación.</h1>
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
                  products.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
        
        </Stack>     
    </div>
  );
}
