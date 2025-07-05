export interface Product {
  id?: number;
  nombre?: string;
  descripcion?: string;
  precioPersonas?: number;
  precioEmpresas?: number;
  peso?: number;
  stock?: boolean;
  urlImagen?: string;
  sabores?: Sabor[];
  esCajaDeBarras: boolean;
  cantidadDeBarras?: number;
}

export interface Sabor {
  id: number;
  nombre: string;
}
