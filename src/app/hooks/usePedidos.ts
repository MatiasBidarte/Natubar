"use client";
import { create } from "zustand";
import { Pedido } from "../types/pedido";

interface StorePedidoState {
  pedidos: Pedido[];
  loading: boolean;
  error: string | null;
  fetchPedidos: () => Promise<void>;
  addPedido: (pedido: Pedido) => void;
  getPedidoById: (id: number) => Pedido | undefined;
}

const usePedidos = create<StorePedidoState>((set, get) => ({
  pedidos: [],
  loading: false,
  error: null,

  fetchPedidos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/pedidos`,
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
      set({ pedidos: data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },

  addPedido: (pedido: Pedido) =>
    set((state) => ({ pedidos: [...state.pedidos, pedido] })),

  getPedidoById: (id: number) =>
    get().pedidos.find((pedido) => pedido.id === id),
}));

export default usePedidos;
