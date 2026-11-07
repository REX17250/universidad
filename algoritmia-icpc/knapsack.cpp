#include <vector>
using namespace std;

vector<int> v;
int valor[100];
int peso[100];

void bottom_up(int capacidad) {
    int peso[capacidad][peso.size()];
    //caso de base
    for (int i = 0; i <= capacidad; i++) {
        peso[0][i] = 0;
    }
    for (int i = 1  ; i <= peso.size(); i++) {
        for (int w = 0; w <= capacidad; w++) {
            if (peso[i] <= w) {
                peso[i][w] = max(peso[i - 1][w], peso[i - 1][w - peso[i]] + valor[i]);
            } else {
                peso[i][w] = peso[i - 1][w];
            }
        }
    }
}


int f (int capacidad, int pos) {
    if (capacidad == 0) {
        return 0;
    }
    if (pos == peso.size()) {
        return 0;
    }
    if(dp[pos][capacidad] == -1) {
        int result = f(pos+1, capacidad);
        if (capacidad >= peso[pos]) {
            result = max(result, f(pos+1, capacidad - peso[pos]) + valor[pos]);
        }
        dp[pos][capacidad] = result;
    }
    return dp[pos][capacidad];
}

int main() {
	// your code goes here
    string prerod, inord;
    cin> >> prerod >> inord;
	//getline(cin,prerod)>>getline(cin,inord);
    reorg(1);
	return 0;
}