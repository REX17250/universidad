declare const process: any;

import { PeticionMusical } from '../interfaces/PeticionMusical';
import { SistemaDeAudio } from '../receiver/SistemaDeAudio';
import { SistemaDeNotificaciones } from '../../observer/subject/SistemaDeNotificaciones';

export class ComandoSuperBigoteCommand implements PeticionMusical {
  public cancion: string = 'Eye of the Tiger - MODO DESTRUCCION';
  public solicitante: string = 'Nicolas Maduro - SUPER BIGOTE';

  constructor(
    private receptor: SistemaDeAudio,
    private notificador: SistemaDeNotificaciones
  ) {}

  ejecutar(): void {
    console.log('ALERTA MAXIMA: Nicolas Maduro se ha transformado en Super Bigote');
    console.log('La Casa Blanca esta siendo destruida');
    this.receptor.reproducir(this.cancion);
    this.notificador.notificar({
      tipoEvento: 'FIN_MADURO',
      cancionActual: this.cancion,
      solicitante: this.solicitante,
    });
    process.exit(0);
  }

  deshacer(): void {
    console.log('El bigote no tiene reversa');
  }
}
