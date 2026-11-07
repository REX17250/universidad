@main def llamado()=
    println(sumaP("3","5"))

def toInt (s: String): Option[Int]=
    if s.matches("_?[0-9]+") then Some(s.toInt) else None

def verificar (x: Int): Option[Int]=
    if x>0 then Some(x) else None


def sumaP(x: String, y: String): Option[Int]=
    for 
        n <- toInt(x)
        n1 <- toInt(y)
        r <- verificar(n)
        r1 <- verificar(n1)
    yield r+r1