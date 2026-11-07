import { AsistenteDeGarrix } from '../interfaces/AsistenteDeGarrix';
import { SistemaDeAudio } from '../../command/receiver/SistemaDeAudio';
import { PeticionMusical } from '../../command/interfaces/PeticionMusical';
import { PeticionMaduoCommand } from '../../command/concretos/PeticionMaduoCommand';

export class AsistenteDeMaduro extends AsistenteDeGarrix {
  crearPeticion(receptor: SistemaDeAudio): PeticionMusical {
    console.log('Asistente de Maduro entrega papelito con sello oficial a Garrix');
    return new PeticionMaduoCommand(receptor);
  }
}
