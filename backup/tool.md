vector<string>board(n, string(n, '.'));

s.substr 會複製一份記憶體，所以不要一直做

istringstream iss(s);
string token;
while(getline(iss, token, ' ')){}

s.substr(start, len);



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

map 的 visit 不是 O(1) 是 O(log n)，因為他用紅黑樹實作

⌈a / b⌉ = (a + b - 1) / b

973 quick select 手刻

linked list 的 merge sort 可以設一個 dummy head，再用一個 curr 一直往前跑就好

頭插法
groupHead, prev, curr -> 要一直把 curr 插到 groupHead 的後面

while(curr){
    prev->next = curr->next;
    curr->next = groupHead->next;
    groupHead->next = curr;
    curr = prev->next;
}

遇到 in-place -> swap, reverse

binary tree - morris traversal

