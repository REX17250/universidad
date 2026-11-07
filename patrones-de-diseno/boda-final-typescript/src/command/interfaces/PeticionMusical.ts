export interface PeticionMusical {
  cancion: string;
  solicitante: string;
  ejecutar(): void;
  deshacer(): void;
}
