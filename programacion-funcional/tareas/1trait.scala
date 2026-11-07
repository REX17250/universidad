@main def llamado() =
    var mn: String = "Diego Loayza"
    val t1 = new AMayusculas{}
    val t2 = new SinEspacios{}
    val t3 = new Reversa{}
    println(funHO(mn, t1.transformar)) 
    println(funHO(mn, t2.transformar))
    println(funHO(mn, t3.transformar))
    

trait Transformador[T]: 
    def transformar(x: T): T

trait AMayusculas extends Transformador[String]:
    override def transformar(x: String): String = x.toUpperCase()

trait SinEspacios extends Transformador[String]: 
    override def transformar(x: String): String = x.replaceAll(" ","")

trait Reversa extends Transformador[String]:
    override def transformar(x: String): String = x.toList.reverse.mkString

def funHO(s: String, operacion: String => String): String =
  operacion(s)

