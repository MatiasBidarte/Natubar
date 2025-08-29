import { create } from "zustand";
import { Pedido } from "../types/pedido";
import { ActualizarCLienteResponse } from "./interfaces/ClientesInterface";
import { devtools } from "zustand/middleware";
export interface Cliente {
  id?: string;
  nombre?: string;
  apellido?: string;
  nombreEmpresa?: string;
  rut?: string;
  nombreContacto?: string;
  email: string;
  contrasena: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  observaciones: string;
  tipo: string;
}

export interface ClientLogin {
  id?: string;
  nombre?: string;
  apellido?: string;
  nombreEmpresa?: string;
  rut?: string;
  nombreContacto?: string;
  email: string;
  contrasena: string;
  departamento?: string;
  ciudad?: string;
  direccion?: string;
  telefono?: string;
  observaciones?: string;
  tipo?: string;
}

interface ClientesState {
  loadingClientes: boolean;
  errorClientes: string | null;
  registerClient: (newClient: Cliente) => Promise<{ access_token: string }>;
  updateClient: (
    clientId: string,
    updatedClient: Cliente
  ) => Promise<ActualizarCLienteResponse>;
  obtenerPedidosDeClienteLogueado: () => Promise<Pedido[]>;
  obtenerClientePorId: (clientId: string) => Promise<Cliente | null>;
  loginClient: (cliente: ClientLogin) => Promise<{ access_token: string }>;
  getClientes: () => Promise<Cliente[]>;
}

export const useClientes = create(
  devtools<ClientesState>((set) => ({
    loadingClientes: false,
    errorClientes: null,
    registerClient: async (newClient: Cliente) => {
      try {
        set({ loadingClientes: true, errorClientes: null });
        const url = `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/clientes`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          body: JSON.stringify(newClient),
          redirect: "follow",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            message: errorData.message || "Error al registrar el cliente",
            statusCode: errorData.statusCode,
          };
        }
        const token = await response.json();
        set({ loadingClientes: false, errorClientes: null });
        return token;
      } catch (err) {
        set({
          loadingClientes: false,
          errorClientes: err instanceof Error ? err.message : String(err),
        });
        throw err;
      }
    },
    updateClient: async (clientId: string, updatedClient: Cliente) => {
      try {
        const url = `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/clientes/${clientId}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          body: JSON.stringify(updatedClient),
          redirect: "follow",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            message: errorData.message || "Error al actualizar el cliente",
            statusCode: errorData.statusCode,
          };
        }

        const updatedClientData = await response.json();
        return updatedClientData as ActualizarCLienteResponse;
      } catch (err) {
        throw err;
      }
    },
    obtenerPedidosDeClienteLogueado: async () => {
      try {
        const usuario = JSON.parse(
          localStorage.getItem("usuario") || "{}"
        ) as Cliente;
        if (!usuario) {
          throw new Error("Usuario no logueado o ID de usuario no disponible");
        }
        const url = `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/clientes/${usuario.id}/pedidos`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          redirect: "follow",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            message:
              errorData.message || "Error al obtener los pedidos del cliente",
            statusCode: errorData.statusCode,
          };
        }

        const pedidos = await response.json();
        return pedidos as Pedido[];
      } catch (err) {
        throw err;
      }
    },
    obtenerClientePorId: async (clientId: string) => {
      try {
        const url = `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/clientes/${clientId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          redirect: "follow",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            message: errorData.message || "Error al obtener el cliente",
            statusCode: errorData.statusCode,
          };
        }

        const cliente = await response.json();
        return cliente as Cliente;
      } catch (err) {
        throw err;
      }
    },
    loginClient: async (cliente: ClientLogin) => {
      try {
        set({ loadingClientes: true, errorClientes: null });
        const url = `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/clientes/login`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
          },
          body: JSON.stringify(cliente),
          redirect: "follow",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            message: errorData.message || "Error al realizar login",
            statusCode: errorData.statusCode,
          };
        }
        const loginCliente = await response.json();
        set({ loadingClientes: false, errorClientes: null });
        return loginCliente;
      } catch (err) {
        set({
          loadingClientes: false,
          errorClientes:
            err instanceof Error
              ? err.message
              : typeof err === "object" && err !== null && "message" in err
              ? JSON.stringify((err as { message?: unknown }).message)
              : String(err),
        });
      }
    },
    getClientes: async () => {
      try {
        set({ loadingClientes: true, errorClientes: null });
        const url = `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/clientes/`;
        const usu = localStorage.getItem("usuario");
        if (usu) {
          const usuario = JSON.parse(usu);
          if (!usuario) {
            set({ loadingClientes: false });
            return [];
          } else {
            const response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_NATUBAR_API_KEY || "",
                Authorization: `Bearer ${usuario.token}`,
              },
              redirect: "follow",
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw {
                message: errorData.message || "Error al obtener los clientes",
                statusCode: errorData.statusCode,
              };
            }
            set({ loadingClientes: false, errorClientes: null });
            const clientes = await response.json();
            return clientes as Cliente[];
          }
        } else {
          set({ loadingClientes: false });
          return [];
        }
      } catch (err) {
        set({
          loadingClientes: false,
          errorClientes: err instanceof Error ? err.message : String(err),
        });
        return [];
      }
    },
  }))
);

export default useClientes;
