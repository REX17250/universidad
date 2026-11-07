package panteraRosa;

import java.util.ArrayList;
import java.util.List;

public class TrajeSombra extends Gadget{
	public TrajeSombra(OperacionRosa operacion) {
        super(operacion);
    }

    @Override
    public String descripcion() {
        return operacion.descripcion() + " Traje Sombra";
    }
    
    @Override
    public List<String> getGadgets() {
        List<String> lista = new ArrayList<>(operacion.getGadgets());
        lista.add("CONTRA_CAMARAS");
        return lista;
    }
}
