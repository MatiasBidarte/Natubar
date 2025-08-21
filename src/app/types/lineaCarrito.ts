import { DetallePedido } from "./pedido";
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

export const mapDetallePedidoToLineaCarrito = (
  detalles: DetallePedido[]
): LineaCarrito[] => {
  return detalles.map((detalle) => ({
    producto: {
      id: detalle.id ?? 0,
      nombre: detalle.nombre,
      descripcion: detalle.descripcion ?? "",
      precioPersonas: detalle.precioPersonas,
      precioEmpresas: detalle.precioEmpresas,
      peso: detalle.peso,
      stock: detalle.stock,
      urlImagen: detalle.urlImagen,
      esCajaDeBarras: detalle.esCajaDeBarras,
      costoProduccion: detalle.costoProduccion,
      cantidadDeBarras: detalle.cantidadDeBarras,
      estaActivo: true
    },
    cantidad: detalle.cantidad,
    sabores: detalle.sabores.map((sabor) => ({
      sabor,
      cantidad: sabor.cantidad,
    })),
  }));
};

