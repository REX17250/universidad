import { ObservadorDelEvento } from '../interfaces/ObservadorDelEvento';
import { EventoMusical } from '../interfaces/EventoMusical';

export class PantallaGiganteObserver implements ObservadorDelEvento {
  public nombre: string = 'Pantalla Gigante';

  actualizar(evento: EventoMusical): void {
    if (evento.tipoEvento === 'FIN_DONALD') {
      console.log('PANTALLA: Donald Trump gana - YMCA sonara por siempre');
    } else if (evento.tipoEvento === 'FIN_MADURO') {
      console.log('PANTALLA: Super Bigote gana - La Casa Blanca destruida');
    } else if (evento.tipoEvento === 'PELEA_RESUELTA') {
      console.log(
        'PANTALLA: Ganador de la ronda - ' + evento.ganador + ' | Suena: ' +
          evento.cancionActual
      );
    } else if (evento.tipoEvento === 'INICIO') {
      console.log(
        'PANTALLA: Sonando ahora - ' + evento.cancionActual +
          ' | Pedido por: ' +
          evento.solicitante
      );
    } else if (evento.tipoEvento === 'PAUSA') {
      console.log('PANTALLA: Audio en pausa');
    }
  }
}
