import { Producto, Sabor } from "./producto";

export interface LineaCarrito {
  numeral?: number;
  producto: Producto;
  sabores: SaborLinea[];
  cantidad: number;
}

export interface SaborLinea {
  sabor: Sabor;
  cantidad: number;
}

export interface CrearPedidoDto {
  observaciones?: string;
  productos: LineaCarrito[];
  montoTotal: number;
  cliente: {
    id: string;
  };
}
