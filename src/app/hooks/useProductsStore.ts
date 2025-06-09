"use client";
import { create } from "zustand";
import { Product } from "../types/product";

interface StoreProductoState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => void;
  getProductById: (id: number) => Product | undefined;
}

const useProductStore = create<StoreProductoState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/productos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener productos");
      }

      const data = await response.json();
      set({ products: data, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Error desconocido", loading: false });
    }
  },

  addProduct: (product: Product) => set((state) => ({ products: [...state.products, product] })),

  getProductById: (id: number) => get().products.find((product) => product.id === id),
}));

export default useProductStore;