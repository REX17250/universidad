import scala.collection.mutable.ArrayBuffer

case class ChampionStats(damage: Double, gold: Double, name: String)
case class Centroid(damage: Double, gold: Double, id: Int)

class LoLMatchAnalyzer(k: Int, maxIterations: Int) {
  
  private def calculateDistance(p1: (Double, Double), p2: (Double, Double)): Double = {
    math.sqrt(math.pow(p1._1 - p2._1, 2) + math.pow(p1._2 - p2._2, 2))
  }

  def analyzeMatch(data: Array[ChampionStats]): Array[Centroid] = {
    println(s"Iniciando análisis K-Means con ${data.length} datos fijos")

    val initialCentroids = Array(
      Centroid(data(0).damage, data(0).gold, 1),
      Centroid(data(data.length - 1).damage, data(data.length - 1).gold, 2)
    )

    var centroids = initialCentroids
    
    for (iteration <- 1 to maxIterations) {
      val clusters = Array.fill(k)(ArrayBuffer[ChampionStats]())

      for (stat <- data) {
        val closestCentroid = centroids.minBy { c => 
          calculateDistance((stat.damage, stat.gold), (c.damage, c.gold)) 
        }
        clusters(closestCentroid.id - 1) += stat
      }

      val newCentroids = centroids.map { oldCentroid =>
        val clusterPoints = clusters(oldCentroid.id - 1).toArray
        if (clusterPoints.isEmpty) {
          oldCentroid
        } else {
          val newDamage = clusterPoints.map(_.damage).sum / clusterPoints.length
          val newGold = clusterPoints.map(_.gold).sum / clusterPoints.length
          Centroid(newDamage, newGold, oldCentroid.id)
        }
      }

      val maxMovement = newCentroids.zip(centroids).map { case (newC, oldC) =>
        calculateDistance((newC.damage, newC.gold), (oldC.damage, oldC.gold))
      }.max

      if (maxMovement < 0.0001) {
        println(s"Convergencia alcanzada en iteración $iteration.")
        return newCentroids
      }
      centroids = newCentroids
    }
    centroids
  }
}

@main def runDeterministicAnalysis(): Unit = {
  
  val manualData = new Array[ChampionStats](100)

  for (i <- 0 until 100) {
    
    if (i < 50) {
      val dmg = 1.5 + (i * 0.05) 
      val gold = 1.2 + (i * 0.04)
      
      manualData(i) = ChampionStats(dmg, gold, s"Tank_LowEco_$i")
      
      if (i < 3) println(s"Generando dato $i: [Dmg: ${"%.2f".format(dmg)}, Gold: ${"%.2f".format(gold)}]")

    } else {
      val j = i - 50
      
      val dmg = 7.0 + (j * 0.06)
      val gold = 8.0 + (j * 0.03)
      
      manualData(i) = ChampionStats(dmg, gold, s"Carry_HighEco_$j")
      
      if (i == 50) println(s"Generando dato $i: [Dmg: ${"%.2f".format(dmg)}, Gold: ${"%.2f".format(gold)}] (Cambio de patrón)")
    }
  }

  val analyzer = new LoLMatchAnalyzer(k = 2, maxIterations = 100)
  val resultCentroids = analyzer.analyzeMatch(manualData)

  resultCentroids.foreach { c =>
    println(s"Centroide ${c.id}: Daño promedio ${"%.2f".format(c.damage)}k, Oro promedio ${"%.2f".format(c.gold)}k")
  }
  
  println("Verificación")
  val testChamp = manualData(25)
  println(s"Probando con el dato generado #25 (${testChamp.name}) -> Dmg: ${"%.2f".format(testChamp.damage)}")
  
  val closest = resultCentroids.minBy(c => math.sqrt(math.pow(testChamp.damage - c.damage, 2) + math.pow(testChamp.gold - c.gold, 2)))
  println(s"Se agrupó correctamente en el Cluster ${closest.id}")
}