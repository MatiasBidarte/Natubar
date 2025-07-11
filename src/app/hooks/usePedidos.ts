import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { lineaCarrito, NuevaLineaCarrito } from "../types/lineaCarrito";
import { EstadosPedido, Pedido } from "../types/pedido";

interface PedidoState {
  items: lineaCarrito[];
  addToCart: (item: NuevaLineaCarrito) => void;
  removeFromCart: (index: number) => void;
  updateCartItem: (index: number, item: lineaCarrito) => void;
  updateCantidad: (numeral: number, sumar: number) => void;
  clearCart: () => void;

  pedidos: Pedido[];
  pedidosEnCurso: Pedido[];
  pedidosFinalizados: Pedido[];
  loadingPedidos: boolean;
  errorPedidos: string | null;

  fetchPedidosCliente: (clienteId: string) => Promise<void>;
  fetchPedidos: () => Promise<void>;
  crearPedido: (clienteId: string) => Promise<Pedido | undefined>;
}

let ultimoNumeral = 1;

export const usePedidos = create(
  devtools<PedidoState>((set, get) => ({
    items: [],
    addToCart: (item: NuevaLineaCarrito) => {
      const itemConNumeral = { ...item, numeral: ultimoNumeral++ };
      set((state) => ({
        items: [...state.items, itemConNumeral],
      }));
    },
    removeFromCart: (index: number) =>
      set((state) => ({
        items: state.items.filter((_, i) => i !== index),
      })),
    updateCartItem: (index: number, item: lineaCarrito) =>
      set((state) => {
        const newItems = [...state.items];
        newItems[index] = item;
        return { items: newItems };
      }),
    updateCantidad: (numeral, sumar) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.numeral === numeral
            ? { ...item, cantidad: item.cantidad + sumar }
            : item
        ),
      })),
    clearCart: () => set({ items: [] }),

    pedidos: [],
    pedidosEnCurso: [],
    pedidosFinalizados: [],
    loadingPedidos: false,
    errorPedidos: null,

    fetchPedidosCliente: async (clienteId: string) => {
      set({ loadingPedidos: true, errorPedidos: null });

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/clientes/${clienteId}/pedidos`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Error al obtener pedidos");
        }
        const pedidos = (await response.json()) as Pedido[];
        const enCurso = pedidos.filter(
          (p) =>
            p.estado === EstadosPedido.enPreparacion ||
            p.estado === EstadosPedido.enCamino
        );
        const finalizados = pedidos.filter(
          (p) =>
            p.estado === EstadosPedido.entregado ||
            p.estado === EstadosPedido.pendientePago
        );

        set({
          pedidos,
          pedidosEnCurso: enCurso,
          pedidosFinalizados: finalizados,
          loadingPedidos: false,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        set({
          errorPedidos: errorMessage,
          loadingPedidos: false,
        });
      }
    },

    crearPedido: async (clienteId: string) => {
      const { items } = get();
      if (items.length === 0) return;

      try {
        const pedidoData = {
          clienteId,
          items: items.map((item) => ({
            productoId: item.producto.id,
            cantidad: item.cantidad,
            sabores: item.sabores.map((s) => ({
              saborId: s.sabor.id,
              cantidad: s.cantidad,
            })),
          })),
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/pedidos`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
            },
            body: JSON.stringify(pedidoData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Error al crear pedido");
        }

        const nuevoPedido = (await response.json()) as Pedido;
        get().clearCart();
        await get().fetchPedidosCliente(clienteId);

        return nuevoPedido;
      } catch (error) {
        console.error("Error al crear pedido:", error);
        throw error;
      }
    },
    fetchPedidos: async () => {
      set({ loadingPedidos: true, errorPedidos: null });
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
        set({ pedidos: data, loadingPedidos: false });
      } catch (err) {
        set({
          errorPedidos: err instanceof Error ? err.message : "Error desconocido",
          loadingPedidos: false,
        });
      }
    },
  }))
);

export default usePedidos;
