
export interface NotificacionPushDto {
  playerId: string;
  clienteId: number;
  dispositivo: string;
}

export interface NotificacionIndividual{
  cabezal: string;
  mensaje: string;
  tipoCliente?: string;
  fecha?:Date | null;
}