@main def llamado() = 
    val productos = List(("Camiseta",20),("Pantalon",40),("Zapatos",60),("Sombrero",15),("Bufanda",10))
    
    val ejercicio = for {
        (producto,precio) <- productos
        if precio > 15 
        descuento = precio * 0.9
        if descuento < 50
    } yield descuento.toDouble

    println(ejercicio)