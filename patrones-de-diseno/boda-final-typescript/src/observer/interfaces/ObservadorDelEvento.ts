import { EventoMusical } from './EventoMusical';

export interface ObservadorDelEvento {
  nombre: string;
  actualizar(evento: EventoMusical): void;
}
