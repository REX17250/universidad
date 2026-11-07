declare const process: any;

import { PeticionMusical } from '../interfaces/PeticionMusical';
import { SistemaDeAudio } from '../receiver/SistemaDeAudio';
import { SistemaDeNotificaciones } from '../../observer/subject/SistemaDeNotificaciones';

export class ComandoNuclearCommand implements PeticionMusical {
  public cancion: string = 'Eye of the Tiger - MODO GUERRA';
  public solicitante: string = 'Donald Trump - MODO FURIA';

  constructor(
    private receptor: SistemaDeAudio,
    private notificador: SistemaDeNotificaciones
  ) {}

  ejecutar(): void {
    console.log('ALERTA MAXIMA: Donald Trump ha activado la Operacion Bombardeo');
    console.log('Venezuela esta siendo bombardeada');
    this.receptor.reproducir(this.cancion);
    this.notificador.notificar({
      tipoEvento: 'FIN_DONALD',
      cancionActual: this.cancion,
      solicitante: this.solicitante,
    });
    process.exit(0);
  }

  deshacer(): void {
    console.log('No se puede deshacer un bombardeo');
  }
}
