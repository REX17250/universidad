@main def llamado()=
    println(conversion(2.023843))
    println(conversion(true))
    println(2.932421.toTexto)
    println(true.toTexto)

trait convertibleAString[A]:
    def convertir (x: A): String

given convertibleAString [Boolean] with
    def convertir(x: Boolean):String = if(x){"VERDADERO"}else{"FALSO"}

given convertibleAString [Double] with
    def convertir(x: Double): String = "%.2f".format(x)

def conversion[A](x: A)(using cn: convertibleAString[A]): String =
    cn.convertir(x)

extension [A](x: A)
    def toTexto(using tt: convertibleAString[A]) = tt.convertir(x)

