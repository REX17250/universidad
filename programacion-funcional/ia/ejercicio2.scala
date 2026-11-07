import scala.util.Try

@main def llamado()=
    new EjercicioLazyList().ejecutar()

class EjercicioLazyList {
  trait Regla { 
    def marcar(n: Int): Option[String]
  }

  object ReglaPar extends Regla {
    def marcar(n: Int): Option[String] = 
      if (n % 2 == 0) Some("par") else None
  }

  object ReglaMultiplo5 extends Regla {
    def marcar(n: Int): Option[String] = 
      if (n % 5 == 0) Some("múltiplo de 5") else None
  }

  def ejecutar(): Unit = {
    val numeros = LazyList.from(1)
    
    val reglas = List(ReglaPar, ReglaMultiplo5)

    val salidaProcesada = numeros.map { n =>
      val mensajes = reglas.flatMap(_.marcar(n))

      if (mensajes.isEmpty) {
        s"$n"
      } else {
        s"$n -> ${mensajes.mkString(", ")}"
      }
    }

    salidaProcesada.take(20).foreach(println)
  }
}


