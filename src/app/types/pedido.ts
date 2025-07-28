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
  estadoPago: EstadosPago;
  observaciones?: string;
  productos?: DetallePedido[];
  preferenceId?: string;
  cliente?: Cliente;
}

interface DetallePedido {
  id: number;
  cantidad: number;
  producto: Producto;
  productoSabores?: {
    id: number;
    cantidad: number;
    sabor: Sabor;
  }[];
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


export enum EstadosPago {
  pendiente = 'Pendiente pago',
  pagado = 'Pagado',
  cancelado = 'Pago rechazado',
}