@main def llamadoRec(n: Int) =
    print(factorialSimple(n))

def factorialSimple(n: Int): Long = {
  if (n <= 1) {
    1
  } 
  else {
    n * factorialSimple(n - 1)
  }
}

//scala-cli factorialN.scala -- 5