import { CancionDecorada } from '../interfaces/CancionDecorada';

export class CancionBase implements CancionDecorada {
  constructor(public titulo: string, public artista: string) {}

  reproducir(): void {
    console.log('Reproduciendo: ' + this.titulo + ' de ' + this.artista);
  }

  descripcion(): string {
    return '[ ' + this.titulo + ' - ' + this.artista + ' ]';
  }
}
