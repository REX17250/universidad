@main def llamado()=

    val nums = List(1,2,3,4,5)
    val res=(menor(nums))
    println(s"Lista inicial $nums")
    println(s"Límite 4")
    println(s"Resultado $res")

def menor(nums:List[Int]):List[Int]=
    nums.filter(x => x<=4).map(x => x*2).map(x => if (x>10) x+5 else x)
