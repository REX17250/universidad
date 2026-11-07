@main def llamado() =
  val ingresos = 10
  println(ingresos.show)
  
trait Show[A]:
  def format(valor: A): String

given showInt: Show[Int] with
  def format(valor: Int): String = s"Entero($valor)"

extension [A](a: A)(using printer: Show[A])
  def show: String = printer.format(a)

