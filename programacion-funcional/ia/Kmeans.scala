//> using dep "org.knowm.xchart:xchart:3.8.8"
import org.knowm.xchart.{SwingWrapper, XYChartBuilder, XYSeries}
import org.knowm.xchart.style.markers.SeriesMarkers
import org.knowm.xchart.style.lines.SeriesLines
import scala.util.Random
import java.awt.Color

@main def llamado() =
    
    new KMeansBlobs().ejecutar()

class KMeansBlobs {

  type Point = Vector[Double]

//código chat generar dataset
  def makeBlobs(nSamples: Int, centers: Int, std: Double, randomState: Int): Seq[Point] = {
    val rand = new Random(randomState)
    val trueCentroids = (0 until centers).map { _ =>
      Vector(rand.nextDouble() * 20, rand.nextDouble() * 20)
    }
    val samplesPerCenter = nSamples / centers
    trueCentroids.flatMap { center =>
      (0 until samplesPerCenter).map { _ =>
        Vector(
          center(0) + rand.nextGaussian() * std,
          center(1) + rand.nextGaussian() * std
        )
      }
    }
  }

  def euclideanDistance(p1: Point, p2: Point): Double =
    math.sqrt(p1.zip(p2).map { case (a, b) => math.pow(a - b, 2) }.sum)

  def mean(points: Seq[Point]): Point =
    points.transpose.map(_.sum / points.size).toVector

  def kMeans(data: Seq[Point], k: Int, maxIter: Int): (Seq[Int], Seq[Point]) = {
    val rand = new Random(42)
    var centroids = rand.shuffle(data).take(k)
    var labels = Seq.fill(data.length)(0)

    for (i <- 1 to maxIter) {
      labels = data.map { point =>
        centroids.indices.minBy(idx => euclideanDistance(point, centroids(idx)))
      }

      centroids = centroids.indices.map { idx =>
        val clusterPoints = data.zip(labels).filter(_._2 == idx).map(_._1)
        if (clusterPoints.nonEmpty) mean(clusterPoints) else centroids(idx)
      }
    }
    (labels, centroids)
  }

  def plotXChart(data: Seq[Point], labels: Seq[Int], centroids: Seq[Point]): Unit = {
    val chart = new XYChartBuilder()
      .width(800)
      .height(600)
      .title("K-Means Clustering")
      .xAxisTitle("X")
      .yAxisTitle("Y")
      .build()

    chart.getStyler.setChartBackgroundColor(Color.WHITE)
    chart.getStyler.setLegendVisible(true)
    chart.getStyler.setPlotGridLinesVisible(false)

    val k = centroids.length

    for (i <- 0 until k) {
      val clusterPoints = data.zip(labels).filter(_._2 == i).map(_._1)
      val xData = clusterPoints.map(_(0)).toArray
      val yData = clusterPoints.map(_(1)).toArray

      if (xData.nonEmpty) {
        val series = chart.addSeries(s"Cluster $i", xData, yData)
        series.setXYSeriesRenderStyle(XYSeries.XYSeriesRenderStyle.Scatter)
        series.setMarker(SeriesMarkers.CIRCLE)
      }
    }

    val centroidX = centroids.map(_(0)).toArray
    val centroidY = centroids.map(_(1)).toArray
    val centroidSeries = chart.addSeries("Centroides", centroidX, centroidY)
    
    centroidSeries.setXYSeriesRenderStyle(XYSeries.XYSeriesRenderStyle.Scatter)
    centroidSeries.setMarker(SeriesMarkers.DIAMOND)
    centroidSeries.setMarkerColor(Color.BLACK)
    centroidSeries.setLineStyle(SeriesLines.NONE)

    new SwingWrapper(chart).displayChart()
  }

  def ejecutar(): Unit = {
    val nSamples = 400
    val k = 3
    val iter = 10

    val X = makeBlobs(nSamples, k, std = 1.2, randomState = 123)
    val (labels, centroids) = kMeans(X, k, iter)

    centroids.zipWithIndex.foreach { case (c, i) =>
      println(s"Cluster ${i + 1}: [${c(0).formatted("%.2f")}, ${c(1).formatted("%.2f")}]")
    }

    plotXChart(X, labels, centroids)
  }
}
