// Función que recibe una función de gradiente y devuelve función de update
//Recibe una función y devuelve una función
//La función que recibe es la gradiente que queremos aplicar
//La función que devuelve es una que aplica la función que recibe y aplica argumentos
//La función que devuelve devuelve los nuevos valores de newW y newU
def perceptron2DUpdateRule(lr: Double)
(gradFn: (Double, Double, Double, Double, Double) => (Double, Double)): 

    (Double, Double, Double, Double, Double) => (Double, Double) =
    (w: Double, u: Double, x1: Double, x2: Double, y: Double) => {
      val (gw, gu) = gradFn(w, u, x1, x2, y)
      val newW = w + lr * gw
      val newU = u + lr * gu
      (newW, newU)
    }



@main def main() = {
// Gradiente para regresión lineal simple (y - (wx1 + ux2))
val perceptronGrad2D = (w: Double, u: Double, x1: Double, x2: Double, y: Double) => {
  val prediction = w * x1 + u * x2
  val error = y - prediction
  (error, error) // gradiente igual para ambos, como en tu ejemplo
}

// Crear función actualizadora
val lr = 0.01
val update2D = perceptron2DUpdateRule(lr)(perceptronGrad2D)

// Datos: resolver 2w + 3u = 17
val X = List((2.0, 3.0))
val Y = List(17.0)

// Inicializar pesos
var w = scala.util.Random.nextDouble()
var u = scala.util.Random.nextDouble()

println(s"Pesos iniciales: w=$w, u=$u\n")

val epochs = 1000

// Entrenamiento
for epoch <- 1 to epochs do
  for i <- X.indices do
    val (x1, x2) = X(i)
    val y = Y(i)

    val (newW, newU) = update2D(w, u, x1, x2, y)

    w = newW
    u = newU

  if epoch % 10 == 0 then
    println(f"Epoch $epoch%4d -> w=$w%.4f u=$u%.4f")

println(s"\nPesos finales: w=$w, u=$u")

// Validación
val result = 2*w + 3*u
println(f"\nValidación: 2w + 3u = $result%.4f (esperado: 17)")
}