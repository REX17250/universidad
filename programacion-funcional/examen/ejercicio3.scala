@main def llamado()=

    val duplicar = (x: Double) => x * 2
    val procesarLista = transformacion(duplicar)

    val nums = List(10.0, 20.0, 30.0)
    println(procesarLista(nums))



def transformacion(algo: Double => Double) =
    (lista: List[Double]) => lista.map(algo)

