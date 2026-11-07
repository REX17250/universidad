package panteraRosa;

import java.util.ArrayList;
import java.util.List;

public class PanteraRosa implements OperacionRosa {
	@Override
    public String descripcion() {
        return "Pantera Rosa base";
    }
	
	@Override
	public List<String> getGadgets() {
		return new ArrayList<>();
	}
}
