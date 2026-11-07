package casa;

import java.util.ArrayList;
import java.util.List;


public class Camaras extends DispositivosSeguridad {
	public Camaras(Casa casa) {
        super(casa);
    }

    @Override
    public String descripcion() {
        return casa.descripcion() + " + Cámaras de Seguridad";
    }

    @Override
    public List<String> getAmenazas() {
        List<String> lista = new ArrayList<>(casa.getAmenazas());
        lista.add("CAMARAS");
        return lista;
    }
}
