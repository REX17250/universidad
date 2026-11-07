package panteraRosa;

import java.util.ArrayList;
import java.util.List;

public class GafasInfrarojas extends Gadget {
	public GafasInfrarojas(OperacionRosa operacion) {
        super(operacion);
    }

    @Override
    public String descripcion() {
        return operacion.descripcion() + " + Gafas Infrarojas";
    }
    
    @Override
    public List<String> getGadgets() {
        List<String> lista = new ArrayList<>(operacion.getGadgets());
        lista.add("CONTRA_LASERINFRAROJO");
        return lista;
    }
}
