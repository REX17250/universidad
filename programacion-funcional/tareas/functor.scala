@main def llamado()=
    val x: Option[Double] = Some(100.0)
    val impuesto = x.map(v => v * 0.13 + v * 1).map(v => v * 1 - v * 0.05)
    println(impuesto)
    println(FC(x)) 


def FC(v: Option[Double]): Option[Double] = 
  for {
    precio <- v
    impuesto = precio * 1.13
    desc = impuesto - 5.0
  } yield desc
