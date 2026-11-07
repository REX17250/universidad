package panteraRosa;

import java.util.ArrayList;
import java.util.List;

public class FlipperZero extends Gadget{
	public FlipperZero(OperacionRosa operacion) {
        super(operacion);
    }

    @Override
    public String descripcion() {
        return operacion.descripcion() + " + Flipper Zero";
    }
    
    @Override
    public List<String> getGadgets() {
        List<String> lista = new ArrayList<>(operacion.getGadgets());
        lista.add("CONTRA_PUERTAELECTRONICA");
        return lista;
    }
}
