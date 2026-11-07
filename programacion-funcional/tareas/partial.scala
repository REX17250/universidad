@main def llamado(num: Int) =
    val por2 = multiplicar(0.13, _:Int, _: Int)
    println(por2(num,num))


def multiplicar(a: Double, b:Int, c: Int): Double = a*b+c

//scala-cli partial.scala -- 100