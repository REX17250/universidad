//for comprenhension   
val nums = List(1,2,3)

val result = for {
    n <- nums
} yield n * 2

val result = for {
    n <- nums
    if n%2 == 0
} yield n*10

//ejercicio
val numss = List(1,2,3,4,5,6,7,8,9,10)
val ejercicio = for {
    n <- numss
    if n%2 == 0 
    cuadrado = n*n
    if cuadrado > 10
} yield cuadrado*10

//ejercicio 2
val productos = List(("Camiseta",20),("Pantalon",40),("Zapatos",60),("Sombrero",15),("Bufanda",10))
val ejercicio = for {
    (producto,precio) <- productos
    if precio > 15 
    descuento = precio * 0.9
    if descuento < 50
} yield descuento.toDouble

//ejercicio 3
val people = Map("Ana" -> 22,"Luis" -> 17,"Pedro" -> 35,"Marta" -> 28,"Sofia" -> 15)

val ejercicio = for {
    (nombre,edad) <- people
    category = if (edad < 25) "Joven" else "Adulto"
    if (category=="Joven")
} yield (nombre, category)

//ejercicio 4
//parte1
val rawAges = Map("Danna"->22,"Felipe"->17,"Carlos"->5,"Jenny"->28)
val ejercicio = for {
    (nombre,edad) <- rawAges
    category = if (edad >= 0) Right(edad) else Left("Edad invalida")
} yield (nombre, category)

val ejercicio = for {
    (nombre,edad) <- rawAges
    category = if (edad >= 0) Right(edad) else Left("Edad invalida")
    if category.isRight
} yield edad

val suma = ejercicio.sum