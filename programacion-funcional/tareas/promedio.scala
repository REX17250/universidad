@main def llamado(numsString: String) =
    val nums: List[Int] = numsString.split(',').map(_.toInt).toList
    val pares = (p: List[Int]) => p.filter(_%2==0)
    val mulTres = (mt: List[Int]) => mt.map(_*3)
    val sum1 = (s: List[Int]) => s.map(_+1)
    val pipeline = pares andThen mulTres andThen sum1
    print(pipeline(nums))
    
//scala-cli promedio.scala -- 1,2,3,4,5,6,7
