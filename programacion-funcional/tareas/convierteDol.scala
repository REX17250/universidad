@main def run() =
  println(usdTobob(10))
  println(usdTobob(10)(using 30.0))

given tasaCambio: Double = 6.97

def usdTobob(monto: Double)(using tasa: Double): Double =
  val t = summon[Double]
  monto * t
