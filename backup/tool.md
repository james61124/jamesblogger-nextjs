vector<string>board(n, string(n, '.'));

s.substr 會複製一份記憶體，所以不要一直做



bool compare(int a, int b){
    return a < b;
}
sort(v.begin(), v.end(), compare)

回傳 true -> a 在 b 前面
compare(a, a) 一定要回傳 false

310 rerooting DP

Tree DP
Bitmask DP


