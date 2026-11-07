export class SistemaDeAudio {
  public volumen: number = 100;
  public cancionActual: string = '';
  public estaPausado: boolean = false;

  reproducir(cancion: string): void {
    this.cancionActual = cancion;
    this.estaPausado = false;
    console.log('Reproduciendo: ' + cancion + ' | Volumen: ' + this.volumen);
  }

  pausar(): void {
    this.estaPausado = true;
    console.log('Audio pausado');
  }

  saltar(): void {
    console.log('Saltando cancion: ' + this.cancionActual);
    this.cancionActual = '';
  }

  ajustarVolumen(nivel: number): void {
    this.volumen = nivel;
    console.log('Volumen ajustado a: ' + nivel);
  }
}
