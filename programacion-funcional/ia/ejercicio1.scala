import scala.util.Try

@main def llamado()=
    new EjercicioFunctor().ejecutar()

class EjercicioFunctor {

  def stringToDouble(s: String): Option[Double] = {
    Try(s.toDouble).toOption
  }

  def f(x: Double): Double = math.pow(x, 2)

  def procesarDatos(datos: List[String]): List[Option[Double]] = {
    datos.map { str =>
      val maybeNumber = stringToDouble(str)
      maybeNumber.map(f)
    }
  }

  def ejecutar(): Unit = {
    val entrada = List("2", "5.5", "hola", "10", "error", "-3")

    val resultado = procesarDatos(entrada)

    println("Entrada:   " + entrada)
    println("Resultado: " + resultado)
    
    resultado.foreach {
      case Some(valor) => println(valor)
      case None => println("None")
    }
  }
}
