package casa;

import java.util.List;

public abstract class DispositivosSeguridad implements Casa {
	 protected Casa casa;  // referencia al componente que está decorando

	    public DispositivosSeguridad(Casa casa) {
	        this.casa = casa;
	    }

	    @Override
	    public String descripcion() {
	        return casa.descripcion();
	    }

	    @Override
	    public List<String> getAmenazas() {
	        return casa.getAmenazas();
	    }
}
