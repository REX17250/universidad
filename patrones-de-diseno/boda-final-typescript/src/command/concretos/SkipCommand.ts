import { PeticionMusical } from '../interfaces/PeticionMusical';
import { SistemaDeAudio } from '../receiver/SistemaDeAudio';

export class SkipCommand implements PeticionMusical {
  public cancion: string = '';
  public solicitante: string = 'Sistema';

  constructor(private receptor: SistemaDeAudio) {}

  ejecutar(): void {
    this.receptor.saltar();
    console.log('Cancion saltada');
  }

  deshacer(): void {
    console.log('Skip cancelado');
  }
}
