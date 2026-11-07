import { ObservadorDelEvento } from '../interfaces/ObservadorDelEvento';
import { EventoMusical } from '../interfaces/EventoMusical';

export class SistemaDeNotificaciones {
  private observadores: ObservadorDelEvento[] = [];

  suscribir(o: ObservadorDelEvento): void {
    this.observadores.push(o);
    console.log(o.nombre + ' suscrito al sistema de notificaciones');
  }

  desuscribir(o: ObservadorDelEvento): void {
    this.observadores = this.observadores.filter((x) => x.nombre !== o.nombre);
    console.log(o.nombre + ' desuscrito');
  }

  notificar(evento: EventoMusical): void {
    console.log('--- Notificando evento: ' + evento.tipoEvento + ' ---');
    this.observadores.forEach((o) => o.actualizar(evento));
  }
}
