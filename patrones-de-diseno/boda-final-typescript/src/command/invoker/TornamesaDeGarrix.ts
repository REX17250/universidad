import { PeticionMusical } from '../interfaces/PeticionMusical';
import { PeleaDiplomatica } from '../pelea/PeleaDiplomatica';
import { AsistenteDeFuria } from '../../factory-method/concretos/AsistenteDeFuria';
import { SistemaDeAudio } from '../receiver/SistemaDeAudio';
import { Solicitante } from '../pelea/Solicitante';

export class TornamesaDeGarrix {
  public colaDePeticiones: PeticionMusical[] = [];
  public historial: PeticionMusical[] = [];

  constructor(
    private peleaDiplomatica: PeleaDiplomatica,
    private asistenteDeFuria: AsistenteDeFuria,
    private receptor: SistemaDeAudio
  ) {}

  agregarPeticion(peticion: PeticionMusical): void {
    this.colaDePeticiones.push(peticion);
    console.log(
      'Peticion agregada a la cola: ' + peticion.cancion + ' - Solicitante: ' +
        peticion.solicitante
    );
  }

  verificarConflicto(): boolean {
    return this.peleaDiplomatica.hayConflicto(this.colaDePeticiones);
  }

  procesarCola(): void {
    if (this.colaDePeticiones.length === 0) {
      console.log('Cola vacia, Garrix improvisa');
      return;
    }

    if (this.verificarConflicto()) {
      console.log('CONFLICTO DETECTADO - Donald y Maduro pidieron al mismo tiempo');
      this.resolverConflicto();
    } else {
      const proxima = this.colaDePeticiones.shift()!;
      proxima.ejecutar();
      this.historial.push(proxima);
    }
  }

  resolverConflicto(): void {
    const ganador = this.peleaDiplomatica.pelear();
    const perdedor =
      ganador === this.peleaDiplomatica.donald
        ? this.peleaDiplomatica.maduro
        : this.peleaDiplomatica.donald;

    // remover peticiones correspondientes
    const indicePerdedor = this.colaDePeticiones.findIndex(
      (p) => p.solicitante.includes(perdedor.nombre)
    );
    if (indicePerdedor !== -1) {
      const pet = this.colaDePeticiones.splice(indicePerdedor, 1)[0]!;
      pet.deshacer();
    }

    const indiceGanador = this.colaDePeticiones.findIndex(
      (p) => p.solicitante.includes(ganador.nombre)
    );
    if (indiceGanador !== -1) {
      const pet = this.colaDePeticiones.splice(indiceGanador, 1)[0]!;
      pet.ejecutar();
      this.historial.push(pet);
    }

    if (perdedor.estaEnFuria()) {
      console.log(
        `${perdedor.nombre} ha perdido 5 veces - activando modo furia`
      );
      const cmd = this.asistenteDeFuria.crearPeticionDeFuria(perdedor, this.receptor);
      cmd.ejecutar();
    }
  }

  deshacerUltima(): void {
    if (this.historial.length === 0) {
      console.log('No hay nada que deshacer');
      return;
    }
    const ultima = this.historial.pop()!;
    ultima.deshacer();
    console.log('Ultima peticion deshecha');
  }
}
