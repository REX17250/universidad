@main def llamado() =
    val c1 = new Circulo(5.0)
    val c2 = new Circulo(2.0)
    println(funG(c1, c2))

abstract class figura:
    def area: Double

class Circulo(radio: Double) extends  figura:
    override def area: Double = Math.PI * radio * radio

    

class Rectangulo(ancho: Double, alto: Double) extends figura:
    override def area: Double = ancho * alto

def funG[A <: figura](pf: A, sf: A): A =
  if (pf.area >= sf.area) pf else sf
