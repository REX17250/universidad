// 1. abstract class Dispositivo con método abstracto encender(): Unit
abstract class Dispositivo {
  def encender(): Unit
}

// 2. trait ConWifi con método conectarWifi()
trait ConWifi {
  def conectarWifi(): Unit = {
    println("Conectado a la red WiFi exitosamente.")
  }
}

// 3. trait ConBluetooth con método conectarBT()
trait ConBluetooth {
  def conectarBT(): Unit = {
    println("Vinculado con dispositivo Bluetooth.")
  }
}

// 4. Clase SmartWatch que mezcle ambos traits y sobrescriba encender
class SmartWatch extends Dispositivo with ConWifi with ConBluetooth {
  
  // Sobrescribimos el método abstracto de la clase padre
  override def encender(): Unit = {
    println("Iniciando sistema del SmartWatch...")
    // Podemos llamar a los métodos de los traits aquí si queremos
    conectarWifi() 
    conectarBT()
    println("SmartWatch listo para usar.")
  }
}

// --- Bloque para probar el código (Main) ---
object Main extends App {
  val miReloj = new SmartWatch()
  miReloj.encender()
}