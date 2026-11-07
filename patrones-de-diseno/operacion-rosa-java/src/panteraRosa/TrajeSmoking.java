package panteraRosa;

import java.util.ArrayList;
import java.util.List;

public class TrajeSmoking extends Gadget {
	public TrajeSmoking(OperacionRosa operacion) {
        super(operacion);
    }

    @Override
    public String descripcion() {
        return operacion.descripcion() + " Traje Smoking";
    }
    
    @Override
    public List<String> getGadgets() {
        List<String> lista = new ArrayList<>(operacion.getGadgets());
        lista.add("CONTRA_FIESTA");
        return lista;
    }
}
