@main def llamado(nombre: String, ciudad: String) =
    val addNombre = saludo(nombre)
    print(addNombre(ciudad))

def saludo(nombre: String): String => String = (ciudad: String) => "hola " +  nombre + " desde " + ciudad
//scala-cli saludosf.scala -- Diego -- La Paz
