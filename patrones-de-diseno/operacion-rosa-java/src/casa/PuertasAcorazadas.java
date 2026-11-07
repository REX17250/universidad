package casa;

import java.util.ArrayList;
import java.util.List;

public class PuertasAcorazadas extends DispositivosSeguridad{
	public PuertasAcorazadas(Casa casa) {
        super(casa);
    }

    @Override
    public String descripcion() {
        return casa.descripcion() + " + Puertas Acorazadas";
    }

    @Override
    public List<String> getAmenazas() {
        List<String> lista = new ArrayList<>(casa.getAmenazas());
        lista.add("PUERTAACORAZADA");
        return lista;
    }
}
