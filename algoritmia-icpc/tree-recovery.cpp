#include <iostream>
#include <vector>
using namespace std;

vector<int> v;
int vis[100];
vector<int> grafo[100];

void reorg(string preord, string inord) {
    string izq;
    for (int i = 0; i < preord.size(); i++) {
        for (int j = 0; i < inord.size; j++){
            if (preord[i] == inord[j]){
                for (int k = 0; k < j; k++){
                    izq += inord[k];
                    reorg(preord, izq);
                    if (inord.size == izq.size()){
                        preord[i]
                    }
                }
            }
        }
    }
}

int main() {
	// your code goes here
    string prerod, inord;
    cin> >> prerod >> inord;
	//getline(cin,prerod)>>getline(cin,inord);
    reorg(1);
	return 0;
}