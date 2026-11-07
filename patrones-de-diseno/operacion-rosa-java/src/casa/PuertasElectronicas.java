package casa;

import java.util.ArrayList;
import java.util.List;

public class PuertasElectronicas extends DispositivosSeguridad {
	public PuertasElectronicas(Casa casa) {
        super(casa);
    }

    @Override
    public String descripcion() {
        return casa.descripcion() + " + Puertas Electronicas";
    }

    @Override
    public List<String> getAmenazas() {
        List<String> lista = new ArrayList<>(casa.getAmenazas());
        lista.add("PUERTAELECTRONICA");
        return lista;
    }
}
