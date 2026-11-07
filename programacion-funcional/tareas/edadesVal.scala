@main def llamado()=
    val rawAges = Map("Danna"->22,"Felipe"->17,"Carlos"->5,"Jenny"->28)

    val ejercicio1 = for {
        (nombre,edad) <- rawAges
        category = if (edad >= 0) Right(edad) else Left("Edad invalida")
    } yield (nombre, category)
    println(ejercicio1)

    val ejercicio2 = for {
        (nombre,edad) <- rawAges
        category = if (edad >= 0) Right(edad) else Left("Edad invalida")
        if category.isRight
    } yield edad

    println(ejercicio2.sum)

