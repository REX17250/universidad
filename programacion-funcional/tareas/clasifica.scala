@main def llamado(x: Int)=
    println(curr("Resultado")(x))


def curr (pre: String)(x: Int): String =
    val result = x match
        case 0 => "cero"
        case x if x>0 => "positivo"
        case _ => "negativo"
    s"$pre $result"

