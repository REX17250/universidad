val x = 2

val result = x match
    case 1 => "uno"
    case 2 => "dos"
    case _ => "otro"

println(x)
println(result)

//monad
//ejemplo sin monad
val x = Option("10".toInt)

val r =
    x match
        case Some(n) => Some(n+1)
        case None => None

println(r)

//ejemplo con monad
def toInt(s: String): Option[Int] =
    if s.matches("_?[0-9]+") then Some(s.toInt) else None

def divideTen(x: Int): Option[Int] =
    if x==0 then None else Some(10/x)

//sin monad
val result = 
    toInt("5") match
        case Some(n) =>
            divideTen(n) match
                case Some(r) => Some(r)
                case None => None
        case None => None
println(result)

//con monad(maneja some y none interno el for comprenhension)
val result =
    for 
        n <- toInt("5")
        r<- divideTen(n)
    yield r
println(result)