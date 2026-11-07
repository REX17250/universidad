package com.example.pruebas

import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        var variableNuleable: Int? = null
        val nombreEstudiante: String = "Hugo";
        val apellidoPaterno: String? = null
        var variableInt = 0


        variableNuleable = 12
        variableNuleable = apellidoPaterno?.length ?: 0

        val estudiante1 = Estudiante(
            "Diego",
            "Fabian",
            "Loayza",
            "Arraya",
            85092,
            20,
            4
        )
        val estudiante2 = Estudiante(
            "Pablo",
            "Andres",
            "Ramirez",
            "Terrazas",
            85093,
            30,
            4
        )
        val estudiante3 = Estudiante(
            "Natalia",
            "Aylin",
            "Arteaga",
            "Iriarte",
            85094,
            20,
            4
        )

        val apellidoCompleto: String = estudiante1.apellidoPaterno + estudiante1.apellidoMaterno
        val apellidocompleto: String = "El apellido completo es: ${estudiante1.apellidoPaterno} ${estudiante1.apellidoMaterno}"
        estudiante1.edad = 20

        println(apellidoCompleto)
        println(apellidocompleto)

        suma(2,3)
        multiplicacion(3,4)
        println(nombreCompleto(estudiante1))
        println(codigo(estudiante1))

        val miPrimeraLista: List<String> = listOf("hola", "mundo", "progra3")
        //miPrimeraLista.add(no sirve)
        miPrimeraLista.get(0)
        //miPrimeraLista = listOf("")

        val miListaMutable: MutableList<String> = mutableListOf("Hola", "Curso", "progra 3")
        miListaMutable.add("como estás")
        miListaMutable.add("buen lunes")

        //miListaMutable = mutableListOf("progra 3") (no sirve)

        menMay(2,2,3)
        mayMen(1,2,1)

        for(i in 1..10 step 3){
            println(i)
        }

        for(i in 10 downTo 1 step 2){
            println(i)
        }

        for (i in "Hola Mundo"){
            println(i)
        }

        val listaGrupo: List<Estudiante> = estLista(estudiante1, estudiante2, estudiante3)

        listaGrupo.forEach{
            println(it.primerNombre)
            if(it.primerNombre == "Diego") {
                println("Hola ${it.primerNombre}")
            }
        }

        listaGrupo.forEach{ integrante ->
            println(integrante.primerNombre)
        }

        factorial(5)
        fibonacci(10)
        fibonacci(5)

        "holamundo".largoEsPar()
        val ejemploStr: String = "holamundo"
        println(ejemploStr.largoEsPar())

        val ejemploInt: Int = 3
        println(ejemploInt.esImpar())

        estudiante1.semestre = 1

        val buttonEjemplo: Button = findViewById(R.id.button_ejemplo)

        buttonEjemplo.setOnClickListener{
            println("fui clickeado")
        }

        println(ord(mutableListOf(3,4,5,7,23,5,4,3,2,1,-2,-9,-4,-10,-10)))

        FizzBuzz()
    }

    fun ejemplo(textoEjemplo: String){
        val ejemploConcatendo = "El String que recibi es $textoEjemplo"
        println(ejemploConcatendo)
    }

    fun suma(a: Int, b: Int){
        println(a+b)
    }

    fun multiplicacion(a: Int, b: Int){
        println(a*b)
    }

    fun nombreCompleto(est: Estudiante):String {
        return "${est.primerNombre} ${est.valSegundoNombre} ${est.apellidoPaterno} ${est.apellidoMaterno}"
    }

    fun codigo(est: Estudiante):Boolean{
        if(est.codigo % 2 == 0){
            return true
        }else{
            return false
        }
    }

    fun mayMen(a: Int, b: Int, c:Int){
        if(a>b){
            if(b>c){
                println("$a, $b, $c")
            }else
                if(a>c){
                    println("$a. $c, $b")
                }else{
                    println("$c. $a, $b")
                }
        }else{
            if(a>c){
                println("$b, $a, $c")
            }else{
                if(b>c){
                    println("$b, $c, $a")
                }else{
                    println("$c, $b, $a")
                }

            }
        }
    }

    fun menMay(a: Int, b: Int, c:Int){
        if(a>b){
            if(b>c){
                println("$c, $b, $a")
            }else
                if(a>c){
                    println("$b. $c, $a")
                }else{
                    println("$b. $a, $c")
                }
        }else{
            if(a>c){
                println("$c, $a, $b")
            }else{
                if(b>c){
                    println("$a, $c, $b")
                }else{
                    println("$a, $b, $c")
                }

            }
        }
    }

    fun estLista(est1: Estudiante, est2: Estudiante, est3: Estudiante): List<Estudiante>{
        val grupo: MutableList<Estudiante> = mutableListOf(est1, est2, est3)
        return grupo
    }

    fun estMap(est1: Estudiante, est2: Estudiante, est3: Estudiante): Map<Int, Estudiante>{
        var mapaG = mutableMapOf<Int, Estudiante>()
        mapaG.put(est1.codigo, est1)
        mapaG.put(est2.codigo, est2)
        mapaG.put(est3.codigo, est3)
        return mapaG
    }

    fun nombresG(grupo: List<Estudiante>){
        println("El grupo está conformado por: ${grupo.get(0).primerNombre}, ${grupo.get(1).primerNombre}, ${grupo.get(2).primerNombre}" )
    }

    fun factorial(a: Int) {
        if(a>0) {
            var f = 1
            for (i in 1..a) {
                f *= i
            }
            println("El factorial de $a es $f")
        }else{
            println("El factorial no existe")
        }
    }

    fun fibonacci(c: Int) {
        var a = 0
        var b = 1
        var f = 1
        if (c<0) {
            println("No existe")
        }else if (c == 0){
            println("0")
        }else if (c == 1){
            println("0 - 1")
        }else if (c > 1) {
            var fibo: String = ("$a - $b")
            for (i in 1..c - 2) {
                f = a + b
                a = b
                b = f
                fibo += (" - $f")
            }
            println(fibo)
        }

    }


    //funciones de extensión como .length .size ...
    fun String.largoEsPar(): Boolean{
        return this.length % 2 == 0
    }

    fun Int.esImpar(): Boolean{
        return this % 2 != 0
    }

    fun listaAR(lista: List<String>):List<String>{
        val listaAR: MutableList<String> = mutableListOf()
        for(i in lista.size - 1 downTo 0){
            listaAR.add(lista.get(i))
        }
        return listaAR
    }

    fun ord(num: MutableList<Int>): List<Int>{
        val listaMeMa: MutableList<Int> = mutableListOf()
        var menor: Int = 100000
        var set: Int = 0
        val fin = num.size
        while(listaMeMa.size!=fin){
            for(i in 0..num.size-1){
                if(menor>num.get(i)) {
                    menor = num.get(i)
                    set = i
                }
            }
            num.set(set,10000)
            listaMeMa.add(menor)
            menor = 100000
        }
        return listaMeMa
    }

    fun FizzBuzz(){
        for(i in 1..100){
            if(i % 3 == 0 && i % 5 == 0){
                println("FizzBuzz")
            }else if(i % 3 == 0){
                println("Fizz")
            }else if(i % 5 == 0){
                println("Buzz")
            }else{
                println(i)
            }
        }
    }
}