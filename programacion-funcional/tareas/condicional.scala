@main def condicional(n: Int)(f: Int) =
  if (n == 0) {
    print("cero")
  } else if (f == 0) {
    print("error: factor 0")
  } else if (n % f == 0) {
    print("divisible")  
  } else {
    print("no divisible")
  }


//scala-cli condicional.scala -- 5 9