export interface EventoMusical {
  tipoEvento: string; // "INICIO" | "DROP" | "FIN" | "PAUSA" | "PELEA_RESUELTA" | "FIN_DONALD" | "FIN_MADURO"
  cancionActual: string;
  solicitante: string;
  ganador?: string;
  perdedor?: string;
}
