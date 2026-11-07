import scala.annotation.tailrec
@main def llamadoRec(n: Int) =
    print(sumaTR(n))

def sumaHastaN(n: Int): Int = {
  if (n <= 0) {
    0
  }
  else {
    n + sumaHastaN(n - 1)
  }
}



def sumaTR(n: Int): BigInt = {
    def loop(x: Int, acc: BigInt): BigInt = {
        if (x <= 0) acc
        else loop(x-1,x+acc)
    }
    loop(n,1)
}
    //scala-cli sumaNRecursiva.scala -- 50000