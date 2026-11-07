import { AsistenteDeGarrix } from '../interfaces/AsistenteDeGarrix';
import { SistemaDeAudio } from '../../command/receiver/SistemaDeAudio';
import { PeticionMusical } from '../../command/interfaces/PeticionMusical';
import { Solicitante } from '../../command/pelea/Solicitante';
import { ComandoNuclearCommand } from '../../command/concretos/ComandoNuclearCommand';
import { ComandoSuperBigoteCommand } from '../../command/concretos/ComandoSuperBigoteCommand';
import { SistemaDeNotificaciones } from '../../observer/subject/SistemaDeNotificaciones';

export class AsistenteDeFuria extends AsistenteDeGarrix {
  constructor(private notificador: SistemaDeNotificaciones) {
    super();
  }

  crearPeticion(_receptor: SistemaDeAudio): PeticionMusical {
    throw new Error('Usar crearPeticionDeFuria en su lugar');
  }

  crearPeticionDeFuria(solicitante: Solicitante, receptor: SistemaDeAudio): PeticionMusical {
    if (solicitante.nombre.includes('Donald')) {
      console.log('Asistente de furia crea: Operacion Bombardeo para Donald Trump');
      return new ComandoNuclearCommand(receptor, this.notificador);
    }
    if (solicitante.nombre.includes('Maduro')) {
      console.log('Asistente de furia crea: Super Bigote para Nicolas Maduro');
      return new ComandoSuperBigoteCommand(receptor, this.notificador);
    }
    throw new Error('Solicitante no reconocido para modo furia');
  }
}
