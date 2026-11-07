import { Solicitante } from './Solicitante';

export class PeleaDiplomatica {
  public ultimoGanador: string = '';
  public ultimoPerdedor: string = '';

  constructor(public donald: Solicitante, public maduro: Solicitante) {}

  calcularPoder(s: Solicitante): number {
    let poder = s.nivelInfluencia * 10;
    if (s.tienePropina) poder += 30;
    if (s.guardaespaldasActivo) poder += 15;
    poder -= s.peticionesAnteriores * 10;
    poder += Math.floor(Math.random() * 20);
    return poder;
  }

  pelear(): Solicitante {
    const poderDonald = this.calcularPoder(this.donald);
    const poderMaduro = this.calcularPoder(this.maduro);
    console.log(`Donald - Poder de pelea: ${poderDonald}`);
    console.log(`Maduro - Poder de pelea: ${poderMaduro}`);

    // determinamos el ganador usando una probabilidad ponderada por poder
    const totalPoder = poderDonald + poderMaduro;
    let ganador: Solicitante;
    let perdedor: Solicitante;
    if (totalPoder === 0) {
      // caso extremo, empate aleatorio
      if (Math.random() < 0.5) {
        ganador = this.donald;
        perdedor = this.maduro;
      } else {
        ganador = this.maduro;
        perdedor = this.donald;
      }
    } else {
      const probDonald = poderDonald / totalPoder;
      if (Math.random() < probDonald) {
        ganador = this.donald;
        perdedor = this.maduro;
      } else {
        ganador = this.maduro;
        perdedor = this.donald;
      }
    }

    console.log(`Ganador de la ronda: ${ganador.nombre}`);
    perdedor.subirIra();

    this.ultimoGanador = ganador.nombre;
    this.ultimoPerdedor = perdedor.nombre;

    return ganador;
  }

  hayConflicto(cola: { solicitante: string }[]): boolean {
    const tieneDonald = cola.some(
      (p) => p.solicitante && p.solicitante.includes('Donald')
    );
    const tieneMaduro = cola.some(
      (p) => p.solicitante && p.solicitante.includes('Maduro')
    );
    return tieneDonald && tieneMaduro;
  }
}
