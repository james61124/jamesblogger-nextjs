---
title: "[ Leetcode 200 ] Number of Islands | 解題思路分享"
date: "2025-03-08"
author: James
tags: Array,Matrix,DFS,BFS,Union Find
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個由 '1'（陸地）和 '0'（水）組成的 2D Array，計算島嶼的數量。島嶼是由水平或垂直方向相連的 '1'（陸地）組成的一個區域，而且被 '0'（水）包圍。

題目連結🔗：[https://leetcode.com/problems/number-of-islands/](https://leetcode.com/problems/number-of-islands/)

### **解題思路 - DFS**

這題滿直接的，就是 iterate 整個 matrix 然後對每一個 '1' 都做 DFS，因為 '0' 不會被 visit 的關係，所以只要在同一次 DFS 中被 visit 到就代表是同一個 island，所以最後計算的時候只要看我們做了幾次 DFS 就是代表有幾個 island。

#### **時間複雜度是否會太高?**

理論上 iterate 一次，每一個 grid 都做一次 DFS，這樣時間複雜度是 O(n^2)，但在這題如果 DFS 過後被看過的 grid 會把它標記成 visited，表示這些是已經被看過的 island，就不需要再做 DFS 看一次，所以這題的時間複雜度其實還是 O(n)，因為每一個 grid 只會被看到一次。

#### **如何判斷 Neighbor**

每一個 grid 都會有至多上下左右的四個 neighbors，所以邊界設好避免 segmentation fault 就可以了。

```cpp
if( x > 0 && !visit[x-1][y] && grid[x-1][y] == '1' ) DFS(grid, visit, x-1, y); 
if( x < grid.size()-1 && !visit[x+1][y] && grid[x+1][y] == '1' ) DFS(grid, visit, x+1, y); 
if( y > 0 && !visit[x][y-1] && grid[x][y-1] == '1' ) DFS(grid, visit, x, y-1); 
if( y < grid[0].size()-1 && !visit[x][y+1] && grid[x][y+1] == '1' ) DFS(grid, visit, x, y+1); 
```

但我發現除了這樣分四個 if-else 的寫法，把四個 direction 用 array 存起來 iterate 的寫法會比較優雅，但是追求極致效能下就會略顯劣勢，不過還是貼出來提供參考。

```cpp
vector<vector<int>>direction = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
for(vector<int>& d : direction){
    if( x+d[0] >= 0 && x+d[0] < grid.size() && y+d[1] >= 0 && y+d[1] < grid[0].size() 
        && !visit[x+d[0]][y+d[1]] && grid[x+d[0]][y+d[1]] == '1' ) DFS(grid, visit, x+d[0], y+d[1]); 
}
```

**Time Complexity** - `O(mxn)`，iterate 時每個 grid 都碰到一次。<br>
**Space Complexity** - `O(mxn)`，開了一個 2D Array 儲存 visit。

### **Implementation**

```cpp
void DFS(vector<vector<char>>& grid, vector<vector<bool>>& visit, int x, int y){
    visit[x][y] = true;
    if( x > 0 && !visit[x-1][y] && grid[x-1][y] == '1' ) DFS(grid, visit, x-1, y); 
    if( x < grid.size()-1 && !visit[x+1][y] && grid[x+1][y] == '1' ) DFS(grid, visit, x+1, y); 
    if( y > 0 && !visit[x][y-1] && grid[x][y-1] == '1' ) DFS(grid, visit, x, y-1); 
    if( y < grid[0].size()-1 && !visit[x][y+1] && grid[x][y+1] == '1' ) DFS(grid, visit, x, y+1); 
}

int numIslands(vector<vector<char>>& grid) {
    vector<vector<bool>>visit(grid.size(), vector<bool>(grid[0].size(), false));
    int result = 0;

    for(int i=0; i<grid.size(); i++){
        for(int j=0; j<grid[0].size(); j++){
            if(!visit[i][j] && grid[i][j] == '1'){
                DFS(grid, visit, i, j);
                result++;
            }
        }
    }
    return result;
}
```

### **思路二 - Union Find**

這題其實也可以用 Union Find 解，只是實做起來真的有點麻煩，但兩種方法的效能分析其實是差不多的，所以就當學習用了。

#### **Union Find 思路**

一樣直接 iterate 整個 2D array，當遇到 '1' 就做 unite，這樣看最後有幾個獨立的 Disjoint Set 就是答案了。

#### **如何計算 Disjoint Set 數量?**

這裡關鍵在於如何計算總共有多少個獨立的 Disjoint Set，所以我們可以維護一個 integer **count**，用來計算 island 數量 + water 數量，先初始化為 grid 的總數，當一個 grid 被 unite 後 count 就減一就行了。至於 water 的總數在 iterate 2D array 的時候就可以計算，最後答案把 count - water 數量就是 island 數量。

#### **2D Array 在 Union Find 的 parent 中怎麼存放?**

`vector<int>parent` 存的是每一個對應的 grid 的 parent，問題是這個 vector 是 1D 的，我們的 grid 是 2D 的，因此可以利用 Linear Mapping 把 2D Array 轉成 1D 的 index。

```
index = i * n + j
```

**Time Complexity** - `O( m × n × α(n) )`，Unite 的操作是 α(n)，但是成長極為緩慢可以被忽略，基本上就是 `O( m × n )`<br>
**Space Complexity** - `O( m × n )`，需要儲存 Union-Find 的 parent 和 rank array。

### **Implementation**

```cpp
class UnionFind {
public:
    vector<int>parent;
    vector<int>rank;
    int count;

    UnionFind(int n){
        parent.resize(n);
        rank.resize(n, 0);
        for(int i=0; i<n; i++){
            parent[i] = i;
        }
        count = n;
    }

    int find(int x){
        if(parent[x] != x){
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    void unite(int x, int y){
        int rootX = find(x);
        int rootY = find(y);
        if( rootX != rootY ){
            if( rank[rootX] > rank[rootY] ){
                parent[rootY] = rootX;
            } else if( rank[rootY] > rank[rootX] ){
                parent[rootX] = rootY;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            count--;
        }
    }
};

int numIslands(vector<vector<char>>& grid) {

    vector<vector<int>>direction = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    int numberOfWater = 0;
    UnionFind uf(grid.size()*grid[0].size());

    for(int i=0; i<grid.size(); i++){
        for(int j=0; j<grid[0].size(); j++){
            if( grid[i][j] == '0' ) {
                numberOfWater++;
            } else {
                for(vector<int>& d : direction){
                    int neighbor_i = i + d[0];
                    int neighbor_j = j + d[1];
                    if( neighbor_i >= 0 && neighbor_i < grid.size() && neighbor_j >= 0 && neighbor_j < grid[0].size()
                        && grid[neighbor_i][neighbor_j] == '1' ) {
                        uf.unite( i*grid[0].size()+j, neighbor_i*grid[0].size()+neighbor_j ); 
                    }
                }
            }
        }
    }
    return uf.count - numberOfWater;
}
```