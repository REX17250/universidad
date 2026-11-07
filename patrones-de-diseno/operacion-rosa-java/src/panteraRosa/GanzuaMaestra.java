package panteraRosa;

import java.util.ArrayList;
import java.util.List;

public class GanzuaMaestra extends Gadget{
	public GanzuaMaestra(OperacionRosa operacion) {
        super(operacion);
    }

    @Override
    public String descripcion() {
        return operacion.descripcion() + " + Ganzua Maestra";
    }
    
    @Override
    public List<String> getGadgets() {
        List<String> lista = new ArrayList<>(operacion.getGadgets());
        lista.add("CONTRA_PUERTAACORAZADA");
        return lista;
    }
}
