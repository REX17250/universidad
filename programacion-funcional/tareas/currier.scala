@main def currier(numsString: String) =
    val nums: List[Int] = numsString.split(',').map(_.toInt).toList

    val suma = (a:Int) => (b:Int) => a+b
    val mul = (a:Int) => (b:Int) => a*b

    var a: Int = 0
    var addMul: (Int) => Int = mul(nums(a))
    var addSum: (Int) => Int = suma(nums(a))
    var resul: Int = 0
    var res: Int = 0

    for (a <- nums.indices){
        res = addSum(nums(a))
        addSum = suma(res)

        resul = addMul(nums(a))
        addMul = mul(resul)
    }
    res = res - 1
    println(res)
    println(resul)

//scala-cli currier.scala -- 1,2,3,4,5,6,7