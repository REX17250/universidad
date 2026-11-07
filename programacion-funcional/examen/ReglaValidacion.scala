trait ReglaValidacion {
  def validar(puntaje: Int): Either[String, Int]
}