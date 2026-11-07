package panteraRosa;

import java.util.ArrayList;
import java.util.List;

public class Sedante extends Gadget{
	public Sedante(OperacionRosa operacion) {
        super(operacion);
    }

    @Override
    public String descripcion() {
        return operacion.descripcion() + " Sedante";
    }
    
    @Override
    public List<String> getGadgets() {
        List<String> lista = new ArrayList<>(operacion.getGadgets());
        lista.add("CONTRA_DUEÑO");
        return lista;
    }
}
