@main def llamado() =
    val sensores: List[Sensor] = List(new SensorTemperatura(4.0), new SensorHumedad(4.0))
    sensores.foreach{mostrarLectura}


abstract class Sensor:
    def leer: Double
    def info: String = "Sensor genérico"

class SensorTemperatura (grados: Double) extends Sensor:
    override def leer: Double = grados
    
class SensorHumedad (porcentaje: Double) extends Sensor:
    def leer: Double = porcentaje

def mostrarLectura(s: Sensor) = println(s"Lectura: ${s.leer}")


    