#include <bits/stdc++.h>
#define input freopen("in.txt","r",stdin)
#define output freopen("out.txt","w",stdout)
#define INF 100000010
#define MAX_N 1000
using namespace std;

// -------------------- KRUSKAL --------------------
int parent[MAX_N];
int rango[MAX_N];

struct Arista{
    int origen;
    int destino;
    int peso;
    Arista(){}  
    bool operator<(const Arista &a) const{  // ordenar por peso para krsukal
        return peso < a.peso;
    }
}

aristas[MAX_N], MST[MAX_N]; // todas las aristas leidas, // aristas seleccionadas para el MST

int numAristasArbol;

void init(){
    for(int i=0; i<MAX_N; i++){
        parent[i] = i;  // todos los padres son padres de si mismos
        rango[i] = 1;   // todos los rangos son de tamaño 1
    }
}

int findUF(int x){  // buscar a su padre maximo
    if(x == parent[x]) {
        return x;
    }
    return parent[x] = findUF(parent[x]);
}

bool sameComponent(int a,int b){  // si son del mismo padre
    return findUF(a) == findUF(b);
}

void unionRango(int x,int y){ // unimos los padres (el de mayor rango)
    int rx = findUF(x);
    int ry = findUF(y);
    if(rango[rx] > rango[ry]) {
        parent[ry] = rx;
    }else{
        parent[rx] = ry;
        if(rango[rx] == rango[ry]) {
            rango[ry]++;
        }
    }
}

double kruskal(int nroNodos,int nroAristas){
    double total = 0;
    numAristasArbol = 0;
    init();
    sort(aristas,aristas+nroAristas); //  (arreglo a ordenar, cantidad de elementos) // no es un numero, sino una direccion de memoria
    for(int i=0;i<nroAristas;i++){ // iteramos por cada arista
        int u = aristas[i].origen;
        int v = aristas[i].destino;
        int w = aristas[i].peso;
        if(!sameComponent(u,v)){0 // si origen y destino no tienen el mismo padre
            total += w;  // sumamos el peso al total
            unionRango(u,v); // los unimos
            MST[numAristasArbol++] = aristas[i]; // añadimos la arista 
        }
    }
    return total;
}

// -------------------- DIJKSTRA --------------------

vector<pair<int,int>> grafo[MAX_N]; // grafo de pares (peso, nodo destino)
int distancia[MAX_N]; // vector de distancias

void dijkstra(int inicio,int vertices){
    for(int i=0;i<vertices;i++){
       distancia[i] = INF; // en un principio todas las distancias estan en infinito
    } 
   
    multiset<pair<int,int>> cola; // cola
    distancia[inicio] = 0;
    cola.insert({0,inicio}); // metemos el primer nodo a la cola

    while(!cola.empty()){
        pair<int,int> p = *cola.begin(); //nos da la menor arista
        cola.erase(cola.begin()); // sacamos de la cola
        int nodo = p.second;
        int peso = p.first;
        if(distancia[nodo]<peso) {
            continue; // salta a la siguiente iteracion del while
        }
        for(int i=0;i<grafo[nodo].size();i++){ // vamos vecino por vecino
        int v = grafo[nodo][i].second; 
        int w = grafo[nodo][i].first;
            if(distancia[v] > distancia[nodo]+w){ // relajacion para obtener el menor
              distancia[v] = distancia[nodo]+w;
              cola.insert({distancia[v],v}); // metemos a la cola al vecino
            }
        }
    }
}

// -------------------- MAIN --------------------
int main(){
    input;
    output;
    int n,m; // nodos y aristas
    cin >> n >> m;  
    for(int i=0;i<m;i++){ // llenamos las aristas y grafo
        int u,v,w;
        cin >> u >> v >> w;
        aristas[i].origen = u;
        aristas[i].destino = v;
        aristas[i].peso = w;
        grafo[u].push_back({w,v});
        grafo[v].push_back({w,u}); // grafo no dirigido
    }

    double total = kruskal(n,m); // ejecutamos kruskal
    cout << "MST construido, peso total: " << total << endl;
    for(int i=0;i<numAristasArbol;i++){ // imprimir aristas del kruskal
        cout << MST[i].origen << " " << MST[i].destino << " " << MST[i].peso << endl;
    }

    // Simulación de salida bloqueada
    int salidaBloqueada;
    cin >> salidaBloqueada; // leemos el nodo bloqueado
    cout << "Salida bloqueada: " << salidaBloqueada << endl;

    int inicio;
    cin >> inicio;
    dijkstra(inicio,n); // lanzamos un dijkstra desde el inicio

    int salida;
    cin >> salida;
    cout << "Distancia de " << inicio << " a " << salida << " = " << distancia[salida] << endl;
    return 0;
}