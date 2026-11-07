package panteraRosa;

import java.util.List;

public abstract class Gadget  implements OperacionRosa{
	
	protected OperacionRosa operacion;  // referencia al objeto decorado

    public Gadget(OperacionRosa operacion) {
        this.operacion = operacion;
    }

    @Override
    public String descripcion() {
        return operacion.descripcion();
    }

    @Override
    public List<String> getGadgets() {
        return operacion.getGadgets();
    }
}
