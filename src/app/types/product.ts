  export interface Product {
  id?: number;
  nombre?: string;
  descripcion?: string;
  precioPersonas?: string;
  precioEmpresas?: number;
  stock?: boolean;
  urlImagen?: string;
  sabores? :Sabor[]
}

export interface Sabor{
  id: number
  nombre: string;
}