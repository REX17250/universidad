package com.example.pruebas

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class interaccionesDeVistasActivity : AppCompatActivity() {

    val context: Context = this
    companion object{
        val ID_PASO_DE_DATOS_STRING: String = "id_envio_de_datos"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_interacciones_de_vistas)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val textViewEjemplo: TextView = findViewById(R.id.textview_ejemplo1)
        textViewEjemplo.text = "Este es un ejemplo de texto desde Kotlin"

        val buttonEjemplo: Button = findViewById(R.id.button_ejemplo)
        buttonEjemplo.setOnClickListener {
            val intentCambioMain: Intent = Intent(context, MainActivity::class.java)
            startActivity(intentCambioMain)
        }

        val editTextEjemplo: EditText = findViewById(R.id.edittext_ejemplo)
        val textViewUsuario: TextView = findViewById(R.id.nombre_usuario)
        val buttonEnviar: Button = findViewById(R.id.button_enviar)

        val intentCambio_new_Activity: Intent = Intent(context, editText_botton::class.java)

        buttonEnviar.setOnClickListener {
            val textoEscrito: String = editTextEjemplo.text.toString()
            textViewUsuario.text = textoEscrito
            intentCambio_new_Activity.apply {
                putExtra("Id_datos", textoEscrito)
            }
        }



    }

    override fun onStart() {
        super.onStart()
        println("onStart")
    }

    override fun onDestroy() {
        super.onDestroy()
    }
}