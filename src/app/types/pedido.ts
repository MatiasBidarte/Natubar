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
  sabores?: Sabor[];
}

interface Sabor {
  id: number;
  nombre: string;
  cantidad: number;
}