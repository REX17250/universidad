import { ObservadorDelEvento } from '../interfaces/ObservadorDelEvento';
import { EventoMusical } from '../interfaces/EventoMusical';

export class LucesLaserObserver implements ObservadorDelEvento {
  public nombre: string = 'Luces Laser';

  actualizar(evento: EventoMusical): void {
    if (evento.tipoEvento === 'FIN_DONALD') {
      console.log('LUCES: Cambian a rojo blanco y azul - modo patriota USA');
    } else if (evento.tipoEvento === 'FIN_MADURO') {
      console.log('LUCES: Cambian a amarillo azul y rojo - modo Venezuela');
    } else if (
      evento.tipoEvento === 'PELEA_RESUELTA' &&
      evento.ganador &&
      evento.ganador.includes('Donald')
    ) {
      console.log('LUCES: Modo dorado activado');
    } else if (
      evento.tipoEvento === 'PELEA_RESUELTA' &&
      evento.ganador &&
      evento.ganador.includes('Maduro')
    ) {
      console.log('LUCES: Modo tricolor activado');
    } else if (evento.tipoEvento === 'INICIO') {
      console.log('LUCES: Efecto estroboscopico activado');
    }
  }
}
