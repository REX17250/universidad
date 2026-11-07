@main def llamado()=
    given prefijo: String = ">>"

    extension (s: String)
        def marcar: String = prefijo + s + prefijo

    println("hola".marcar)  
    