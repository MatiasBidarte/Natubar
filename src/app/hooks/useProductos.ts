"use client";
import { create } from "zustand";
import { Producto, Sabor } from "../types/producto";
import { generateSHA1 } from "../utils/randomSHA";

interface StoreProductoState {
  products: Producto[];
  sabores: Sabor[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  obtenerProductosParaAdministrador: () => Promise<void>;
  addProduct: (product: Producto) => void;
  getProductById: (id: number) => Producto | undefined;
  getSabores: () => Sabor[] | undefined | Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  crearProducto: (producto: Producto) => Promise<Producto>;
  actualizarProducto: (producto: Producto) => Promise<Producto>;
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

  obtenerProductosParaAdministrador: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/productos/administrador`,
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

  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      const filename = file.name.split(".")[0];
      const stringForSignature = `public_id=${filename}&timestamp=${Math.floor(
        Date.now() / 1000
      )}${process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET}`;
      const signature = await generateSHA1(stringForSignature);
      formData.append("file", file);
      formData.append(
        "api_key",
        `${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}`
      );
      formData.append("public_id", filename);
      formData.append("timestamp", `${Math.floor(Date.now() / 1000)}`);
      formData.append("signature", signature);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      throw new Error("No se pudo subir la imagen");
    }
  },

  crearProducto: async (producto: Producto): Promise<Producto> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/productos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          body: JSON.stringify(producto),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al crear el producto");
      }

      const nuevoProducto = await response.json();

      set((state) => ({
        products: [...state.products, nuevoProducto],
      }));

      return nuevoProducto;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  },

  actualizarProducto: async (producto: Producto): Promise<Producto> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/productos/${producto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          body: JSON.stringify(producto),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al actualizar el producto");
      }

      const productoActualizado = await response.json();

      set((state) => ({
        products: state.products.map((p) =>
          p.id === producto.id ? productoActualizado : p
        ),
      }));

      return productoActualizado;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  },
}));

export default useProductos;
