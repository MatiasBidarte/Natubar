"use client";
import { create } from "zustand";
import { Producto, Sabor } from "../types/producto";

interface StoreProductoState {
  products: Producto[];
  sabores: Sabor[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Producto) => void;
  getProductById: (id: number) => Producto | undefined;
  getSabores: () => Sabor[] | undefined | Promise<void>;
}

const useProductos = create<StoreProductoState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  sabores: [],
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/productos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          redirect: "follow",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener productos");
      }

      const data = await response.json();
      set({ products: data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },

  addProduct: (product: Producto) =>
    set((state) => ({ products: [...state.products, product] })),

  getProductById: (id: number) =>
    get().products.find((product) => product.id === id),

  getSabores: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/sabores`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          redirect: "follow",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener los sabores");
      }

      const data = await response.json();
      set({ sabores: data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
}));

export default useProductos;
