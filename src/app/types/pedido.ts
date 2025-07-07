import { Client } from "../hooks/useClientes";
import { Sabor } from "./product";

export interface Pedido{
     id: number;
  fechaCreacion: Date;
  fechaEntrega: Date;
  fechaEntregaEstimada: Date;
  montoTotal: number;
  descuento: number;
  preferenceId?: string;
  estado: EstadosPedido;
  productos: DetallePedido[];
  cliente: Client;
}

export enum EstadosPedido {
  enPreparacion = 'En Preparación',
  enCamino = 'En Camino',
  entregado = 'Entregado',
  pendientePago = 'Pendiente de Pago',
}

export interface DetallePedido{
      cantidad: number;
  id: number;
  nombre: string;
  descripcion: string;
  precioPersonas: number;
  precioEmpresas: number;
  stock: boolean;
  urlImagen?: string;
  peso?: number;
  esCajaDeBarras: boolean;
  cantidadDeBarras?: number;
  sabores: Sabor[];

}