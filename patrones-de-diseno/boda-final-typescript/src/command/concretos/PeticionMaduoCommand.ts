import { PeticionMusical } from '../interfaces/PeticionMusical';
import { SistemaDeAudio } from '../receiver/SistemaDeAudio';

export class PeticionMaduoCommand implements PeticionMusical {
  public cancion: string = 'El Carnaval del Mundo';
  public solicitante: string = 'Nicolas Maduro';

  constructor(private receptor: SistemaDeAudio) {}

  ejecutar(): void {
    console.log('Nicolas Maduro solicita: El Carnaval del Mundo');
    this.receptor.reproducir(this.cancion);
  }

  deshacer(): void {
    console.log('Peticion de Nicolas Maduro descartada - perdio la pelea');
    this.receptor.pausar();
  }
}
