import { SistemaDeAudio } from '../../command/receiver/SistemaDeAudio';
import { PeticionMusical } from '../../command/interfaces/PeticionMusical';

export abstract class AsistenteDeGarrix {
  abstract crearPeticion(receptor: SistemaDeAudio): PeticionMusical;

  procesarPeticion(receptor: SistemaDeAudio): PeticionMusical {
    const peticion = this.crearPeticion(receptor);
    console.log('Asistente procesando peticion de: ' + peticion.solicitante);
    return peticion;
  }
}
