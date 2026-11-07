import { PeticionMusical } from '../interfaces/PeticionMusical';
import { SistemaDeAudio } from '../receiver/SistemaDeAudio';

export class PauseCommand implements PeticionMusical {
  public cancion: string = '';
  public solicitante: string = 'Sistema';

  constructor(private receptor: SistemaDeAudio) {}

  ejecutar(): void {
    this.receptor.pausar();
    console.log('Audio pausado por el sistema');
  }

  deshacer(): void {
    console.log('Pausa cancelada');
  }
}
