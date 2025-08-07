import { Pedido } from "../types/pedido";
import { ActualizarCLienteResponse } from "./interfaces/ClientesInterface";
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

export const useClientes = () => {

  const registerClient = async (
    newClient: Cliente
  ): Promise<{ access_token: string }> => {
    try {
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
  
      return token;
    } catch (err) {
      throw err;
    }
  };

  const updateClient = async (clientId: string, updatedClient: Cliente) => {
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
  };

  const obtenerPedidosDeClienteLogueado = async () => {
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
  };

  const obtenerClientePorId = async (clientId: string) => {
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
  };
  const loginClient = async (cliente: ClientLogin) => {
    try {
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
      console.log("Usuario logueado:", loginCliente);
      return loginCliente;
    } catch (err) {
      throw err;
    }
  };
  return {
    registerClient,
    updateClient,
    obtenerPedidosDeClienteLogueado,
    loginClient,
    obtenerClientePorId,
  };
};
