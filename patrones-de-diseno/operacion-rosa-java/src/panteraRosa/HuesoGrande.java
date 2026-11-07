package panteraRosa;

import java.util.ArrayList;
import java.util.List;

public class HuesoGrande extends Gadget{
	public HuesoGrande(OperacionRosa operacion) {
        super(operacion);
    }

    @Override
    public String descripcion() {
        return operacion.descripcion() + " + Hueso Grande";
    }
    
    @Override
    public List<String> getGadgets() {
        List<String> lista = new ArrayList<>(operacion.getGadgets());
        lista.add("CONTRA_PERROS");
        return lista;
    }
}
