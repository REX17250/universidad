import { ObservadorDelEvento } from '../interfaces/ObservadorDelEvento';
import { EventoMusical } from '../interfaces/EventoMusical';

export class MaquinaDeHumoObserver implements ObservadorDelEvento {
  public nombre: string = 'Maquina de Humo';

  actualizar(evento: EventoMusical): void {
    if (evento.tipoEvento === 'FIN_DONALD' || evento.tipoEvento === 'FIN_MADURO') {
      console.log('HUMO: Humo de emergencia llenando el salon');
    } else if (evento.tipoEvento === 'DROP') {
      console.log('HUMO: Humo disparado en el drop');
    } else if (evento.tipoEvento === 'PAUSA') {
      console.log('HUMO: Maquina apagada');
    } else if (evento.tipoEvento === 'INICIO') {
      console.log('HUMO: Maquina de humo en modo fiesta');
    }
  }
}
