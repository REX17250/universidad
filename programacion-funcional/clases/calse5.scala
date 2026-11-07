def suma(a:Int, b:Int):Int = a+b
def sumaCurried(a:Int)(b:Int):Int=a+b
sumaCurried(1)(2)

val sumaCurried =(a:Int) => (b:Int) => a+b
println(sumaCurried(2)(5))

val f = (a:Int, b:Int) => a+b
val curried = f.curried
val uncurried = Function.uncurried(curried)

//Ejercicio
val areaRectCurried = (a:Int) => (b:Int) => a*b
val f = (a:Int, b:Int) => a*b
val curried = f.curried