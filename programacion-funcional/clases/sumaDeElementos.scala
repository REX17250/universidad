@main def sumador(args: String*): Unit =
    val lista = args.map(_.toInt).toList
    val suma = lista.sum
    println(s"La suma es $suma") 
def funcion(args: Int*): Unit =
    val lista = args.map(_.toInt).toList
    val filtrado: List[Int] = lista.filter(_%2!=0)
    val multiplicacion: List[Int] = filtrado.map(_*10)
    println(multiplicacion)