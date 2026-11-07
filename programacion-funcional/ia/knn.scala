import scala.math.sqrt
import scala.io.StdIn

@main def knn(): Unit = {
  val x1 = Array(10.0, 12.0, 15.0, 11.5, 13.0, 50.0, 52.0, 55.0, 53.0, 51.5)
  val x2 = Array(5.0, 6.5, 7.0, 5.5, 8.0, 40.0, 42.5, 45.0, 41.0, 43.0)
  val y  = Array(0, 0, 0, 0, 0, 1, 1, 1, 1, 1)

  val n = x1.length

  println("Ingrese x1:")
  val puntoX1 = StdIn.readDouble()

  println("Ingrese x2:")
  val puntoX2 = StdIn.readDouble()

  println("Ingrese k:")
  val k = StdIn.readInt()

  println("Usando Distancia Euclidiana")
  val distanciasEuclidiana = Array.ofDim[Double](n)

  for (i <- 0 until n) {
    val dx = x1(i) - puntoX1
    val dy = x2(i) - puntoX2
    distanciasEuclidiana(i) = sqrt(dx * dx + dy * dy)
  }

  val indicesEuclidiana = distanciasEuclidiana.zipWithIndex.sortBy(_._1).map(_._2)
  val kVecinosEuclidiana = indicesEuclidiana.take(k)

  println(s"Los $k vecinos más cercanos (Euclidiana):")
  for (i <- kVecinosEuclidiana) {
    val clase = if (y(i) == 0) "Clase 0" else "Clase 1"
    println(s"Punto (${x1(i)}, ${x2(i)}) - $clase - Distancia: ${distanciasEuclidiana(i)}")
  }

  var votosCeroEuc = 0
  var votosUnoEuc = 0
  for (i <- kVecinosEuclidiana) {
    if (y(i) == 0) votosCeroEuc += 1 else votosUnoEuc += 1
  }

  val resultadoEuclidiana = if (votosCeroEuc > votosUnoEuc) "Clase 0" else "Clase 1"

  println("Usando Distancia Manhattan")
  val distanciasManhattan = Array.ofDim[Double](n)

  for (i <- 0 until n) {
    val dx = math.abs(x1(i) - puntoX1)
    val dy = math.abs(x2(i) - puntoX2)
    distanciasManhattan(i) = dx + dy
  }

  val indicesManhattan = distanciasManhattan.zipWithIndex.sortBy(_._1).map(_._2)
  val kVecinosManhattan = indicesManhattan.take(k)

  println(s"Los $k vecinos más cercanos (Manhattan):")
  for (i <- kVecinosManhattan) {
    val clase = if (y(i) == 0) "Clase 0" else "Clase 1"
    println(s"Punto (${x1(i)}, ${x2(i)}) - $clase - Distancia: ${distanciasManhattan(i)}")
  }

  var votosCeroMan = 0
  var votosUnoMan = 0
  for (i <- kVecinosManhattan) {
    if (y(i) == 0) votosCeroMan += 1 else votosUnoMan += 1
  }

  val resultadoManhattan = if (votosCeroMan > votosUnoMan) "Clase 0" else "Clase 1"

  println(s"Punto a clasificar: ($puntoX1, $puntoX2)")
  println(s"Clasificación usando Manhattan: $resultadoManhattan")
  println(s"Clasificación usando Euclidiana: $resultadoEuclidiana")
}