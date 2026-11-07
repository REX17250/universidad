import { EfectoEspecial } from './EfectoEspecial';

export class EfectoRomanticoDecorator extends EfectoEspecial {
  reproducir(): void {
    console.log('Efecto Romantico: Violines en vivo activados');
    console.log('Efecto Romantico: Petalos de rosa cayendo del techo');
    super.reproducir();
  }

  descripcion(): string {
    return super.descripcion() + ' + [Violines] + [Petalos de rosa]';
  }
}
