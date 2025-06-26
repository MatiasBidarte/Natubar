import { Product, Sabor } from "./product";

export interface lineaCarrito {
    eliminado: boolean
    numeral: number
    producto: Product;
    sabores: saborLinea[]
    cantidad: number
}

export interface saborLinea{
    sabor: Sabor;
    cantidad: number;
}