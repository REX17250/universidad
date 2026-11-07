@main def llamado()=

    val salarios = List(10000.0,20000.0,30000.0,40000.0,50000.0)

    val maySB = (sal: List[Double])=>sal.filter(x=>x>=15000)
    val aum = (aumentados:List[Double])=>aumentados.map(x=>x*0.05+x)
    val mqt = (sf: List[Double])=> sf.map(x => if (x>30000) x+x*0.1 else x+x*0.05)

    val pipeline = maySB andThen aum andThen mqt

    println(pipeline(salarios))