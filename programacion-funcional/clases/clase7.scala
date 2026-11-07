lazy val y = {
    println("calculando y")
    20
}

lazy val y: Int

println("antes de usar y")
println(y)
println(y)

val nums: LazyList[Int] = LazyList.from(1)
val firstTen = nums.take(10).toList
println(firstTen)

val pares: LazyList[Int] = LazyList.from(1).filter(_%2==0)
val firstTen = pares.take(20).toList
println(firstTen)

var discount = 10

def applyDiscount(price: Double, disc: Int): Double =
    price-(price*disc/100)

val use = applyDiscount(100, discount)
println(use)

var nums = List(1,2,3,4,5,6,7,8,9,10)

def fp(lis: List[Int]): List[Int] =
    lis.filter(_%2==0).map(x=>x*x)

val use = fp(nums)
println(use)


def factorial(n: Int): Int = {
        if (n <= 1) then 1
        else n*factorial(n-1)
}
lazy val factorials: LazyList[Int] = LazyList.from(1).map(x=>factorial(x))

val primeros10 = factorials.take(10).toList
println(primeros10)