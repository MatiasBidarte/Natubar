import { ActualizarCLienteResponse } from "./interfaces/ClientesInterface";

export interface Client {
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
    newClient: Client
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

  const updateClient = async (clientId: string, updatedClient: Client) => {
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

  const loginClient = async (cliente: ClientLogin) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/clientes/login`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "apik_prod_6vJrYh9M4xCt!dZ1QaB3Wf7E@kPxLg0e",
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

      //Manejar el tema del token
      const loginCliente = await response.json();
      return loginCliente;
    } catch (err) {
      throw err;
    }
  };
  return {
    registerClient,
    updateClient,
    loginClient,
  };
};
