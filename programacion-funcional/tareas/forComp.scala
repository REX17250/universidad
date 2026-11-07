@main def llamado() = 

    val numss = List(1,2,3,4,5,6,7,8,9,10)

    val ejercicio = for {
        n <- numss
        if n%2 == 0 
        cuadrado = n*n
        if cuadrado > 10
    } yield cuadrado*2

    print(ejercicio)