//type clases
    trait Show[A]:
        def show(x: A): String
//trait sin given
class ShowInt extends Show[Int]:
    override def show(x: Int) = s"Numero($x)"
    
val s = new ShowInt
println(s.show(5))

//trait con given
    //1ra opción
given Show[Int]with
    def show(x: Int) = s"Numero($x)"

extension [A](x:A)
    def show(using sh: Show[A]) = sh.show(x)

5.show

    //2da opción
given Show[Int]with
    def show(x: Int) = s"Numero($x)"

def mostrar[A](x: A)(using sh: Show[A]): String = 
    sh.show(x)
    
mostrar(5)


//Functor
val x: Option[Int] = Some(5)
val r = x.map(_*2)
println(r)

val nested: Option[List[Int]] = Some(List(1,2,3))
val r = nested.map(_.map(_*10))
println(r)

def validarEdad (edad: Int): Either[String, Int] =
    if edad >= && edad <=120 then
        Right(edad)
    else
        Left("Edad invalida")

val edad1 = validarEdad(25).map(_+5)
val edad2 = validarEdad(-10).map(_+5)

println(edad1)
println(edad2)

