@main def llamado(numsString: String) =
    val nums: List[Int] = numsString.split(',').map(_.toInt).toList
    val mayorIgual = (p: List[Int]) => p.filter(_>=10000)
    val incremento = (i: List[Int]) => i.map(x => x + x * 0.10)
    //val incremento: List[Int] => List[Double] = (i: List[Int]) => i.map(x => x + x * 0.10)
    val norm = (n: List[Double]) => n.map(_/n.max)
    val pipeline = mayorIgual andThen incremento andThen norm

    print(pipeline(nums))

    //scala-cli normaliza.scala -- 1,2,3,4,5,6,7
