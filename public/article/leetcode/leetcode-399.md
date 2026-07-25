---
title: "[ Leetcode 399 ] Evaluate Division | 解題思路分享"
date: "2025-10-06"
author: James
tags: DFS,BFS,Graph,Union Find,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 54150382-ad04-428c-b214-df085fa4ff3c
---

給一些 equations，例如

```
a / b = 2
b / c = 3
```

再來會給新的式子要 return 正確答案，如果求不出來的就 return -1

題目連結🔗：[https://leetcode.com/problems/evaluate-division/](https://leetcode.com/problems/evaluate-division/)

### **問題分析**

先舉個例子

```
(a, b) = 3
(b, c) = 2
(c, d) = 4
```

如果要求 a / d，事實上就是把每項相乘，因為分母跟分子可以相消，這實際上是一個 Graph 的題目，而且是 directed weighted graph，我們可以把題目看成這樣

```
a -> b = 3, b -> a = 1/3
b -> c = 2, c -> b = 1/2
c -> d = 4, d -> c = 1/4
```

我們就會發現 a -> d 的答案就是從 a 走到 d，路上遇到的 edge 全部乘起來即可。

發現這件事後這題就有了第一個解法，我們可以先把 queries[i] 建成一個 directed weighted graph，最後 bfs/dfs 走過每一個 query 的 path 就好，然後把路上每個 edge 都乘起來，這樣解沒有問題，但是如果 graph 很大，這樣做每一次都要重新 dfs/bfs 一遍，如果我們有辦法將分子分母的距離「壓縮」，這樣就不用每一次都重新 dfs/bfs 了，但這要怎麼做呢？

如果 `x` 和 `y` 在同一個 connected graph 中，他們之間的比例一定是固定的，而只要知道他們共同 ancestor，並且知道 `x`, `y` 各自與 ancestor 的比例，就可以在 O(1) 的時間求出 x / y 或 y / x，舉個例子

```python
root(x) = r # r / x = 3
root(y) = r # r / y = 2
```

由此就可以得知 x / y = 2 / 3，兩者相除就好，這樣就不用管 x -> y 中間經過了多少 edges，換句話說，我們只要儲存每個 node 的 ancestor 是誰，以及他們跟 ancestor 各自的比例關係，這個用 Union Find 就可以解決。

[[ Algorithm ] Union Find | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/union-find)

### **解題思路 - Union Find**

我們要來重新設計 Union Find 的 class，多加一個變數來儲存每個 nodes 跟 root 的比例關係，我們把他叫 weight[i]，初始化時因為每個 node 的 parent 都是自己，所以 weight 也設置成 1

```cpp
class UnionFind {
public:
    vector<int>parent;
    vector<int>rank;
    vector<double>weight;

    UnionFind(int n){
        parent.resize(n);
        rank.resize(n, 0);
        weight.resize(n, 1);

        for(int i = 0; i < n; i++) parent[i] = i;
    }
};
```

我們先定義好 weight[i]，如果 x / y = 3，那麼會讓 parent[y] = x，其中 weight[y] = 3，也就是說 x / y = weight[y]。

再來設計 `find` 跟 `union` 兩個核心 function，首先 `find` 在找到 root 的過程中會有「壓縮」的動作，在這個過程我們要更新 weight，舉個例子

```
a -> b = 3
b -> c = 2
c -> d = 4
```

過程中 c 的 parent 會更新成 a，而 weight[c] 就是原本自己的 weight 乘上他原本 parent 的 weight (2 * 3)，所以變成

```
a -> b = 3
a -> c = 6
c -> d = 4
```

d 就重複一樣的動作，一樣 d 的 parent 更新成 a，weight[d] 就是原本自己的 weight 乘上他原本 parent 的 weight (4 * 6)

```
a -> b = 3
a -> c = 6
a -> d = 24
```

寫成程式碼就是

```cpp
int find(int x){
    if(parent[x] != x) {
        int root = find(parent[x]);
        weight[x] *= weight[parent[x]];
        parent[x] = root;
    }
    return parent[x];
}
```

`unite` 時會把兩個 Union Set 合併起來，合併時因為只有動到 root 的 parent，所以只要更新 root 的 weight 即可，我們先寫出原本的 `unite`

```cpp
void unite(int x, int y){
    int rootX = find(x);
    int rootY = find(y);
    if(rootX == rootY) return;

    if(rank[x] < rank[y]) {
        parent[rootX] = rootY;
        
    } else if(rank[x] > rank[y]) {
        parent[rootY] = rootX;
    } else {
        parent[rootX] = rootY;
        rank[rootY]++;
    }
}
```

我們每看一個 values[i] 就要叫一次 unite，把兩個數字的 Union Set 合併變成同一個 connected graph，所以我們會順便把 `x / y = k` 這條 equation 順便更新進去 Union Find 裡

先來想其中一種狀況，假設 rootX 要併到 rootY 底下，所以我們要找到 rootY / rootX 的值是什麼，這邊來算點數學

```
rootX / x = weight[x] -- (1)
rootY / y = weight[y] -- (2)
x / y = k -- (3)

合併 (1), (3)
rootX = x * weight[x]
      = y * k * weight[x]
y = rootX * (1/k) / weight[x] 

代入 (2)
rootY = y * weight[y]
      = rootX * (1/k) * weight[y] / weight[x] 
```

所以我們得到 rootY / rootX = (1/k) * weight[y] / weight[x]，那我們就可以更新 weight[rootX] 了

```cpp
void unite(int x, int y, int k){
    int rootX = find(x);
    int rootY = find(y);
    if(rootX == rootY) return;

    if(rank[x] < rank[y]) {
        parent[rootX] = rootY;
        weight[rootX] = weight[y] / weight[x] * (1/k); // rootX 要併到 rootY 底下
        
    } else if(rank[x] > rank[y]) {
        parent[rootY] = rootX;
    } else {
        parent[rootX] = rootY;
        weight[rootX] = weight[y] / weight[x] * (1/k); // rootX 要併到 rootY 底下
        rank[rootY]++;
    }
}
```

rootY 併到 rootX 底下基本上就是反向再算一次，就直接附上結果，所以完整的 `unite` 是這樣

```cpp
void unite(int x, int y, double k){
    int rootX = find(x);
    int rootY = find(y);
    if(rootX == rootY) return;

    if(rank[x] < rank[y]) {
        parent[rootX] = rootY;
        weight[rootX] = weight[y] / weight[x] * (1/k); 
        
    } else if(rank[x] > rank[y]) {
        parent[rootY] = rootX;
        weight[rootY] = weight[x] / weight[y] * k;
    } else {
        parent[rootX] = rootY;
        weight[rootX] = weight[y] / weight[x] * (1/k); 
        rank[rootY]++;
    }
}
```

到這邊就完成 Union Find 的 class，再來看 main function 怎麼做，首先要先把所有 equations 更新進去 Union Find 裡，由於 Union Find 是用數字當 index，我們需要一個額外的 Hash Table 來記錄 string 跟 index 的關係

```cpp
vector<double> calcEquation(vector<vector<string>>& equations, vector<double>& values, vector<vector<string>>& queries) {
    unordered_map<string, int>umap;
    vector<double>result;
    
    int curr = 0;
    for(int i = 0; i < equations.size(); i++){
        for(int j = 0; j < 2; j++){
            string s = equations[i][j];
            if(!umap.count(s)) {
                umap[s] = curr;
                curr++;
            }
        }
    }
}
```

而每更新一次 equation 就叫一次 unite

```cpp
UnionFind uf(curr);
for(int i = 0; i < equations.size(); i++){
    int i0 = umap[equations[i][0]];
    int i1 = umap[equations[i][1]];
    uf.unite(i0, i1, values[i]);
}
```

最後要計算完所有的 queries，這邊假設 queries[i] = x / y，我們要先找到 x, y 共同的 root，所以先呼叫一次 `find` 找到共同的 root，如果這樣還找不到共同的 root 表示這兩個 node 根本就不在同一個 connected graph 中，那可以直接輸出 -1

```cpp
for(auto q : queries) {
    int i0 = umap.count(q[0]) ? umap[q[0]] : -1;
    int i1 = umap.count(q[1]) ? umap[q[1]] : -1;

    if(i0 == -1 || i1 == -1 || uf.find(i0) != uf.find(i1)) result.push_back(-1);
}
```

如果找到共同的 root，答案就是 weight[y] / weight[x]

```cpp
for(auto q : queries) {
    int i0 = umap.count(q[0]) ? umap[q[0]] : -1;
    int i1 = umap.count(q[1]) ? umap[q[1]] : -1;

    if(i0 == -1 || i1 == -1 || uf.find(i0) != uf.find(i1)) result.push_back(-1);
    else result.push_back(uf.weight[i1] / uf.weight[i0]);
}
```

**Time Complexity** - `O(E * α(N) + q * α(N))`，建圖總共看了 E 條 equations，最後 query 了 q 次<br>
**Space Complexity** - `O(N)`

#### **Implementation**

```cpp
class UnionFind {
public:
    vector<int>parent;
    vector<int>rank;
    vector<double>weight;

    UnionFind(int n){
        parent.resize(n);
        rank.resize(n, 0);
        weight.resize(n, 1);

        for(int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x){
        if(parent[x] != x) {
            int root = find(parent[x]);
            weight[x] *= weight[parent[x]];
            parent[x] = root;
        }
        return parent[x];
    }

    void unite(int x, int y, double k){
        int rootX = find(x);
        int rootY = find(y);
        if(rootX == rootY) return;

        if(rank[x] < rank[y]) {
            parent[rootX] = rootY;
            weight[rootX] = weight[y] / weight[x] * (1/k); 
            
        } else if(rank[x] > rank[y]) {
            parent[rootY] = rootX;
            weight[rootY] = weight[x] / weight[y] * k;
        } else {
            parent[rootX] = rootY;
            weight[rootX] = weight[y] / weight[x] * (1/k); 
            rank[rootY]++;
        }
    }
};

class Solution {
public:
    vector<double> calcEquation(vector<vector<string>>& equations, vector<double>& values, vector<vector<string>>& queries) {
        unordered_map<string, int>umap;
        vector<double>result;
        
        int curr = 0;
        for(int i = 0; i < equations.size(); i++){
            for(int j = 0; j < 2; j++){
                string s = equations[i][j];
                if(!umap.count(s)) {
                    umap[s] = curr;
                    curr++;
                }
            }
        }
        
        UnionFind uf(curr);
        for(int i = 0; i < equations.size(); i++){
            int i0 = umap[equations[i][0]];
            int i1 = umap[equations[i][1]];
            uf.unite(i0, i1, values[i]);
        }

        for(auto q : queries) {
            int i0 = umap.count(q[0]) ? umap[q[0]] : -1;
            int i1 = umap.count(q[1]) ? umap[q[1]] : -1;

            if(i0 == -1 || i1 == -1 || uf.find(i0) != uf.find(i1)) result.push_back(-1);
            else result.push_back(uf.weight[i1] / uf.weight[i0]);
        }

        return result;
    }
};
```

