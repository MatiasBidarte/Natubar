export interface Client {
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
  discriminador: string;
}

export const useClients = () => {
  const registerClient = async (newClient: Client) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/cliente`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

      const createdClient = await response.json();
      return createdClient;
    } catch (err) {
      throw err;
    }
  };

  return {
    registerClient,
  };
};
