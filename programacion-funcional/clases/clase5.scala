def multiplicar(a: Int, b:Int, c: Int): Int = a*b*c
val por2 = multiplicar(2, _:Int, _: Int)
println(por2(3,4))

def log(nivel: String)(mensaje: String )= println(s"[$nivel] $mensaje")
val logInfo = log("INFO")
val logError = log("ERROR")

logInfo("Aplicación iniciada")
logError("Archivo no encontrado")

val limpiar = (s:String) => s.trim()
val mayus = (s: String) => s.toUpperCase()
val procesar = (s: String) => mayus(limpiar(s))

val doble = (x: Int) => x*2
val sumarTres = (x:Int) => x+3
val dobleYSuma = doble andThen sumarTres
val sumaYDoble = doble compose sumarTres
println(dobleYSuma(4))
println(sumaYDoble(4))


val limpiar = (s:String) => s.trim()
val mayus = (s: String) => s.toUpperCase()
val sinVocales = (s: String) => s.replaceAll("[AEIOU]","")

val pipeline = limpiar andThen mayus andThen sinVocales
println(pipeline("hola scala"))



