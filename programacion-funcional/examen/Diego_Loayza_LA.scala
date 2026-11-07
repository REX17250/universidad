//Diego Fabian Loayza Arraya
@main def llamadoEjercicios()=
    println("Primer Ejercicio")
    val ejercicio1 = new primerEjercicio()
    val n = 5
    println(s"El resultado de n=$n es ${ejercicio1.M(n)}")

    println()
    println()
    println("Segundo Ejercicio")
    val ejercicio2 = new segundoEjercicio()
    println(ejercicio2.evaluar(ejercicio2.reglaMinimo)(60))
    println(ejercicio2.evaluar(ejercicio2.reglaMinimo)(45))
    println(ejercicio2.evaluar(ejercicio2.reglaPar)(20))
    println(ejercicio2.evaluar(ejercicio2.reglaPar)(21))

    println()
    println()
    println("Tercer Ejercicio")
    val ejercicio3 = new tercerEjercicio()
    ejercicio3.mostrarReporte()

    println()
    println()
    println("Cuarto Ejercicio")
    val ejercicio4 = new cuartoEjercicio()
    println(s"5: ${ejercicio4.ejecutar(5)}")
    println(s"-5: ${ejercicio4.ejecutar(-5)}")
    println(s"0: ${ejercicio4.ejecutar(0)}")

    println()
    println()
    println("Quinto Ejercicio")
    val ejercicio5 = new quintoEjercicio()
    val jugadores: List[Jugador] = List(new Pro(100), new Casual(40), new Pro(80))
    val resultado5 = ejercicio5.mapBonus(jugadores)(_ + 10)
    println(resultado5)

    println()
    println()
    println("Sexto Ejercicio")
    val ejercicio6 = new sextoEjercicio()
    val constructor = ejercicio6.pipelineC()
    val pipeline = constructor(ejercicio6.funcc)
    val resultado6 = pipeline(3)
    println(s"Salida de 3: $resultado6")



//Ejercicio 1
class primerEjercicio:
    def M (n: Int): Double= 
        val secuenciaNumerador= for
        (i <- 1 to n)
        yield (i+1)
        val numerador = secuenciaNumerador.map(_.toDouble).product
        
        val secuenciaDenominador= for
        (i <- 1 to n) 
        yield i
        val denominador = secuenciaDenominador.map(_.toDouble).sum

        if (denominador == 0) 0.0 else numerador/denominador
  

//Ejercicio 2
trait regla:
    def validar(puntaje: Int): Either[String, Int]

class segundoEjercicio:
    val reglaMinimo: regla = new regla {
        override def validar(puntaje: Int): Either[String, Int]= 
            if (puntaje >= 50) Right(puntaje) else Left(s"$puntaje no cumple el mínimo requerido")       
    }

    val reglaPar: regla = new regla {
        override def validar(puntaje: Int): Either[String, Int]= 
            if (puntaje % 2 == 0) Right(puntaje) else Left(s"$puntaje no es par") 
    }

    def evaluar(regla: regla)(puntaje: Int): Either[String, Int]=
        regla.validar(puntaje)

//Ejercicio 3
class tercerEjercicio:
    val mediciones: LazyList[Int] = LazyList.iterate(-5)(_+3)

    def clasificar(temperatura: Int): String = temperatura match {
        case t if t < 0 => "frío"
        case t if t < 25 => "templado"
        case _ => "calor"
    }

    def mostrarReporte()=
        val primeras12 = mediciones.take(12)
        println("reporte temperaturas")
        primeras12.foreach { t =>
            val estado = clasificar(t)
            println(s"$t°C $estado")
        }

//Ejercicio 4
class cuartoEjercicio:
        
    trait LogicaNegocio[A]:
        def procesar(valor: A): Option[A]
    

    given logicaEnteros: LogicaNegocio[Int] with {
        override def procesar(n: Int): Option[Int]=
        for {
            validado <- if (n > 0) Some(n) else None
            duplicado <- Some(validado * 2) 
        } yield duplicado
    }

    def ejecutar(n: Int)(using logica: LogicaNegocio[Int]): Option[Int]=
        logica.procesar(n)

//Ejercicio 5
abstract class Jugador:
    def puntos: Int
class Pro(val puntos: Int) extends Jugador
class Casual(val puntos: Int) extends Jugador

class quintoEjercicio:
    def mapBonus[T <: Jugador](jugadores: List[T])(funcionBonus: Int => Int): List[Int]= 
        jugadores.map {jugador =>
            jugador match {
                case p: Pro => funcionBonus(p.puntos)
                case c: Casual => c.puntos
                case other => other.puntos
            }
        }

//Ejercicio 6
class sextoEjercicio:
    val restar5: Int => Int = (x: Int) => x-5
    val duplicar: Int => Int = (x: Int) => x*2
    val sumar10: Int => Int = (x: Int) => x+10

    val funcc: (Int => Int, Int => Int) => (Int => Int)=
        (f, g) => (x) => g(f(x)) 

    def combinacion(estrategia: (Int => Int, Int => Int) => (Int => Int), f1: Int => Int, f2: Int => Int): Int => Int =
        estrategia(f1, f2)
    
    def pipelineC(): ((Int => Int, Int => Int) => (Int => Int)) => (Int => Int) = 
        (compo) => {
        val pasoIntermedio = combinacion(compo, restar5, duplicar)
        val pasoFinal = combinacion(compo, pasoIntermedio, sumar10)    
        pasoFinal
        }