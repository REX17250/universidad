import { ObservadorDelEvento } from '../interfaces/ObservadorDelEvento';
import { EventoMusical } from '../interfaces/EventoMusical';

export class FinDelMundoObserver implements ObservadorDelEvento {
  public nombre: string = 'Cronista del Fin del Mundo';

  actualizar(evento: EventoMusical): void {
    if (evento.tipoEvento === 'FIN_DONALD') {
      console.log('========================================');
      console.log('CRONICA OFICIAL: Donald Trump gana la Boda del Siglo');
      console.log('CRONICA OFICIAL: Venezuela bombardeada. Operacion exitosa.');
      console.log('CRONICA OFICIAL: Martin Garrix nunca volvio a djear.');
      console.log('========================================');
    } else if (evento.tipoEvento === 'FIN_MADURO') {
      console.log('========================================');
      console.log('CRONICA OFICIAL: Nicolas Maduro gana la Boda del Siglo');
      console.log('CRONICA OFICIAL: La Casa Blanca destruida por Super Bigote.');
      console.log('CRONICA OFICIAL: Martin Garrix nunca volvio a djear.');
      console.log('========================================');
    }
  }
}
