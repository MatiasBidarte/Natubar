"use client";
import { useEffect, useState } from "react";
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAllProducts = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/productos`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || "Error al obtener productos",
          statusCode: errorData.statusCode || 500, 
        };
      }
      const products = await response.json();
      setProducts(products);
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message?: string }).message || "Error desconocido");
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllProducts();
  }, []);

  return { products, loading, error, getAllProducts };

};
