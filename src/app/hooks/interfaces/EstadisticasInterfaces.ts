import { Pedido } from "@/app/types/pedido";

export interface ClienteStats {
  clienteId: string;
  nombre: string;
  total: number;
  cantidadPedidos: number;
}

export interface ProductoStats {
  productoId: number;
  nombre: string;
  cantidad: number;
  total: number;
  costoTotal: number;
  ganancia: number;
}

export interface PromedioMensual {
  mes: number;
  pedidos: number;
  ventas: number;
  ganancia: number;
}

export interface EstadisticasResumen {
  totalPedidos: number;
  totalVentas: number;
  ganancia: number;
  promedioMensual?: PromedioMensual[];
  topClientes: ClienteStats[];
  productosVendidos: ProductoStats[];
  pedidosFiltrados: Pedido[];
}
