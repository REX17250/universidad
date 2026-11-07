export class Solicitante {
  public contadorDeIra: number = 0;
  public readonly nivelMaximoDeIra: number = 5;
  public modoFuria: boolean = false;
  public peticionesAnteriores: number = 0;

  constructor(
    public nombre: string,
    public cancionFavorita: string,
    public nivelInfluencia: number,
    public tienePropina: boolean,
    public guardaespaldasActivo: boolean
  ) {}

  subirIra(): void {
    this.contadorDeIra += 1;
    console.log(`${this.nombre} - Nivel de ira: ${this.contadorDeIra}/${this.nivelMaximoDeIra}`);
    if (this.contadorDeIra === this.nivelMaximoDeIra) {
      this.modoFuria = true;
      console.log(`ADVERTENCIA: ${this.nombre} ha llegado al limite de ira`);
    }
  }

  estaEnFuria(): boolean {
    return this.modoFuria;
  }

  resetearIra(): void {
    this.contadorDeIra = 0;
    this.modoFuria = false;
  }
}
