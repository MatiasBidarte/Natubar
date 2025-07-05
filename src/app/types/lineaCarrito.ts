import { Product, Sabor } from "./product";

export interface lineaCarrito {
  numeral: number;
  producto: Product;
  sabores: saborLinea[];
  cantidad: number;
}

export interface NuevaLineaCarrito {
  numeral?: number;
  producto: Product;
  sabores: saborLinea[];
  cantidad: number;
}

export interface saborLinea {
  sabor: Sabor;
  cantidad: number;
}
