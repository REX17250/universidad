@main def llamado() =
    //1)
    val suma = (a: Int, b: Int) => a+b
    println(suma(3,5))
    //2)
    def volumen (largo: Int)(ancho: Int)(alto: Int)= largo*ancho*alto
    println(volumen(2)(3)(4))
    //3)
    def aplicarDosVeces(f: Int => Int, x: Int) = f(f(x))
    println(aplicarDosVeces(x=>x*x, 3))
    //4)
    val entrada = List(1,2,3,4,5)
    val mul = (nums: List[Int]) => nums.map(_*2)
    val sum = (nums: List[Int]) => nums.map(_+4)
    val fil = (nums: List[Int]) => nums.filter(_%2==0)
    val pipeline = mul andThen sum andThen fil
    println(pipeline(entrada))
    //5)
    def filtro (filtro: Int): (List[Int]) => List[Int] =
        return (lista: List[Int]) => lista.filter(_%filtro==0)

    val filtro2:(List[Int])=>List[Int]=filtro(2)
    val entrada: List[Int] = List[Int] (1,2,3,4,5,6)
    println(filtro2(entrada))
    //6)
    def sumaT(n: Int): Int =
        if(n<=0) 0
        else (2*n) + sumaT (n-1)

    println(sumaT(4))
