import { EfectoEspecial } from './EfectoEspecial';

export class EfectoGarrixDecorator extends EfectoEspecial {
  reproducir(): void {
    console.log('Efecto Garrix: Drop de bass activado');
    console.log('Efecto Garrix: Luces estroboscopicas encendidas');
    super.reproducir();
  }

  descripcion(): string {
    return super.descripcion() + ' + [Drop bass] + [Estroboscopio]';
  }
}
