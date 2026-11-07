@main def llamado(multiplo: Int, numsString: String) =

    val nums: List[Int] = numsString.split(',').map(_.toInt).toList
    val addMul = imparPor10(multiplo)
    print(addMul(nums))


def imparPor10(mul: Int): List[Int] => List[Int] =
    (lista: List[Int]) => lista.filter(_%2!=0).map(_*mul)

//scala-cli imparPor10.scala -- 10 1,2,3,4,5,6,7
