package casa;

import java.util.ArrayList;
import java.util.List;

public class LaserInfrarojo extends DispositivosSeguridad{
	public LaserInfrarojo(Casa casa) {
        super(casa);
    }

    @Override
    public String descripcion() {
        return casa.descripcion() + " + Laser Infrarojo";
    }

    @Override
    public List<String> getAmenazas() {
        List<String> lista = new ArrayList<>(casa.getAmenazas());
        lista.add("LASERINFRAROJO");
        return lista;
    }
}
