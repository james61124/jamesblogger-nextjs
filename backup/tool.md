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

prefix sum

base conversion


matrix dfs：不一定要按照順序 dfs，要記得可以反向 dfs！
2D DP：狀態會從前面兩種地方來！

linked list - interleaved list
linked list - reverse, find middle node

double linked list -> list -> 146

26 字母 -> hash table 開 vector

minimum spanning tree
Prim’s Algorithm
Kruskal's Algorithm

shortest path
Dijkstra
Bellman-Ford
Floyd-Warshall
