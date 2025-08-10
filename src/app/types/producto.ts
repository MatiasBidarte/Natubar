export interface Producto {
  id?: number;
  nombre?: string;
  descripcion?: string;
  precioPersonas: number;
  precioEmpresas: number;
  peso?: number;
  stock?: boolean;
  urlImagen?: string;
  esCajaDeBarras: boolean;
  costoProduccion: number;
  cantidadDeBarras?: number;
}

export interface Sabor {
  id: number;
  nombre: string;
  cantidad: number;
}
