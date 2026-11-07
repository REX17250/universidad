@main def llamado(): Unit = 
    val contrasenas = List("abc", "password", "pass1234", "ScalaR0cks!")

    val validadorLongitud = crearValidadorTexto(new ReglaLongitudMinima(8))("Contraseña suficientemente larga")
    val validadorNumero = crearValidadorTexto(new ReglaContieneNumero())("Contraseña debe incluir un número")

    contrasenas.foreach { contrasena =>
        validadorLongitud(contrasena)
        validadorNumero(contrasena)
    }

trait ReglaTexto:
    def validar(s: String): Boolean


class ReglaLongitudMinima(min: Int) extends ReglaTexto :
    override def validar(s: String): Boolean = s.length >= min


class ReglaContieneNumero extends ReglaTexto :
    override def validar(s: String): Boolean = s.exists(_.isDigit)


def crearValidadorTexto(regla: ReglaTexto)(mensajeOK: String): String => String = 
    (contrasena: String) => {
        if (regla.validar(contrasena)) {
            s"OK: $mensajeOK"
        } else {
            s"ERROR: $mensajeOK ($contrasena)"
        }
    }


