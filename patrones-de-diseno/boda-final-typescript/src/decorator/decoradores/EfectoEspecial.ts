import { CancionDecorada } from '../interfaces/CancionDecorada';

export abstract class EfectoEspecial implements CancionDecorada {
  constructor(protected cancion: CancionDecorada) {}

  get titulo(): string {
    return this.cancion.titulo;
  }

  reproducir(): void {
    this.cancion.reproducir();
  }

  descripcion(): string {
    return this.cancion.descripcion();
  }
}
