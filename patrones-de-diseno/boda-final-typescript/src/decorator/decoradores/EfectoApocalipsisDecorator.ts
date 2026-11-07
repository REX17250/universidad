import { EfectoEspecial } from './EfectoEspecial';

export class EfectoApocalipsisDecorator extends EfectoEspecial {
  reproducir(): void {
    console.log('Efecto Apocalipsis: Sirenas de guerra sonando en el salon');
    console.log('Efecto Apocalipsis: Explosiones pirotecnicas en el escenario');
    console.log('Efecto Apocalipsis: Toda la iluminacion cambia a rojo');
    super.reproducir();
  }

  descripcion(): string {
    return (
      super.descripcion() +
      ' + [Sirenas] + [Explosiones] + [Luz roja]'
    );
  }
}
