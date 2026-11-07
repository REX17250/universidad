// XChart es una librería externa para generar gráficos como scatter y regresión.
//> using dep "org.knowm.xchart:xchart:3.8.2"

// XYChartBuilder sirve para crear gráficos XY.
//SwingWrapper irve para mostrar el gráfico en pantalla en una ventana Swing.
import org.knowm.xchart.{XYChartBuilder, SwingWrapper}
// Source sirve para leer archivos fácilmente
import scala.io.Source

@main def housePricePrediction(): Unit = {

  val filePath = "data_ml.csv"

  // -----------------------------
  // Leer CSV (size_m2, price_k)
  // -----------------------------
  // data sera una lista de tuplas de valores double
  val data: List[(Double, Double)] = Source.fromFile(filePath)
    .getLines() //Lee todas las líneas del archivo CSV
    .drop(1) //Ignora la primera línea (cabecera)
    .map { line =>
      val cols = line.split(",").map(_.trim)
      (cols(1).toDouble, cols(2).toDouble) // Convierte cada línea en un par de números (size_m2, price_k)
    }.toList
     //Convierte el resultado en una lista de tuplas.

  println("Datos originales:")
  data.foreach(println)

  // -----------------------------
  // Normalización min–max
  // -----------------------------
  // Para obtener todos los valores de la columna 1 puedes realizar data.map(_._1)
  val minX = data.map(_._1).min // TU CODIGO AQUI
  val maxX = data.map(_._1).max // TU CODIGO AQUI
  val minY = data.map(_._2).min // TU CODIGO AQUI
  val maxY = data.map(_._2).max // TU CODIGO AQUI

 // Utiliza map y pattern matching (case) para aplicar la normalización
  val normalized = data.map{case(x, y)=>(((x-minX)/(maxX-minX)),((y-minY)/(maxY-minY)))} // TU CODIGO AQUI

  println("\nDatos normalizados:")
  normalized.foreach(println)

  // -----------------------------
  // Regresión lineal simple
  // -----------------------------
  val n = normalized.size
  val sumX = normalized.map(_._1).sum //TU CODIGO AQUI
  val sumY = normalized.map(_._2).sum //TU CODIGO AQUI

  // Utiliza pattern matching (case) para hacer las siguientes dos operaciones
  //val norm = (normalized.map(_._1).toList, normalized.map(_._2).toList)
  //val sumXY = norm.map match {case(xn, yn) => xn.map*yn.map}// TU CODIGO AQUI
  //val sumXX = norm match {case(xn, yn) => xn.map*xn.map} //tu codigo aqui

  val norm = (normalized.map(_._1), normalized.map(_._2))

val sumXY = norm match {
  case (xn, yn) => xn.zip(yn).map { case (x, y) => x * y }.sum
}

val sumXX = norm match {
  case (xn, _) => xn.map(x => x * x).sum
}



  val slope = (n*sumXY-sumX*sumY)/(n*sumXX-(sumX*sumX)) // TU CODIGO AQUI
  val intercept = (sumY-slope*sumX)/n // TU CODIGO AQUI

  println(s"\nModelo de regresión lineal:")
  println(s"Coeficiente (slope): $slope")
  println(s"Intercepto: $intercept")

  // -----------------------------
  // Plot datos y línea de regresión
  // -----------------------------
  val xData = normalized.map(_._1).toArray
  val yData = normalized.map(_._2).toArray
  val yFit = xData.map(x => slope * x + intercept)

  val chart = new XYChartBuilder()
    .width(600).height(400)
    .title("Regresión Lineal – Precio de Casas")
    .xAxisTitle("Tamaño (normalizado)")
    .yAxisTitle("Precio (normalizado)")
    .build()

  chart.addSeries("Datos", xData, yData)
  chart.addSeries("Regresión", xData, yFit)

  new SwingWrapper(chart).displayChart()

  // -----------------------------
  // Predicción para una casa nueva
  // -----------------------------
  val newHouseSize = 95.0
  //Normaliza el nuevo dato
  val newHouseNorm = (newHouseSize-minX)/(maxX-minX) // TU CODIGO AQUI
  
  //Aplica la formula y = mx + b
  val predictedNorm = slope*newHouseSize+intercept // TU CODIGO AQUI

  // Convertir de nuevo a precio real
  val predictedPrice = (predictedNorm*(maxY-minY))+minY // TU CODIGO AQUI

  println(f"\nPredicción para una casa de $newHouseSize , su precio sera de $predictedPrice%.2f dolares")

}