import { ObservadorDelEvento } from '../interfaces/ObservadorDelEvento';
import { EventoMusical } from '../interfaces/EventoMusical';

export class GuardaespaldsDonaldObserver implements ObservadorDelEvento {
  public nombre: string = 'Guardaespaldas de Donald';

  actualizar(evento: EventoMusical): void {
    if (evento.tipoEvento === 'FIN_DONALD') {
      console.log('GUARDIA DONALD: Mision completada. El jefe gana.');
    } else if (evento.tipoEvento === 'FIN_MADURO') {
      console.log('GUARDIA DONALD: Entrando en panico total. Evacuando.');
    } else if (
      evento.tipoEvento === 'PELEA_RESUELTA' &&
      evento.ganador &&
      evento.ganador.includes('Donald')
    ) {
      console.log('GUARDIA DONALD: Victoria. El jefe gana la ronda.');
    } else if (
      evento.tipoEvento === 'PELEA_RESUELTA' &&
      evento.ganador &&
      evento.ganador.includes('Maduro')
    ) {
      console.log('GUARDIA DONALD: Posicion defensiva activada.');
    }
  }
}
