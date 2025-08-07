import { Cliente } from "../hooks/useClientes";
import { Sabor } from "./producto";

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
  cliente?: Cliente;
}

export interface DetallePedido {
  cantidad: number;
  id?: number;
  nombre: string;
  descripcion?: string;
  precioPersonas: number;
  precioEmpresas: number;
  peso?: number;
  stock?: boolean;
  urlImagen?: string;
  esCajaDeBarras: boolean;
  costoProduccion: number;
  cantidadDeBarras?: number;
  sabores: Sabor[];
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
