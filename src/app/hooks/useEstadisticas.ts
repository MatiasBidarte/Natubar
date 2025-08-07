import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EstadosPedido, Pedido } from "../types/pedido";
import usePedidos from "./usePedidos";
import {
  ClienteStats,
  EstadisticasResumen,
  ProductoStats,
  PromedioMensual,
} from "./interfaces/EstadisticasInterfaces";

interface EstadisticasState {
  estadisticas: EstadisticasResumen | null;
  loadingEstadisticas: boolean;
  errorEstadisticas: string | null;
  ultimaActualizacion: Date | null;

  fetchAllPedidosForStats: () => Promise<void>;
  getEstadisticasFiltradas: (
    mes?: number | null,
    anio?: number
  ) => EstadisticasResumen;
  limpiarEstadisticas: () => void;
}

export const useEstadisticas = create(
  devtools<EstadisticasState>((set, get) => ({
    estadisticas: null,
    loadingEstadisticas: false,
    errorEstadisticas: null,
    ultimaActualizacion: null,

    fetchAllPedidosForStats: async () => {
      const pedidosStore = usePedidos.getState();

      set({ loadingEstadisticas: true, errorEstadisticas: null });

      try {
        const ultimaActualizacion = get().ultimaActualizacion;
        const ahora = new Date();
        const necesitaActualizar =
          !ultimaActualizacion ||
          ahora.getTime() - ultimaActualizacion.getTime() > 3600000;

        const pedidosExistentes = [
          ...pedidosStore.pedidosEnCurso,
          ...pedidosStore.pedidosFinalizados,
        ];

        if (pedidosExistentes.length > 0 && !necesitaActualizar) {
          const estadisticas = calcularEstadisticasBase(pedidosExistentes);
          set({
            estadisticas,
            loadingEstadisticas: false,
            ultimaActualizacion: new Date(),
          });
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/pedidos`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los pedidos para estadísticas");
        }

        const pedidos = (await response.json()) as Pedido[];

        const enCurso = pedidos.filter(
          (p) =>
            p.estado === EstadosPedido.enPreparacion ||
            p.estado === EstadosPedido.enCamino
        );

        const finalizados = pedidos.filter(
          (p) =>
            p.estado === EstadosPedido.entregado ||
            p.estado === EstadosPedido.pendientePago
        );

        pedidosStore.actualizarPedidoEnStore({
          pedidosEnCurso: enCurso,
          pedidosFinalizados: finalizados,
        });

        const estadisticas = calcularEstadisticasBase(pedidos);
        set({
          estadisticas,
          loadingEstadisticas: false,
          ultimaActualizacion: new Date(),
        });
      } catch (error) {
        console.error("Error al cargar pedidos para estadísticas:", error);
        set({
          loadingEstadisticas: false,
          errorEstadisticas:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    },

    getEstadisticasFiltradas: (mes, anio) => {
      const pedidosStore = usePedidos.getState();
      const allPedidos = [
        ...pedidosStore.pedidosEnCurso,
        ...pedidosStore.pedidosFinalizados,
      ];
      allPedidos.sort(
        (a, b) =>
          new Date(b.fechaCreacion).getTime() -
          new Date(a.fechaCreacion).getTime()
      );

      const pedidosFiltrados = allPedidos.filter((pedido) => {
        const fecha = new Date(pedido.fechaCreacion);
        const pedidoAnio = fecha.getFullYear();
        const pedidoMes = fecha.getMonth() + 1;

        if (anio && mes) {
          return pedidoAnio === anio && pedidoMes === mes;
        } else if (anio) {
          return pedidoAnio === anio;
        }
        return true;
      });

      const totalPedidos = pedidosFiltrados.length;
      const totalVentas = pedidosFiltrados.reduce(
        (sum, p) => sum + p.montoTotal,
        0
      );

      let ganancia = 0;
      const gananciaPorMes = Array(12).fill(0);

      pedidosFiltrados.forEach((pedido) => {
        let gananciaPedido = 0;

        pedido.productos?.forEach((item) => {
          const precioVenta =
            pedido.cliente?.tipo === "Empresa"
              ? item.precioEmpresas
              : item.precioPersonas;

          const costoProduccion = item.costoProduccion || 0;
          const gananciaUnitaria = precioVenta - costoProduccion;

          gananciaPedido += gananciaUnitaria * item.cantidad;
        });

        ganancia += gananciaPedido;

        const fecha = new Date(pedido.fechaCreacion);
        const mes = fecha.getMonth();
        gananciaPorMes[mes] += gananciaPedido;
      });

      const clientesMap = new Map<string, ClienteStats>();
      pedidosFiltrados.forEach((pedido) => {
        if (!pedido.cliente) return;

        const { id, nombre, apellido, nombreEmpresa, tipo } = pedido.cliente;
        const clienteId = id || "";

        if (!clientesMap.has(clienteId)) {
          clientesMap.set(clienteId, {
            clienteId,
            nombre:
              tipo === "Empresa"
                ? nombreEmpresa!
                : `${nombre || ""} ${apellido || ""}`.trim(),
            total: 0,
            cantidadPedidos: 0,
          });
        }

        const clienteStats = clientesMap.get(clienteId)!;
        clienteStats.total += pedido.montoTotal;
        clienteStats.cantidadPedidos += 1;
      });

      const topClientes = Array.from(clientesMap.values())
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      const productosMap = new Map<number, ProductoStats>();
      pedidosFiltrados.forEach((pedido) => {
        pedido.productos?.forEach((item) => {
          const { id = 1, nombre, costoProduccion = 0 } = item;

          if (!productosMap.has(id)) {
            productosMap.set(id, {
              productoId: id,
              nombre: nombre || "",
              cantidad: 0,
              total: 0,
              costoTotal: 0,
              ganancia: 0,
            });
          }

          const productoStats = productosMap.get(id)!;
          productoStats.cantidad += item.cantidad;

          const precioUnitario =
            pedido.cliente?.tipo === "Empresa"
              ? item.precioEmpresas
              : item.precioPersonas;
          productoStats.total += item.cantidad * precioUnitario;
          productoStats.costoTotal += item.cantidad * costoProduccion;
          productoStats.ganancia +=
            item.cantidad * (precioUnitario - costoProduccion);
        });
      });

      const productosVendidos = Array.from(productosMap.values()).sort(
        (a, b) => b.cantidad - a.cantidad
      );

      let promedioMensual: PromedioMensual[] | undefined;

      if (anio && !mes) {
        const ventasPorMes = Array(12).fill(0);
        const pedidosPorMes = Array(12).fill(0);

        pedidosFiltrados.forEach((pedido) => {
          const fecha = new Date(pedido.fechaCreacion);
          const mes = fecha.getMonth();

          ventasPorMes[mes] += pedido.montoTotal;
          pedidosPorMes[mes] += 1;
        });

        promedioMensual = Array.from({ length: 12 }, (_, i) => ({
          mes: i + 1,
          pedidos: pedidosPorMes[i],
          ventas: ventasPorMes[i],
          ganancia: gananciaPorMes[i],
        }));
      }

      return {
        totalPedidos,
        totalVentas,
        ganancia,
        promedioMensual,
        topClientes,
        productosVendidos,
        pedidosFiltrados,
      };
    },

    limpiarEstadisticas: () => {
      set({
        estadisticas: null,
        ultimaActualizacion: null,
      });
    },
  }))
);

function calcularEstadisticasBase(pedidos: Pedido[]): EstadisticasResumen {
  const totalPedidos = pedidos.length;
  const totalVentas = pedidos.reduce((sum, p) => sum + p.montoTotal, 0);

  let ganancia = 0;

  pedidos.forEach((pedido) => {
    pedido.productos?.forEach((item) => {
      const precioVenta =
        pedido.cliente?.tipo === "Empresa"
          ? item.precioEmpresas
          : item.precioPersonas;

      const costoProduccion = item.costoProduccion || 0;
      ganancia += (precioVenta - costoProduccion) * item.cantidad;
    });
  });

  return {
    totalPedidos,
    totalVentas,
    ganancia,
    topClientes: [],
    productosVendidos: [],
    pedidosFiltrados: pedidos,
  };
}

export default useEstadisticas;
