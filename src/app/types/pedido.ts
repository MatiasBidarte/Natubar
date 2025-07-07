export interface Pedido {
  id: number;
  fechaCreacion: Date;
  fechaEntrega?: Date;
  fechaEntregaEstimada: Date;
  montoTotal: number;
  descuento: number;
  estado: EstadosPedido;
  productos?: DetallePedido[];
  preferenceId?: string;
}

interface DetallePedido {
  id: number;
  cantidad: number;
  nombre: string;
  descripcion?: string;
  precioPersonas: number;
  precioEmpresas: number;
  stock: boolean;
  urlImagen?: string;
  peso?: number;
  esCajaDeBarras: boolean;
  cantidadDeBarras?: number;
  sabores?: Sabor[];
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
