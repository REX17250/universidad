import { EfectoEspecial } from './EfectoEspecial';

export class EfectoMaduoDecorator extends EfectoEspecial {
  reproducir(): void {
    console.log('Efecto Maduro: Himno venezolano de fondo activado');
    console.log('Efecto Maduro: Marcha militar encendida');
    super.reproducir();
  }

  descripcion(): string {
    return super.descripcion() + ' + [Himno venezolano] + [Marcha militar]';
  }
}
