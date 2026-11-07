package casa;

import java.util.ArrayList;
import java.util.List;

public class Perros extends DispositivosSeguridad {
	public Perros(Casa casa) {
        super(casa);
    }

    @Override
    public String descripcion() {
        return casa.descripcion() + " + Perros";
    }

    @Override
    public List<String> getAmenazas() {
        List<String> lista = new ArrayList<>(casa.getAmenazas());
        lista.add("PERROS");
        return lista;
    }
}
