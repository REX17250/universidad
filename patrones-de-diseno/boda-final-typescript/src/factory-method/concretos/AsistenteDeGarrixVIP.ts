import { AsistenteDeGarrix } from '../interfaces/AsistenteDeGarrix';
import { SistemaDeAudio } from '../../command/receiver/SistemaDeAudio';
import { PeticionMusical } from '../../command/interfaces/PeticionMusical';
import { PeticionGarrixCommand } from '../../command/concretos/PeticionGarrixCommand';

export class AsistenteDeGarrixVIP extends AsistenteDeGarrix {
  crearPeticion(receptor: SistemaDeAudio): PeticionMusical {
    console.log('Garrix crea su propia peticion VIP');
    return new PeticionGarrixCommand(receptor);
  }
}
