import { AsistenteDeGarrix } from '../interfaces/AsistenteDeGarrix';
import { SistemaDeAudio } from '../../command/receiver/SistemaDeAudio';
import { PeticionMusical } from '../../command/interfaces/PeticionMusical';
import { PeticionDonaldCommand } from '../../command/concretos/PeticionDonaldCommand';

export class AsistenteDeDonald extends AsistenteDeGarrix {
  crearPeticion(receptor: SistemaDeAudio): PeticionMusical {
    console.log('Asistente de Donald entrega papelito dorado a Garrix');
    return new PeticionDonaldCommand(receptor);
  }
}
