import { ObservadorDelEvento } from '../interfaces/ObservadorDelEvento';
import { EventoMusical } from '../interfaces/EventoMusical';

export class GarrixObserver implements ObservadorDelEvento {
  public nombre: string = 'Martin Garrix';

  actualizar(evento: EventoMusical): void {
    if (evento.tipoEvento === 'FIN_DONALD' || evento.tipoEvento === 'FIN_MADURO') {
      console.log('GARRIX: Tira los cascos y sale corriendo. Nunca mas djea una boda.');
    } else if (evento.tipoEvento === 'PELEA_RESUELTA') {
      console.log('GARRIX: Mezcla la cancion del ganador con drop epico.');
    } else if (evento.tipoEvento === 'DROP') {
      console.log('GARRIX: Activa todos los efectos del escenario.');
    } else if (evento.tipoEvento === 'INICIO') {
      console.log('GARRIX: Ajustando los niveles para - ' + evento.cancionActual);
    }
  }
}
