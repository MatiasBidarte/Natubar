import { Client } from "../useClientes";

export interface ActualizarCLienteResponse {
  message: string;
  cliente: Client;
  access_token: string;
}
