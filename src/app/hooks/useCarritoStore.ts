import { create } from "zustand";
import { Product } from "../types/product";

interface CartItem {
  producto: Product;
  cantidades: { [key: string]: number };
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
}));