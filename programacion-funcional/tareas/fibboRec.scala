@main def llamado(n: Int) =
    print(fiboRec(n))

def fiboRec(n: Int): Long = {
  if (n == 0) {
    0
  } 
  else if (n == 1) {
    1
  } 
  else {
    fiboRec(n - 1) + fiboRec(n - 2)
  }
}

//scala-cli fibboRec.scala -- 8 