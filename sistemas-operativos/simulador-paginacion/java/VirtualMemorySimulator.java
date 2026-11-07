import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.*;
import java.util.List;

public class VirtualMemorySimulator {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            MemoriaVirtualGUI frame = new MemoriaVirtualGUI();
            frame.setVisible(true);
        });
    }
}

class Pagina {
    private final int idProceso;
    private final int idPagina;
    private long tiempoUltimoAcceso;
    private boolean enRAM;
    
    public Pagina(int idProceso, int idPagina) {
        this.idProceso = idProceso;
        this.idPagina = idPagina;
        this.tiempoUltimoAcceso = -1;
        this.enRAM = false;
    }
    
    public void acceder(long tiempo) {
        this.tiempoUltimoAcceso = tiempo;
    }
    
    public void resetear() {
        this.tiempoUltimoAcceso = -1;
    }
    
    public int getIdProceso() {
        return idProceso;
    }
    
    public int getIdPagina() {
        return idPagina;
    }
    
    public long getTiempoUltimoAcceso() {
        return tiempoUltimoAcceso;
    }
    
    public boolean estaEnRAM() {
        return enRAM;
    }
    
    public void setEnRAM(boolean enRAM) {
        this.enRAM = enRAM;
    }
}

class Marco {
    private final int id;
    private Pagina pagina;
    private boolean libre;
    private final boolean enRAM;
    
    public Marco(int id, boolean enRAM) {
        this.id = id;
        this.libre = true;
        this.enRAM = enRAM;
    }
    
    public void asignarPagina(Pagina pagina) {
        this.pagina = pagina;
        this.libre = false;
        pagina.setEnRAM(enRAM);
    }
    
    public void liberar() {
        if (pagina != null) {
            pagina.setEnRAM(false);
            pagina.resetear();
        }
        this.pagina = null;
        this.libre = true;
    }
    
    public int getId() {
        return id;
    }
    
    public Pagina getPagina() {
        return pagina;
    }
    
    public boolean estaLibre() {
        return libre;
    }
    
    public boolean estaEnRAM() {
        return enRAM;
    }
}

class MemoriaVirtual {
    private List<Marco> ram;
    private List<Marco> swap;
    private List<Proceso> procesos;
    private long relojGlobal;
    private int fallosPagina;
    private final Random random;
    
    public MemoriaVirtual(int numMarcosRAM, int numMarcosSwap) {
        this.relojGlobal = 0;
        this.fallosPagina = 0;
        this.random = new Random();
        inicializarMemoria(numMarcosRAM, numMarcosSwap);
    }
    
    private void inicializarMemoria(int numMarcosRAM, int numMarcosSwap) {
        ram = new ArrayList<>();
        swap = new ArrayList<>();
        procesos = new ArrayList<>();
        
        for (int i = 0; i < numMarcosRAM; i++) {
            ram.add(new Marco(i, true));
        }
        
        for (int i = 0; i < numMarcosSwap; i++) {
            swap.add(new Marco(i, false));
        }
    }
    
    public void generarProceso(int idProceso, int numPaginas) {
        Proceso proceso = new Proceso(idProceso);
        for (int i = 0; i < numPaginas; i++) {
            proceso.agregarPagina(new Pagina(idProceso, i));
        }
        procesos.add(proceso);
    }
    
    public Pagina accederPagina(int idProceso, int idPagina, JTextArea log) {
        relojGlobal++;
        for (Proceso p : procesos) {
            if (p.getId() == idProceso) {
                Pagina pagina = p.getPagina(idPagina);
                if (pagina != null) {
                    if (!pagina.estaEnRAM()) {
                        fallosPagina++;
                        Marco marcoLibre = encontrarMarcoLibre(ram);
                        if (marcoLibre != null) {
                            marcoLibre.asignarPagina(pagina);
                            log.append("Cargando P" + idProceso + "-Pg" + idPagina + " en marco RAM " + marcoLibre.getId() + "\n");
                        } else {
                            Pagina victima = seleccionarVictimaLRU();
                            Marco marcoSwap = encontrarMarcoLibre(swap);
                            if (marcoSwap != null) {
                                log.append("Reemplazando P" + victima.getIdProceso() + "-Pg" + victima.getIdPagina() + "\n");
                                marcoSwap.asignarPagina(victima);
                                Marco marcoRAM = getMarcoConteniendoPagina(ram, victima);
                                if (marcoRAM != null) {
                                    marcoRAM.liberar();
                                    marcoRAM.asignarPagina(pagina);
                                    log.append("Moviendo P" + idProceso + "-Pg" + idPagina + " a marco RAM " + marcoRAM.getId() + "\n");
                                }
                            }
                        }
                    }
                    pagina.acceder(relojGlobal);
                    return pagina;
                }
            }
        }
        return null;
    }
    
    private Marco encontrarMarcoLibre(List<Marco> marcos) {
        for (Marco marco : marcos) {
            if (marco.estaLibre()) {
                return marco;
            }
        }
        return null;
    }
    
    private Marco getMarcoConteniendoPagina(List<Marco> marcos, Pagina pagina) {
        for (Marco marco : marcos) {
            if (!marco.estaLibre() && marco.getPagina() == pagina) {
                return marco;
            }
        }
        return null;
    }
    
    private Pagina seleccionarVictimaLRU() {
        Pagina victima = null;
        long tiempoMasAntiguo = Long.MAX_VALUE;
        
        for (Marco marco : ram) {
            if (!marco.estaLibre()) {
                Pagina pagina = marco.getPagina();
                if (pagina.getTiempoUltimoAcceso() < tiempoMasAntiguo) {
                    tiempoMasAntiguo = pagina.getTiempoUltimoAcceso();
                    victima = pagina;
                }
            }
        }
        return victima;
    }
    
    public double calcularFragmentacionExterna() {
        int totalLibres = 0;
        int maxHueco = 0;
        int huecoActual = 0;
        
        for (Marco marco : ram) {
            if (marco.estaLibre()) {
                totalLibres++;
                huecoActual++;
            } else {
                maxHueco = Math.max(maxHueco, huecoActual);
                huecoActual = 0;
            }
        }
        maxHueco = Math.max(maxHueco, huecoActual);
        
        if (totalLibres == 0) return 0.0;
        return (1.0 - (double) maxHueco / totalLibres) * 100;
    }
    
    public List<Marco> getRAM() {
        return ram;
    }
    
    public List<Marco> getSwap() {
        return swap;
    }
    
    public int getFallosPagina() {
        return fallosPagina;
    }
    
    public long getRelojGlobal() {
        return relojGlobal;
    }
    
    public void reiniciar(int numMarcosRAM, int numMarcosSwap) {
        inicializarMemoria(numMarcosRAM, numMarcosSwap);
        relojGlobal = 0;
        fallosPagina = 0;
        procesos.clear();
    }
}

class Proceso {
    private final int id;
    private final List<Pagina> paginas;
    
    public Proceso(int id) {
        this.id = id;
        this.paginas = new ArrayList<>();
    }
    
    public void agregarPagina(Pagina pagina) {
        paginas.add(pagina);
    }
    
    public Pagina getPagina(int idPagina) {
        for (Pagina pagina : paginas) {
            if (pagina.getIdPagina() == idPagina) {
                return pagina;
            }
        }
        return null;
    }
    
    public int getId() {
        return id;
    }
}

class MemoriaVirtualGUI extends JFrame {
    private MemoriaVirtual memoriaVirtual;
    private JPanel ramPanel;
    private JPanel swapPanel;
    private JTextArea logArea;
    private JLabel fallosLabel;
    private JLabel fragmentacionLabel;
    private int numMarcosRAM = 8;
    private int numMarcosSwap = 16;
    
    public MemoriaVirtualGUI() {
        setTitle("Simulador de Memoria Virtual");
        setSize(1000, 700);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        
        memoriaVirtual = new MemoriaVirtual(numMarcosRAM, numMarcosSwap);
        
        // Crear controles superiores
        JPanel topPanel = new JPanel(new GridLayout(2, 1));
        
        // Panel de configuración
        JPanel configPanel = new JPanel();
        configPanel.add(new JLabel("RAM:"));
        JSlider ramSlider = new JSlider(2, 32, numMarcosRAM);
        ramSlider.setMajorTickSpacing(4);
        ramSlider.setPaintTicks(true);
        configPanel.add(ramSlider);
        
        configPanel.add(new JLabel("Swap:"));
        JSlider swapSlider = new JSlider(4, 64, numMarcosSwap);
        swapSlider.setMajorTickSpacing(8);
        swapSlider.setPaintTicks(true);
        configPanel.add(swapSlider);
        
        JButton aplicarBtn = new JButton("Aplicar");
        aplicarBtn.addActionListener(e -> {
            numMarcosRAM = ramSlider.getValue();
            numMarcosSwap = swapSlider.getValue();
            memoriaVirtual.reiniciar(numMarcosRAM, numMarcosSwap);
            actualizarPaneles();
        });
        configPanel.add(aplicarBtn);
        
        // Panel de botones
        JPanel buttonPanel = new JPanel();
        JButton genProcesoBtn = new JButton("Generar Proceso");
        genProcesoBtn.addActionListener(e -> {
            int idProceso = memoriaVirtual.getRelojGlobal() > 0 ? (int)(memoriaVirtual.getRelojGlobal() % 100) : 0;
            int numPaginas = 3 + (int)(Math.random() * 5);
            memoriaVirtual.generarProceso(idProceso, numPaginas);
            logArea.append("Proceso P" + idProceso + " generado con " + numPaginas + " páginas\n");
            actualizarPaneles();
        });
        
        JButton accederBtn = new JButton("Acceso Aleatorio");
        accederBtn.addActionListener(e -> {
            if (!memoriaVirtual.getRAM().isEmpty()) {
                int randIndex = (int)(Math.random() * memoriaVirtual.getRAM().size());
                Marco marco = memoriaVirtual.getRAM().get(randIndex);
                
                if (!marco.estaLibre()) {
                    int idProceso = marco.getPagina().getIdProceso();
                    int idPagina = marco.getPagina().getIdPagina();
                    memoriaVirtual.accederPagina(idProceso, idPagina, logArea);
                    fragmentacionLabel.setText("Fragmentación Externa: " + 
                                               String.format("%.2f", memoriaVirtual.calcularFragmentacionExterna()) + "%");
                    fallosLabel.setText("Fallos de Página: " + memoriaVirtual.getFallosPagina());
                    actualizarPaneles();
                }
            }
        });
        
        buttonPanel.add(genProcesoBtn);
        buttonPanel.add(accederBtn);
        
        topPanel.add(configPanel);
        topPanel.add(buttonPanel);
        add(topPanel, BorderLayout.NORTH);
        
        // Panel central (RAM y Swap)
        JPanel centerPanel = new JPanel(new GridLayout(1, 2));
        
        // Panel RAM
        ramPanel = new JPanel(new GridLayout(0, 4, 5, 5));
        actualizarPanelRAM();
        JScrollPane ramScroll = new JScrollPane(ramPanel);
        ramScroll.setBorder(BorderFactory.createTitledBorder("RAM"));
        centerPanel.add(ramScroll);
        
        // Panel Swap
        swapPanel = new JPanel(new GridLayout(0, 4, 5, 5));
        actualizarPanelSwap();
        JScrollPane swapScroll = new JScrollPane(swapPanel);
        swapScroll.setBorder(BorderFactory.createTitledBorder("Swap"));
        centerPanel.add(swapScroll);
        
        add(centerPanel, BorderLayout.CENTER);
        
        // Panel inferior (métricas y log)
        JPanel bottomPanel = new JPanel(new BorderLayout());
        
        // Métricas
        JPanel metricPanel = new JPanel();
        fallosLabel = new JLabel("Fallos de Página: 0");
        fragmentacionLabel = new JLabel("Fragmentación Externa: 0.0%");
        metricPanel.add(fallosLabel);
        metricPanel.add(fragmentacionLabel);
        bottomPanel.add(metricPanel, BorderLayout.NORTH);
        
        // Área de log
        logArea = new JTextArea(5, 80);
        logArea.setEditable(false);
        JScrollPane logScroll = new JScrollPane(logArea);
        logScroll.setBorder(BorderFactory.createTitledBorder("Registro de Eventos"));
        bottomPanel.add(logScroll, BorderLayout.CENTER);
        
        add(bottomPanel, BorderLayout.SOUTH);
    }
    
    private void actualizarPanelRAM() {
        ramPanel.removeAll();
        List<Marco> ram = memoriaVirtual.getRAM();
        long maxAge = calcularMaxAge(ram);
        
        for (Marco marco : ram) {
            JPanel panelMarco = new JPanel(new BorderLayout());
            if (marco.estaLibre()) {
                panelMarco.setBackground(Color.LIGHT_GRAY);
                JLabel label = new JLabel("Marco " + marco.getId() + ": Libre", SwingConstants.CENTER);
                panelMarco.add(label, BorderLayout.CENTER);
            } else {
                Pagina pagina = marco.getPagina();
                long age = memoriaVirtual.getRelojGlobal() - pagina.getTiempoUltimoAcceso();
                int intensity = (int) (255 * age / (maxAge == 0 ? 1 : maxAge));
                if (age == 0) {
                    // Acceso reciente: borde verde
                    panelMarco.setBorder(BorderFactory.createLineBorder(Color.GREEN, 3));
                } else {
                    // Envejecimiento: rojo más intenso según antigüedad
                    panelMarco.setBorder(BorderFactory.createLineBorder(new Color(intensity, 0, 0), 3));
                }
                
                JLabel label = new JLabel("P" + pagina.getIdProceso() + "-Pg" + pagina.getIdPagina(), SwingConstants.CENTER);
                panelMarco.add(label, BorderLayout.CENTER);
                panelMarco.setBackground(Color.WHITE);
            }
            ramPanel.add(panelMarco);
        }
        ramPanel.revalidate();
        ramPanel.repaint();
    }
    
    private void actualizarPanelSwap() {
        swapPanel.removeAll();
        for (Marco marco : memoriaVirtual.getSwap()) {
            JPanel panelMarco = new JPanel(new BorderLayout());
            if (marco.estaLibre()) {
                panelMarco.setBackground(Color.LIGHT_GRAY);
                JLabel label = new JLabel("Swap " + marco.getId() + ": Libre", SwingConstants.CENTER);
                panelMarco.add(label, BorderLayout.CENTER);
            } else {
                Pagina pagina = marco.getPagina();
                JLabel label = new JLabel("P" + pagina.getIdProceso() + "-Pg" + pagina.getIdPagina(), SwingConstants.CENTER);
                panelMarco.add(label, BorderLayout.CENTER);
                panelMarco.setBackground(Color.WHITE);
                panelMarco.setBorder(BorderFactory.createLineBorder(Color.BLUE, 1));
            }
            swapPanel.add(panelMarco);
        }
        swapPanel.revalidate();
        swapPanel.repaint();
    }
    
    private long calcularMaxAge(List<Marco> ram) {
        long maxAge = 0;
        for (Marco marco : ram) {
            if (!marco.estaLibre()) {
                long age = memoriaVirtual.getRelojGlobal() - marco.getPagina().getTiempoUltimoAcceso();
                if (age > maxAge) {
                    maxAge = age;
                }
            }
        }
        return maxAge;
    }
}    
   