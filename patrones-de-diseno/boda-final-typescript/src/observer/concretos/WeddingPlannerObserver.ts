import { ObservadorDelEvento } from '../interfaces/ObservadorDelEvento';
import { EventoMusical } from '../interfaces/EventoMusical';

export class WeddingPlannerObserver implements ObservadorDelEvento {
  public nombre: string = 'Wedding Planner';

  actualizar(evento: EventoMusical): void {
    if (evento.tipoEvento === 'FIN_DONALD' || evento.tipoEvento === 'FIN_MADURO') {
      console.log('WEDDING PLANNER: RENUNCIO. Esto no era lo que se contrato.');
    } else if (evento.tipoEvento === 'PELEA_RESUELTA') {
      console.log('WEDDING PLANNER: Esto no es una boda, es un campo de batalla.');
    } else if (evento.tipoEvento === 'INICIO') {
      console.log('WEDDING PLANNER: Por favor que sea una cancion romantica...');
    } else if (evento.tipoEvento === 'PAUSA') {
      console.log('WEDDING PLANNER: Aprovecho para llorar en el bano.');
    }
  }
}
