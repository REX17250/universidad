package casa;

import java.util.ArrayList;
import java.util.List;

public class Dueño extends DispositivosSeguridad {
	public Dueño(Casa casa) {
        super(casa);
    }

    @Override
    public String descripcion() {
        return casa.descripcion() + " + Dueño";
    }

    @Override
    public List<String> getAmenazas() {
        List<String> lista = new ArrayList<>(casa.getAmenazas());
        lista.add("DUEÑO");
        return lista;
    }
}
