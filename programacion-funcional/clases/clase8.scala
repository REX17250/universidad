//flat map
val lista = List(1,2,3,4)
val resultado = lista.flatMap(n => List.fill(n)(n))
println(s"Resultado con flatMap: $resultado")

val resultado = lista.map(n => List.fill(n)(n))
println(s"Resultado con Map: $resultado")

val tupla: (String, Int, Double) = ("Hola", 43, 3.14)
val saludo = tupla._1
val numero = tupla._2
val pi = tupla._3


val pais = ("España", 46719142, "Madrid")
pais match{
    case (nombrePais, poblacion, capital) =>
    println(s"El país $nombrePais tiene una población de $poblacion y su capital es $capital.")
    }


val tupla = (List(1,2,3), List("scala","java","python"))
val resultado = tupla match {
    case(numeros, lenguajes) =>
        val numerosMultiplicados = numeros.map(_*2)
        val lenguajesMayusculas = lenguajes.map(_.toUpperCase)
        (numerosMultiplicados, lenguajesMayusculas)
}

println(s"Numeros multiplicados: ${resultado._1}")
println(s"Lenguajes en mayúsculas: ${resultado._2}")

val tupla1 = (42, "Scala")
val tupla2 = (List(1,2,3), 3.14)

val tuplaCombinada = (tupla1, tupla2)

val productos = List(
    ("camiseta",20.99,"ropa"),
    ("pantalones", 40.99, "ropa"),
    ("zapatos", 60.99, "calzado")
)
productos.foreach{case(nombre, precio, categoria)=>
    println(s"Producto: $nombre, Precio: $precio, Categoría: $categoria")}


//Mapas inmutables
val mapa: Map[String, Int] =
    Map("Manzana"->2, "Pera"->3,"Plátano"->4)
    
println(mapa)

val cantidadManzanas = mapa("Manzana")
val cantidadUvas =mapa.get("Uvas")

val nuevoMapa = mapa+("Pera"->2)
val mapaSinPera = mapa - "Pera"

println(mapa.contains("uvas"))

val mapaDoble = mapa.map {case(clave,valor)=>(clave,valor*2)}

val mapaFiltrado = mapa.collect{case(clave,valor)if valor > 2 =>(clave, valor*2)}

//ejercicio
val mapaF: Map[String, Int] =
    Map("Paracetamol"->2, "Diclofenaco"->3,"Ibuprofeno"->4)

def curri(desc: Double)(mapa: Map[String, Int]): Map[String, Double]= mapa.map {case(clave,valor)=>(clave,valor-(valor*(desc/100)))}

println(curri(10)(mapaF))

//ejercicio 2

val mapaF: Map[String, Int] =
    Map("Paracetamol"->2, "Diclofenaco"->3,"Ibuprofeno"->4)

def funC(nombre: String)(precioNuevo: Int)(mapa: Map[String, Int]): Map[String, Int] =
    mapa + (nombre -> precioNuevo)

val funcionPendiente = funC(_: String)(_: Int)(mapaF)

val resultado = funcionPendiente("Paracetamol", 10)
println(resultado)
