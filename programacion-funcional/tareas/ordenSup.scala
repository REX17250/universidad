@main def run(): Unit = {
    val c1 = procesarMonto(3)
    println(c1(177))
    
}
def porcentajeDeuda: Int => (Int => Double) = {(porcentaje: Int) => (monto: Int) => (monto * porcentaje) / 100}

def redondear(n: Double): Double = math.round(n)

def formatear(n: Double): String = s"${n}"

def procesarMonto(porcentaje: Int): Int => String ={
  porcentajeDeuda(porcentaje) andThen redondear andThen formatear
}
