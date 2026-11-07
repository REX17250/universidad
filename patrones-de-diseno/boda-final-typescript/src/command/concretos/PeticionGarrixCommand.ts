import { PeticionMusical } from '../interfaces/PeticionMusical';
import { SistemaDeAudio } from '../receiver/SistemaDeAudio';

export class PeticionGarrixCommand implements PeticionMusical {
  public cancion: string = 'Animals';
  public solicitante: string = 'Martin Garrix';

  constructor(private receptor: SistemaDeAudio) {}

  ejecutar(): void {
    console.log('Martin Garrix se autopeticiona: Animals');
    this.receptor.reproducir(this.cancion);
  }

  deshacer(): void {
    console.log('Garrix cancela su propia peticion');
  }
}
