import scala.annotation.tailrec
@main def llamadoRec(n: Int) =
    print(factorialTR(n))

def factorialTR(n: Int): BigInt = {
    def loop(x: Int, acc: BigInt): BigInt = {
        if (x <= 0) acc
        else loop(x-1,x*acc)
    }
    loop(n,1)
}
    //scala-cli tailrecursion.scala -- 5000