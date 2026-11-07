import { PeticionMusical } from '../interfaces/PeticionMusical';
import { SistemaDeAudio } from '../receiver/SistemaDeAudio';

export class PeticionDonaldCommand implements PeticionMusical {
  public cancion: string = 'YMCA';
  public solicitante: string = 'Donald Trump';

  constructor(private receptor: SistemaDeAudio) {}

  ejecutar(): void {
    console.log('Donald Trump solicita: YMCA');
    this.receptor.reproducir(this.cancion);
  }

  deshacer(): void {
    console.log('Peticion de Donald Trump cancelada');
    this.receptor.pausar();
  }
}
