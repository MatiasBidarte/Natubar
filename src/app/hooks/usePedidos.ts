import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CrearPedidoDto, LineaCarrito } from "../types/lineaCarrito";
import { EstadosPagoPedido, EstadosPedido, Pedido } from "../types/pedido";

interface PedidoState {
  calcularCostoEnvio: () => number;
  crearPedidoEnStore: (
    observaciones: string,
    montoTotal: number,
    clienteId: string
  ) => void;
  addToCart: (item: LineaCarrito) => void;
  removeFromCart: (index: number) => void;
  updateCartItem: (index: number, item: LineaCarrito) => void;
  updateCantidad: (numeral: number, sumar: number) => void;
  clearCart: () => void;

  items: LineaCarrito[];
  pedido?: CrearPedidoDto;
  pedidos: Pedido[];
  pedidosEnCurso: Pedido[];
  pedidosFinalizados: Pedido[];
  loadingPedidos: boolean;
  errorPedidos: string | null;

  fetchPedidosCliente: (clienteId: string) => Promise<void>;
  fetchPedidos: (estado: EstadosPedido) => Promise<void>;
  crearPedido: (
    clienteId: string,
    observaciones: string
  ) => Promise<Pedido | undefined>;
  cambiarEstado(estado: EstadosPedido, pedido: number): Promise<void>;
  cambiarEstadoPago(estado: EstadosPagoPedido, pedido: number): Promise<void>;
  actualizarPedidoEnStore: ({
    pedidosEnCurso,
    pedidosFinalizados,
  }: {
    pedidosEnCurso: Pedido[];
    pedidosFinalizados: Pedido[];
  }) => void;
  actualizarEstadoPedido: (
    pedidoId: number,
    nuevoEstado: EstadosPedido
  ) => Promise<void>;
}

let ultimoNumeral = 1;

export const usePedidos = create(
  devtools<PedidoState>((set, get) => ({
    items: [],
    addToCart: (item: LineaCarrito) => {
      const state = get();

      const mismoProducto = (a: LineaCarrito, b: LineaCarrito) =>
        a.producto.id === b.producto.id &&
        a.sabores.length === b.sabores.length &&
        a.sabores.every((saborA) =>
          b.sabores.some(
            (saborB) =>
              saborA.sabor.id === saborB.sabor.id &&
              saborA.cantidad === saborB.cantidad
          )
        );

      const itemExistente = state.items.find((i) => mismoProducto(i, item));

      if (itemExistente) {
        set((state) => ({
          items: state.items.map((i) =>
            mismoProducto(i, item)
              ? { ...i, cantidad: i.cantidad + item.cantidad }
              : i
          ),
        }));
      } else {
        const itemConNumeral: LineaCarrito = {
          ...item,
          numeral: ultimoNumeral++,
        };
        set((state) => ({
          items: [...state.items, itemConNumeral],
        }));
      }
    },
    removeFromCart: (numeral: number) =>
      set((state) => ({
        items: state.items.filter((item) => item.numeral !== numeral),
      })),
    updateCartItem: (index: number, item: LineaCarrito) =>
      set((state) => {
        const newItems = [...state.items];
        newItems[index] = item;
        return { items: newItems };
      }),
    updateCantidad: (numeral, sumar) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.numeral === numeral ? { ...item, cantidad: sumar } : item
        ),
      })),
    clearCart: () => set({ items: [], pedido: undefined }),

    pedidos: [],
    pedidosEnCurso: [],
    pedidosFinalizados: [],
    loadingPedidos: false,
    errorPedidos: null,

    crearPedidoEnStore: (
      observaciones: string,
      montoTotal: number,
      clienteId: string
    ) => {
      const { items } = get();
      if (items.length === 0) return;
      const pedidoData: CrearPedidoDto = {
        observaciones,
        productos: items,
        montoTotal,
        cliente: {
          id: clienteId,
        },
      };
      set({ pedido: pedidoData });
    },
    calcularCostoEnvio: () => {
      const { items } = get();
      const subtotal = items.reduce(
        (acc, item) => acc + item.producto.precioPersonas * item.cantidad,
        0
      );
      const envio = Number(process.env.NEXT_PUBLIC_VALOR_ENVIO || 0);
      const costoParaEnvio = Number(
        process.env.NEXT_PUBLIC_VALOR_MINIMO_PARA_ENVIO || 0
      );
      return subtotal >= costoParaEnvio ? 0 : envio;
    },

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
          pedidos: pedidos,
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
    fetchPedidos: async (estado: EstadosPedido) => {
      set({ loadingPedidos: true, errorPedidos: null });
      try {
        const pedidosExistentes = [
          ...get().pedidosEnCurso,
          ...get().pedidosFinalizados,
        ];
        const yaTenemosEstado = pedidosExistentes.some(
          (p) => p.estado === estado
        );

        if (yaTenemosEstado) {
          set({ loadingPedidos: false });
          return;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/pedidos/PedidosPorEstado/${estado}`,
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
        const pedidosNuevos = (await response.json()) as Pedido[];
        if (
          estado === EstadosPedido.enPreparacion ||
          estado === EstadosPedido.enCamino
        ) {
          set((state) => ({
            pedidosEnCurso: [
              ...state.pedidosEnCurso.filter((p) => p.estado !== estado),
              ...pedidosNuevos,
            ],
          }));
        } else if (
          estado === EstadosPedido.entregado ||
          estado === EstadosPedido.pendientePago
        ) {
          set((state) => ({
            pedidosFinalizados: [
              ...state.pedidosFinalizados.filter((p) => p.estado !== estado),
              ...pedidosNuevos,
            ],
          }));
        }

        set({ loadingPedidos: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        set({
          errorPedidos: errorMessage,
          loadingPedidos: false,
        });
      }
    },
    actualizarEstadoPedido: async (
      pedidoId: number,
      nuevoEstado: EstadosPedido
    ) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/pedidos/${pedidoId}/CambiarEstado`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
            },
            body: JSON.stringify({ estado: nuevoEstado }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Error al actualizar estado del pedido"
          );
        }
      } catch (error) {
        console.error("Error al actualizar estado del pedido:", error);
        throw error;
      }
    },
 
    actualizarPedidoEnStore: ({ pedidosEnCurso, pedidosFinalizados }) => {
      set({
        pedidosEnCurso,
        pedidosFinalizados,
      });
    },
    cambiarEstado: async (estado: EstadosPedido, pedidoId: number) => {
      set({ loadingPedidos: true, errorPedidos: null });
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/pedidos/CambiarEstado/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
            },
            body: JSON.stringify({ estado: estado, pedido: pedidoId }),
            redirect: "follow",
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Error al cambiar estado");
        }
        const pedidoActualizado = (await response.json()) as Pedido;
        set((state) => {
          const pedidosEnCurso = state.pedidosEnCurso.filter(
            (p) => p.id !== pedidoId
          );
          const pedidosFinalizados = state.pedidosFinalizados.filter(
            (p) => p.id !== pedidoId
          );
          if (
            estado === EstadosPedido.enPreparacion ||
            estado === EstadosPedido.enCamino
          ) {
            pedidosEnCurso.push(pedidoActualizado);
          } else {
            pedidosFinalizados.push(pedidoActualizado);
          }
          const pedidosActualizados = [
            ...state.pedidos.filter((p) => p.id !== pedidoId),
            pedidoActualizado,
          ];

          return {
            pedidos: pedidosActualizados,
            pedidosEnCurso,
            pedidosFinalizados,
            loadingPedidos: false,
          };
        });
      } catch (err) {
        set({
          errorPedidos:
            err instanceof Error ? err.message : "Error desconocido",
          loadingPedidos: false,
        });
      }
    },
       cambiarEstadoPago: async (estado: EstadosPagoPedido, pedidoId: number) => {
      set({ loadingPedidos: true, errorPedidos: null });
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/pedidos/CambiarEstadoPago/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
            },
            body: JSON.stringify({ estado: estado, pedido: pedidoId }),
            redirect: "follow",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Error al cambiar estado");
        }
        const pedidoActualizado = (await response.json()) as Pedido;
        set((state) => {
          const pedidosEnCurso = state.pedidosEnCurso.filter(
            (p) => p.id !== pedidoId
          );
          const pedidosFinalizados = state.pedidosFinalizados.filter(
            (p) => p.id !== pedidoId
          );
          if (
            pedidoActualizado.estado === EstadosPedido.enPreparacion ||
            pedidoActualizado.estado === EstadosPedido.enCamino
          ) {
            pedidosEnCurso.push(pedidoActualizado);
          } else {
            pedidosFinalizados.push(pedidoActualizado);
          }
          const pedidosActualizados = [
            ...state.pedidos.filter((p) => p.id !== pedidoId),
            pedidoActualizado,
          ];

          return {
            pedidos: pedidosActualizados,
            pedidosEnCurso,
            pedidosFinalizados,
            loadingPedidos: false,
          };
        });
      } catch (err) {
        set({
          errorPedidos:
            err instanceof Error ? err.message : "Error desconocido",
          loadingPedidos: false,
        });
      }
    },
  }))
);

export default usePedidos;
