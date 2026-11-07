@main def llamado()=
    println(describe(5))
    println(describe(15))
    println(describe(25))

trait Clasificador[A]:
    def clasificar(x: A): String

given Clasificador[Int] with
    def clasificar(x: Int): String = 
        x match
            case x if x < 10 => "bajo"
            case x if x > 20 => "alto"
            case _ => "medio"
        

def describe[A](x: A)(using d: Clasificador[A]): String =
    d.clasificar(x)

