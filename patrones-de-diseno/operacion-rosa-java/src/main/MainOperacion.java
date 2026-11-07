package main;
import java.util.List;

import casa.*;
import panteraRosa.*;
public class MainOperacion {
	public static void main(String[] args) {

    // DECORADO DE LA CASA

        Casa casa = new CasaObjetivo();
        casa = new Camaras(casa);
        casa = new Perros(casa);
        casa = new LaserInfrarojo(casa);
        casa = new PuertasAcorazadas(casa);
        casa = new PuertasElectronicas(casa);
        casa = new Dueño(casa);
        casa = new Fiesta(casa);

// DECORADO DE LA PANTERA ROSA 

        OperacionRosa pantera = new PanteraRosa();
        pantera = new HuesoGrande(pantera);
        pantera = new Sedante(pantera);
        pantera = new TrajeSombra(pantera);
        pantera = new GafasInfrarojas(pantera);
//        pantera = new GanzuaMaestra(pantera);
        pantera = new FlipperZero(pantera);
        pantera = new TrajeSmoking(pantera);

       // MOSTRAMOS GADGETS Y ELEMENTOS DE SEGURIDAD DE LA CASA
        System.out.println(" ");
        System.out.println("------------ SEGURIDAD DE LA CASA --------------");
        System.out.println(" ");

        System.out.println(casa.descripcion());
        System.out.println("Amenazas: " + casa.getAmenazas());

        System.out.println(" ");

        System.out.println("------------ HERRAMIENTAS DE LA PANTERA ROSA -------------");
        System.out.println(" ");

        System.out.println(pantera.descripcion());
        System.out.println("Gadgets: " + pantera.getGadgets());

        // UNA LISTA QUE VALIDA SI LA PANTERA ROSA PUEDE O NO INGRESAR A LA CASA

        boolean puedeEntrar = true;

        List<String> amenazas = casa.getAmenazas();
        List<String> gadgets = pantera.getGadgets();
        System.out.println(" ");

        System.out.println("------------ RESULTADO DE INFILTRACIÓN -------------------");
        System.out.println(" ");


        for (String amenaza : amenazas) {

            String counterNecesario = "CONTRA_" + amenaza;

            if (!gadgets.contains(counterNecesario)) {
                System.out.println("No puede contrarrestar: " + amenaza);
                puedeEntrar = false;
            } else {
                System.out.println("Contrarrestó: " + amenaza);
            }
        }

        if (puedeEntrar) {
            System.out.println(" ");

            System.out.println("La Pantera logró infiltrarse con éxito. ");
        } else {
            System.out.println(" ");

            System.out.println("Nooooo! la Pantera fue atrapada.");
        }
    }
}
