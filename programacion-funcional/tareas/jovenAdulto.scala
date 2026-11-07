@main def llamado ()=
    val people = Map("Ana" -> 22,"Luis" -> 17,"Pedro" -> 35,"Marta" -> 28,"Sofia" -> 15)

    val ejercicio = for {
        (nombre,edad) <- people
        category = if (edad < 25) "Joven" else "Adulto"
        if (category=="Joven")
    } yield (nombre, category)

    print(ejercicio)

    