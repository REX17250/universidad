package casa;

import java.util.ArrayList;
import java.util.List;

public class Fiesta extends DispositivosSeguridad{
	public Fiesta(Casa casa) {
        super(casa);
    }

    @Override
    public String descripcion() {
        return casa.descripcion() + " + Fiesta";
    }

    @Override
    public List<String> getAmenazas() {
        List<String> lista = new ArrayList<>(casa.getAmenazas());
        lista.add("FIESTA");
        return lista;
    }
}
