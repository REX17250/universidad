@main def llamado()=
    val moduloLuz = new moduloLuz(2.0)
    val moduloSuelo = new moduloSuelo(4.0)
    funC(moduloLuz)("ALERTA")
    funC(moduloSuelo)("OK")

abstract class modulo:
    def medir: Double
    def descripcion: String = "Modulo ambiental"

class moduloLuz(lux: Double) extends modulo:
    override def medir: Double = lux

class moduloSuelo(humedad: Double) extends modulo:
    override def medir: Double = humedad

def funC(mod: modulo)(s: String)=
    println(s"$s ${mod.medir}")