import scala.util.Try

@main def llamado()=
    new EjercicioEither().ejecutar()


class EjercicioEither {

  def calcularTotal(nombre: String, precioStr: String, cantidadStr: String): Either[String, Double] = {

    def validarNombre(n: String): Either[String, String] =
      if (n.trim.nonEmpty) Right(n) else Left("El nombre no puede estar vacío")

    def validarPrecio(p: String): Either[String, Double] =
      Try(p.toDouble).toOption match {
        case Some(d) if d > 0 => Right(d)
        case Some(_)          => Left("El precio debe ser mayor a 0")
        case None             => Left("El precio no es un número válido")
      }

    def validarCantidad(c: String): Either[String, Int] =
      Try(c.toInt).toOption match {
        case Some(i) if i > 0 => Right(i)
        case Some(_)          => Left("La cantidad debe ser mayor a 0")
        case None             => Left("La cantidad no es un entero")
      }

    for {
      _ <- validarNombre(nombre)
      p <- validarPrecio(precioStr)
      c <- validarCantidad(cantidadStr)
    } yield p * c
  }

  def ejecutar(): Unit = {
    println(calcularTotal("Cuaderno", "15.5", "2"))
    println(calcularTotal("   ", "15.5", "2"))
    println(calcularTotal("Cuaderno", "-3", "2"))
    println(calcularTotal("Cuaderno", "15.5", "abc"))
  }
}

