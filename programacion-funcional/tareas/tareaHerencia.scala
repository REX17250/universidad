@main def llamado() =
    val vehiculos: List[Vehiculo] = List(new auto(4, "Toyota"), new moto(400, "Yamaha"))
    vehiculos.foreach { f => println(s"${f.descripcion}")}


class Vehiculo(val marca: String):
    def descripcion: String = s"Vehículo marca $marca"

class auto (val puertas: Int, val marca: String) extends Vehiculo:
    override def descripcion: String = s"Auto marca $marca con $puertas puertas"

class moto (val cilindrada: Int, val marca: String) extends Vehiculo:
    override def descripcion: String = s"Moto marca $marca con $cilindrada de cilindrada"