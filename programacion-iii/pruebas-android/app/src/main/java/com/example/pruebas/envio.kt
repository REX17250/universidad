package com.example.pruebas

import android.annotation.SuppressLint
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
import com.example.pruebas.R.id.button_enviar

class envio : AppCompatActivity() {
    val context: Context = this

    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_envio)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        val editTextEjemplo: EditText = findViewById(R.id.edit)
        val buttonEnviar: Button = findViewById(R.id.envio)

        val intentCambio_new_Activity: Intent = Intent(context, editText_botton::class.java)

        buttonEnviar.setOnClickListener {
            val textoEscrito: String = editTextEjemplo.text.toString()
            intentCambio_new_Activity.apply {
                putExtra("Id_datos", textoEscrito)
            }
            val intentCambioMain: Intent = Intent(context, editText_botton::class.java)
            startActivity(intentCambioMain)
        }
    }
}