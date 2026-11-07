import { AsistenteDeGarrix } from '../interfaces/AsistenteDeGarrix';
import { SistemaDeAudio } from '../../command/receiver/SistemaDeAudio';
import { PeticionMusical } from '../../command/interfaces/PeticionMusical';
import { PauseCommand } from '../../command/concretos/PauseCommand';

export class AsistenteDeSeguridad extends AsistenteDeGarrix {
  crearPeticion(receptor: SistemaDeAudio): PeticionMusical {
    console.log('Asistente de seguridad activa protocolo: pausa de emergencia');
    return new PauseCommand(receptor);
  }
}
