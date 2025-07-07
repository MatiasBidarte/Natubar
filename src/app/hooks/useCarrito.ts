import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { lineaCarrito } from "../types/lineaCarrito";



interface CartState {
  items: lineaCarrito[];
  addToCart: (item: lineaCarrito) => void;
}

export const useCarrito = create(
  devtools<CartState>((set) => ({
    items: [],
    addToCart: (item: lineaCarrito) =>
      set((state) => ({
        items: [...state.items, item],
      })),
  })),  
);
