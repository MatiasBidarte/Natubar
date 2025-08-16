export interface Producto {
  id?: number;
  nombre?: string;
  descripcion?: string;
  precioPersonas: number;
  precioEmpresas: number;
  urlImagen?: string;
  esCajaDeBarras: boolean;
  costoProduccion: number;
  cantidadDeBarras?: number;
  estaActivo: boolean;
}

export interface Sabor {
  id: number;
  nombre: string;
  cantidad: number;
}
