@main def llamado(a: Int, b: Int)=  
    val porcentajeDeuda: Int => (Int => Int) = {(porcentaje: Int) => (monto: Int) => (monto * porcentaje) / 100}

    val c1 = porcentajeDeuda(10)
    val c2 = c1(100)
    println(c2)
    //scala-cli deuda.scala -- 500 2000