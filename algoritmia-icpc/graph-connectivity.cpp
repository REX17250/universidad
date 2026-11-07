#include <iostream>
#include <vector>
using namespace std;

vector<int> v;
// [1,2,3,4,5]
// vector<int> v(3);
// v = [0,0,0]
// v[0]=1;
// v[1]=2;
// v[3]=3;
// v.push_back(1);
int vis[100];
// vis = [0,0,0,0,0,0,0,0,0,0]
vector<int> grafo[100];

void bfs(int nInicial) {
    queue<int> colita;
    colita.push(nInicial);
    while(!colita.empty()) {
        int nodoInicial = colita.front();
        cout<<"[" << nodoInicial<< "]"<<endl;
        colita.pop();
        vis[nodoInicial] = 1;
        for(int j = 0; j<grafo[nodoInicial].size(); j++) {
            int amigo = grafo[nodoInicial][j];
            if(vis[amigo] == 0) {
                colita.push(amigo);
            }
        }

    }
}

int main()
{
    int cases;
    scanf("%d\n\n", &cases)
    // cin >> cases;
    while (cases--)
    {
        string nroNodosString;
        getline(cin,nroNodosString);
        nroNodes = nroNodosString[0] - 'A' + 1; // 'E' - 'A' => 69 - 65 +1= 5
        init();
        int total = nroNodes;
        string arista;
        while (true){ // AB
            getline(cin,arista);
            if(arista.empty()) {
                break;
            }
            int origen, destino;
            origen = arista[0] - 'A';  // 'A' - 'A' = 65 - 65 = 0
            destino = arista[1] - 'A'; // 'B' - 'A' = 66 - 65 = 1
            grafo[origen].push_back(destino);
            if (padreDestino != padreOrigen)
            {
                unionPadres(origen, destino);
                total--;
            }
        }
        cout<<total<<endl;
        if(cases!=0) {
            cout<<endl;
        }
    }
    return 0;
}   


/* 
    5 6
    1 3
    1 2
    2 3
    2 5
    5 4
    3 4
*/