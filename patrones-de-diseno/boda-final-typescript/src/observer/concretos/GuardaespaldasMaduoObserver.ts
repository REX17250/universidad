import { ObservadorDelEvento } from '../interfaces/ObservadorDelEvento';
import { EventoMusical } from '../interfaces/EventoMusical';

export class GuardaespaldasMaduoObserver implements ObservadorDelEvento {
  public nombre: string = 'Guardaespaldas de Maduro';

  actualizar(evento: EventoMusical): void {
    if (evento.tipoEvento === 'FIN_MADURO') {
      console.log('GUARDIA MADURO: El comandante triunfa. Venezuela gana.');
    } else if (evento.tipoEvento === 'FIN_DONALD') {
      console.log('GUARDIA MADURO: Activando protocolo de evacuacion.');
    } else if (
      evento.tipoEvento === 'PELEA_RESUELTA' &&
      evento.ganador &&
      evento.ganador.includes('Maduro')
    ) {
      console.log('GUARDIA MADURO: El comandante gana la ronda.');
    } else if (
      evento.tipoEvento === 'PELEA_RESUELTA' &&
      evento.ganador &&
      evento.ganador.includes('Donald')
    ) {
      console.log('GUARDIA MADURO: Posicion defensiva activada.');
    }
  }
}
