import { EfectoEspecial } from './EfectoEspecial';

export class EfectoTrumpDecorator extends EfectoEspecial {
  reproducir(): void {
    console.log('Efecto Trump: Fanfarria de trompetas activada');
    console.log('Efecto Trump: Confeti dorado cayendo sobre el salon');
    super.reproducir();
  }

  descripcion(): string {
    return super.descripcion() + ' + [Trompetas] + [Confeti dorado]';
  }
}
