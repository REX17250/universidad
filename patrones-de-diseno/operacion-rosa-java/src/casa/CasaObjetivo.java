package casa;

import java.util.ArrayList;
import java.util.List;

public class CasaObjetivo implements Casa {
	 @Override
	    public String descripcion() {
	        return "Casa básica";
	    }
	 
	 @Override
		public List<String> getAmenazas() {
			return new ArrayList<>();
		}
}
