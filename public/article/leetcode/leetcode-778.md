---
title: "[ Leetcode 778 ] Swim in Rising Water | 解題思路分享"
date: "2025-07-14"
author: James
tags: Matrix,Shortest Path, Dijkstra
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 203ccf65-9bec-49be-9a3d-836f33f093d4
---

給一個 `n x n` 的矩陣，格子裡是高度 `0` ~ `n^2-1`，水面每秒上升 1，當水面到達 t 時，你可以走到高度 ≤ t 的格子，一開始在左上 (0,0)，要走到右下 (n-1, n-1)，只能走上下左右相鄰，求最小的時間 t，使得你可以順利從左上走到右下。

題目連結 🔗：[https://leetcode.com/problems/swim-in-rising-water/](https://leetcode.com/problems/swim-in-rising-water/)

## 問題分析

這題的核心本質是要找到從 starting point 出發到 end point

> 所有路徑上最大值中最小的

我本來以為這是 2d dp 的題目，聽起來很合理，如果用 dp[i][j] 當成「starting point 到 grid[i][j] 所有路徑上最大值中的最小值」，利用以下的 Transition Function 來更新整個 table

```cpp
dp[i][j] = max(dp[i][j], min(dp[i-1][j], dp[i][j-1]))
```

如果路線只能往右跟往下走，那這樣解就可以了，但這題關鍵在於我們可以往四面八方走，所以 dp 的更新需要從 4 個方向來更新，那 DP 就非常不合適了。

所以我們繼續往下想，matrix 實際上就是一個巨大的 weighted undirected graph，題目要找到符合某 target 的路徑，會不會是類 shortest path 的題目呢？如果 shortest path 是要找到所有路徑中最短的，我們改成要找所有路徑上最大值中的最小值，而這個 graph 中沒有 negative edges，所以可以利用變形的 Dijkstra 來處理這個問題。

[[ Algorithm ] Shortest Path - Dijkstra | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/dijkstra)

## 解題思路 - Dijkstra

我們先拿出 Dijkstra 的 template 來分析一下

```cpp
vector<int> dijkstra(int n, int k, vector<vector<pair<int, int>>>&adj){
    vector<int>dist(n + 1, INT_MAX);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>>pq;

    dist[k] = 0;
    pq.push({0, k});

    while(!pq.empty()){
        auto [srcCost, src] = pq.top();
        pq.pop();

        if(srcCost > dist[src]) continue;
        for(auto [destCost, dest] : adj[src]){
            if(dist[dest] > dist[src] + destCost){
                dist[dest] = dist[src] + destCost;
                pq.push({dist[dest], dest});
            }
        }
    }

    return dist;
}
```

Dijkstra 原本是用來處理 shortest path，也就是說，dist[i] 是用來儲存當前跟 starting point 的最短距離，每 visit 一個新的 node，代表這個 node 已經找到真正的 shortest path，就可以去更新 dist[neighbor]。

套進來這題，dist[i] 可以改成跟 starting point 的所有路徑上最大值中的最小值，每 visit 一個新的 node，代表這個 node 已經找到真正的最小值，所以就可以去計算 neighbor 並更新 dist[neighbor]，流程上完全是一樣的。

首先，因為 `grid` 是 2d，所以 dist 跟 priority queue 存 node 的部分都必須改成 2d，這裡可以運用 tuple，可以儲存三個 object

```cpp
int n = grid.size(), m = grid[0].size();
priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>>pq;
vector<vector<int>>dist(n, vector<int>(m, INT_MAX));
```

priority queue 跟 dist 都需要先初始化，而 starting point 所有路徑上最大值的最小值，就是 grid[0][0] 自己

```cpp
pq.push({grid[0][0], 0, 0});
dist[0][0] = grid[0][0];
```

按照大小 visit 每一個已經確定最小值的 grid

```cpp
while(!pq.empty()){
    auto [srcCost, x, y] = pq.top();
    pq.pop();
    
    // ...
}
```

下一步要更新每一個 neighbor，也是這題的關鍵，假設 neighbor 的座標是 (newX, newY)，dist[newX][newY] 儲存的是「當前 starting point 到 grid[newX][newY] 所有路徑中最大值的最小值」，dist[x][y] 代表剛剛 pop 出來的 grid 路徑上的最小值，如果 max(dist[x][y], grid[newX][newY]) 比 dist[newX][newY] 小，表示 starting point -> (x, y) -> (newX, newY) 這條路徑上的最大值出現了更小的了，就必須更新進 dist 並把 neighbor 推入 priority queue。

```cpp
int d[5] = {0, 1, 0, -1, 0};

while(!pq.empty()){
    auto [srcCost, x, y] = pq.top();
    pq.pop();

    for(int i = 0; i < 4; i++){
        int newX = x + d[i], newY = y + d[i+1];
        if(newX < 0 || newX >= n || newY < 0 || newY >= m) continue;
        if(max(dist[x][y], grid[newX][newY]) < dist[newX][newY]){
            dist[newX][newY] = max(dist[x][y], grid[newX][newY]);
            pq.push({dist[newX][newY], newX, newY});
        }
    }
}
```

要 iterate 四個方向方法有很多，這個寫法是我看到最簡潔的，用一個 array 就搞定了，記錄一下。

跟原版 Dijkstra 一樣，如果 priority queue 中遇到 outdated 的 node，就直接忽略

```cpp
if(srcCost > dist[x][y]) continue;
```

最後的答案在座標 (n-1, m-1) 身上，如果我們 visit 到這個 node 表示已經找到答案，就不用再繼續往下了

```cpp
if(x == n-1 && y == m-1) return srcCost;
```

最後每一 part 都合併起來就是答案

**Time Complexity** - `O(n^2 log n)`，因為有 `n^2` 個 edge，每一次 push / pop 都是 `log n`<br>
**Space Complexity** - `O(n^2)`

## Implementation

```cpp
int swimInWater(vector<vector<int>>& grid) {
    int n = grid.size(), m = grid[0].size();
    priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>>pq;
    vector<vector<int>>dist(n, vector<int>(m, INT_MAX));
    int d[5] = {0, 1, 0, -1, 0};

    pq.push({grid[0][0], 0, 0});
    dist[0][0] = grid[0][0];

    while(!pq.empty()){
        auto [srcCost, x, y] = pq.top();
        pq.pop();

        if(x == n-1 && y == m-1) return srcCost;
        if(srcCost > dist[x][y]) continue;

        for(int i = 0; i < 4; i++){
            int newX = x + d[i], newY = y + d[i+1];
            if(newX < 0 || newX >= n || newY < 0 || newY >= m) continue;
            if(max(dist[x][y], grid[newX][newY]) < dist[newX][newY]){
                dist[newX][newY] = max(dist[x][y], grid[newX][newY]);
                pq.push({dist[newX][newY], newX, newY});
            }
        }
    }

    return -1;
}
```