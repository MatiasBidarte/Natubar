import { Cliente } from "../useClientes";

export interface ActualizarCLienteResponse {
  message: string;
  cliente: Cliente;
  access_token: string;
}
