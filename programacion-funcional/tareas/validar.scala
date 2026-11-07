@main def llamado()=
    println(validar("Ana"))
    println(validar("Li"))
    println(validar("         "))
    println(validar("  Luis  "))

trait Regla[A]:
    def regla(x: A): Option[A]

class masDe3 extends Regla[String]:
    def sinEspacios(s: String): Option[String] = Some(s.trim)
    override def regla(s: String): Option[String]=
        if (s.length()>=3) then Some(s) else None



def validar(s: String): Option[String]=
    val o = new masDe3()
    for 
        n <- o.sinEspacios(s)
        r <- o.regla(n)
    yield r

