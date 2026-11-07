@main def ejecutar() =

    //a-versión impura rompe transparencia
    var externa = 0

    def funImpura(n: Int): Int = 
        externa += 1 //aquí modifica algo externo por lo que ya no es pura
        (n * n) + externa

    println(funImpura(2))
    externa = 80 //al momento de cambiar esa variable externa también cambian los resultados por lo que se elimina la transparencia
    println(funImpura(2))

    //b-versión pura

        
    //Función pura
    def funPura(n: Int): Int = (n * n) + 1

    //Implementación lazylist
    lazy val nums: LazyList[Int] = LazyList.from(1).map(funPura)
    val valores = nums.take(10).toList //10 primeros valores
    println(valores)//en este caso no importa que variable cambiemos si le pasamos los mismos parametros fuera de la función pura nos dará los mismos resultados y no cambiará nada externo

    externa = 59//en este caso no afecta en nada

    val valoress = nums.take(10).toList
    println(valoress)

    //explicando lazylist:
        //permite trabajar con infinitos porque no relaciona sus datos con la ejecución de la función y mantiene 
        //la pureza porque el resultado de esa ejecución una vez conocido es guardado en la memoria
