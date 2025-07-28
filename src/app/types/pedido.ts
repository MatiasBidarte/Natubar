import { Cliente } from "../hooks/useClientes";
import { Producto } from "./producto";

export interface Pedido {
  id: number;
  fechaCreacion: Date;
  fechaEntrega?: Date;
  fechaEntregaEstimada: Date;
  montoTotal: number;
  descuento: number;
  estado: EstadosPedido;
  estadoPago: EstadosPagoPedido;
  observaciones?: string;
  productos?: DetallePedido[];
  preferenceId?: string;
  cliente?: Cliente;
}

export interface DetallePedido {
  id: number;
  cantidad: number;
  producto: Producto;
  productoSabores?: {
    id: number;
    cantidad: number;
    sabor: Sabor;
  }[];
}

export interface ProductoSabor {
  id: number;
  sabor: Sabor;
  cantidad: number;
}

interface Sabor {
  id: number;
  nombre: string;
  cantidad: number;
}

export enum EstadosPedido {
  enPreparacion = "En Preparación",
  enCamino = "En Camino",
  entregado = "Entregado",
  pendientePago = "Pendiente de Pago",
}

export enum EstadosPagoPedido {
  pendiente = "Pendiente pago",
  pagado = "Pagado",
  rechazado = "Pago rechazado",
}
