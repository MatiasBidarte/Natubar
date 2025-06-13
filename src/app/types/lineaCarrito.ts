import { Product, Sabor } from "./product";

export interface lineaCarrito {
    producto: Product;
    sabores: saborLinea[]
    cantidad: number
}

export interface saborLinea{
    sabor: Sabor;
    cantidad: number;
}