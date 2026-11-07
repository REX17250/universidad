//> using scala "2.12.18"
//> using jvm "8"
//> using dep "org.apache.spark:spark-core_2.12:3.5.7"
//> using dep "org.apache.spark:spark-sql_2.12:3.5.7"
//> using dep "org.apache.spark:spark-mllib_2.12:3.5.7"
//> using dep "org.knowm.xchart:xchart:3.8.8"

// Esto permite crear DataFrames, leer datos, etc
import org.apache.spark.sql.SparkSession
// Esto permite transformar columnas numéricas en un vector features (Spark ML siempre espera una columna vectorial)
import org.apache.spark.ml.feature.VectorAssembler
// Modelo de regresión lineal de Spark MLlib
import org.apache.spark.ml.regression.LinearRegression


// Permite graficar
import org.knowm.xchart.{XYChartBuilder, SwingWrapper, XYSeries}
import org.knowm.xchart.style.markers.{Circle, None => NoMarker}


// Estamos creando un singleton llamado RegresionLinealRecta.
// Dentro de él colocamos un método main.
// La JVM ejecutará ese método cuando corras el programa.
object RegresionLinealRecta {

  // El método main DEBE tener los args, aunque no lo usemos,
  // debe cumplir con la regla fija de la JVM
  def main(args: Array[String]): Unit = {

    val spark = SparkSession.builder()
      .appName("RegresionLinealRecta") // Nombre de la aplicación (aparece en logs y Spark UI)
      .master("local[*]") // Ejecuta en tu máquina local usando todos los cores
      .getOrCreate() // Si ya había un SparkSession, lo reutiliza

    // Ocultar logs
    spark.sparkContext.setLogLevel("OFF")

    // Habilita conversiones implícitas como Seq(...).toDF("col1", "col2")
    // Esto está importando miembros de una instancia concreta llamada spark,
    // solo tiene sentido después de que spark existe
    import spark.implicits._

    // 1. Dataset (altura, peso)
    val data = Seq(
        // TU CODIGO AQUI, Añade 10 tuplas de pares (Double),
        // donde el primer valor es la altura y el segundo el peso
          (158.0, 65.0), (160.0, 50.0), (163.0, 70.0), (165.0, 55.0), (168.0, 80.0),
      (170.0, 60.0), (173.0, 85.0), (175.0, 65.0), (178.0, 90.0), (180.0, 75.0),
      (183.0, 95.0), (185.0, 80.0), (188.0, 105.0), (190.0, 88.0), (155.0, 58.0),
      (157.0, 48.0), (162.0, 72.0), (164.0, 56.0), (167.0, 78.0), (169.0, 62.0),
      (172.0, 86.0), (174.0, 69.0), (177.0, 94.0), (179.0, 76.0), (182.0, 99.0),
      (184.0, 82.0), (187.0, 108.0), (189.0, 91.0), (192.0, 115.0), (194.0, 96.0),
      (161.2, 59.5), (166.8, 67.5), (171.5, 75.5), (176.2, 83.5), (181.8, 91.5),
      (159.0, 63.0), (164.0, 54.0), (169.0, 76.0), (174.0, 66.0), (179.0, 92.0),
      (184.0, 79.0), (189.0, 106.0), (154.0, 55.0), (196.5, 114.0), (198.5, 108.0),
      (152.0, 56.0), (157.0, 61.0), (162.0, 69.0), (167.0, 79.0), (172.0, 84.0),
      (177.0, 91.0), (182.0, 97.0), (187.0, 103.0), (192.0, 111.0), (151.5, 49.0),
      (156.5, 54.0), (161.5, 60.0), (166.5, 66.0), (171.5, 72.0), (176.5, 79.0),
      (181.5, 85.0), (186.5, 93.0), (191.5, 99.0), (153.5, 51.0), (158.5, 57.0),
      (163.5, 62.0), (168.5, 68.0), (173.5, 74.0), (178.5, 82.0), (183.5, 88.0),
      (188.5, 96.0), (193.5, 104.0), (154.5, 52.0), (159.5, 58.0), (164.5, 64.0),
      (169.5, 70.0), (174.5, 77.0), (179.5, 84.0), (184.5, 91.0), (189.5, 98.0)
    ).toDF("altura", "peso")


    // 2. VectorAssembler
    val assembler = new VectorAssembler()
      .setInputCols(Array("altura")) // TU CODIGO AQUI, Define la/las columnas numéricas de entrada.
      .setOutputCol("features") // Crea una columna nueva features de tipo Vector donde cada fila se ve como [fila]


    // Aplica esa transformación al DataFrame y deja solo esas 3 columnas
    val df = assembler.transform(data).select("features", "altura", "peso")


    // 3. Regresión lineal simple
    val lr = new LinearRegression()
      .setLabelCol("peso") // TU CODIGO AQUI, Define la columna objetivo y (lo que queremos predecir)
      .setFeaturesCol("features") // Columna X vectorial
      .setRegParam(0.6) // Sin regularización (λ = 0)
      .setElasticNetParam(0.1) // 0 = L2, 1 = L1

    val modelo = lr.fit(df) // TU CODIGO AQUI, Pasa como entrada el dataset

    val b = modelo.intercept
    val w = modelo.coefficients(0) // Como sólo hay una feature, está en la posición 0 del vector

    // Métricas
    // TU CODIGO AQUI, Añade r2
    val r2   = modelo.summary.r2
    val mse  = modelo.summary.meanSquaredError
    val rmse = modelo.summary.rootMeanSquaredError

    println("=== Modelo aprendido ===")
    println(s"Recta: peso = $b + $w * altura")
    println(s"R2:   $r2")
    println(s"MSE:  $mse")
    println(s"RMSE: $rmse")
    println()


    // 4. Predicción para nueva altura
    val nuevaAltura = 165.0
    val nuevoDF = Seq(nuevaAltura).toDF("altura") //TU CODIGO AQUI, Convierte en DF la nueva entrada
    val nuevoDFconFeatures = assembler.transform(nuevoDF) // TU CODIGO AQUI, Aplica transformación con Assembler
    val pred = modelo.transform(nuevoDFconFeatures) 

    println(s"=== Predicción para altura = $nuevaAltura cm ===")
    pred.show(false)

    //IMPORTANTE, Tanto la predicción con el modelo como la de la manera manual, deben ser iguales.
    val predDirecta = b + w * nuevaAltura // TU CODIGO AQUI, Realiza la predicción de manera manual, con la formula de regresión
    println(f"Predicción directa: peso ≈ $predDirecta%.2f kg")



    // 5. Datos para el gráfico

    val puntos = df.select("altura", "peso")
      .as[(Double, Double)]
      .collect()
      .sortBy(_._1)

    val xs: Array[Double]      = puntos.map(_._1)
    val ysReal: Array[Double]  = puntos.map(_._2)
    val ysRecta: Array[Double] = xs.map(x => b + w * x)

    // 6. Plot con XChart
    val chart = new XYChartBuilder()
      .width(900)
      .height(600)
      .title("Regresión Lineal Simple (Altura - Peso)")
      .xAxisTitle("Altura (cm)")
      .yAxisTitle("Peso (kg)")
      .build()

    val serieScatter = chart.addSeries("Datos reales", xs, ysReal)
    serieScatter.setXYSeriesRenderStyle(XYSeries.XYSeriesRenderStyle.Scatter)
    serieScatter.setMarker(new Circle())

    val serieRecta = chart.addSeries("Recta del modelo", xs, ysRecta)
    serieRecta.setXYSeriesRenderStyle(XYSeries.XYSeriesRenderStyle.Line)
    serieRecta.setMarker(new NoMarker())

    new SwingWrapper(chart).displayChart()

    println("Cierra la ventana para terminar.")

    spark.stop()
  }
}
