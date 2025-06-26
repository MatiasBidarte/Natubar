import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { lineaCarrito } from "../types/lineaCarrito";

interface CartState {
  items: lineaCarrito[];
  addToCart: (item: lineaCarrito) => void;
  updateCantidad: (numeral: number, sumar: number) => void;
  toggleEliminado: (numeral: number) => void;
}

export const usePedido = create(
  devtools<CartState>((set) => ({
    items: [],
    addToCart: (item: lineaCarrito) =>
      set((state) => ({
        items: [...state.items, item],
      })),

    updateCantidad: (numeral, sumar) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.numeral === numeral
            ? { ...item, cantidad: item.cantidad + sumar }
            : item
        ),
      })),

    toggleEliminado: (numeral) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.numeral === numeral
            ? { ...item, eliminado: !item.eliminado }
            : item
        ),
      })),
  }))
);
