---
title: "[ Algorithm ] Shortest Path - Dijkstra | 核心概念與 Leetcode 題型解析"
date: "2025-07-14"
author: James
tags: Algorithm,Shortest Path,Dijkstra
image: /images/program/algorithm.png
description: "Dijkstra 是一個 single source shortest path 的 Algorithm，運用在 weighted graph 上，可以找到 single source 到其他所有 nodes 的 shortest path，因此輸出是一個 dist[i]，代表起始點 `k` 到每一個 nodes 的最短距離。"
readTime: 2
---

Dijkstra 是一個 single source shortest path 的 Algorithm，運用在 weighted graph 上，可以找到 single source 到其他所有 nodes 的 shortest path，因此輸出是一個 dist[i]，代表起始點 `k` 到每一個 nodes 的最短距離。

因為是 weighted graph，我們會使用 adjacency list 來儲存 graph 的結構，同時記錄每個相鄰 node 的 cost。可以使用以下的資料結構：

```cpp
vector<vector<pair<int, int>>>adj
```

其中，`pair<int, int>` 代表 {neighbor, cost}，即：相鄰節點與其對應的邊的權重。

Dijkstra 的關鍵思想是：**由近到遠地依序探索每個 node**，並不斷更新最短距離 dist[i]。為了實現這一點，我們選擇使用 priority queue 來維護目前已知距離最短的 nodes，而流程如下：

首先我們需要 dist[i] 來儲存 output，需要 priority queue 來儲存 { 起始點 `k` 到 node 的距離, node }

```cpp
vector<int>dist(n + 1, INT_MAX);
priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>>pq;
```

將起點 `k` 加入 priority queue 中，因為起始點就是自己，所以 dist[k] 設置為 0。

```cpp
dist[k] = 0;
pq.push({0, k});
```

每次從 queue 中取出目前已知距離最短的 node，而這樣就算是 visit 完這個 node

```cpp
while(!pq.empty()){
    auto [srcCost, src] = pq.top();
    pq.pop();

    // ...
}
```

每 visit 一個 `src`，我們要去計算 `src` 的每個 neighbors 在 `k`->`src`->`neighbor` 的最短距離，如果發現這個距離比當前的 dist[neighbor] 還要小，表示找到更短的 `k`->`neighbor` 的 path，就要推進去這個 priority queue 等待待會的 visit，同時更新 dist[neighbor]，而這個過程就是 relexation

```cpp
while(!pq.empty()){
    auto [srcCost, src] = pq.top();
    pq.pop();

    // relexation
    for(auto [neighborCost, neighbor] : adj[src]){
        if(dist[neighbor] > dist[src] + neighborCost){
            dist[neighbor] = dist[src] + neighborCost;
            pq.push({dist[neighbor], neighbor});
        }
    }
}
```

寫到這邊我們會發現，dist[i] 裡面存的是 `i` 目前為止跟 `k` 的最短距離，他是會因為新的 path 被發掘而一直被更新的，直到 node `i` 被 visit，表示 `i` 已經找到最短路徑了，就不會再被繼續更新，而 priority queue 就是存著準備被 visit 的路徑，而因為 minHeap 的特性，我們會由近到遠 visit 每一個 node，所以 node `i` 在第一次被 visit 的路徑一定是最短路徑。

再來我們思考幾個問題，每 visit 一個 `src`，我們要計算 `src` 的每個 neighbors 在 `k`->`src`->`neighbor` 的最短距離，為什麼要先比較一下這個距離是不是比 dist[neighbor] 小呢？我們都用 priority queue 了直接推進去不就好了嗎？反正 pop 出來都會是最小的。假設某個 node 有三條 path：

> `k -> v`，距離 3<br>
> `k -> ... -> v`，距離 8<br>
> `k -> ... -> ... -> v`，距離 12

如果不比較就放入 priority queue，裡面就會出現 {3, v}, {8, v}, {12, v}，多 push 進去跟 pop 出來都很花時間，先檢查過就不用浪費時間了。

但是有一種情況是真的得重複 push，例如說目前 dist[v] = 8，所以 push 進去 {8, v}，但是再來更新後發現出現 dist[v] = 3，於是又推 {3, v} 進去 priority queue，等到 visit 到 v 時會發現 3 處理過後，怎麼又會出現 8，為了解決這件事情，我們要把 outdated 的 path 剔除，所以需要在前面的程式碼補上一行：

```cpp
while(!pq.empty()){
    auto [srcCost, src] = pq.top();
    pq.pop();

    if(srcCost > dist[src]) continue; // 剔除 outdated
    for(auto [neighborCost, neighbor] : adj[src]){
        if(dist[neighbor] > dist[src] + neighborCost){
            dist[neighbor] = dist[src] + neighborCost;
            pq.push({dist[neighbor], neighbor});
        }
    }
}
```

而這才是完整的 Dijkstra。

**Time Complexity** - `O((V + E) log V)`<br>
**Space Complexity** - `O(V + E)`

### **Dijkstra 的限制**

因為 Dijkstra 是利用類似 Greedy 的方式

> 一旦你從起點 `k` 到某節點 `v` 找到距離最短的路徑，你就不用再考慮別的路徑了。

這只有在所有邊的權重都是非負的時才成立，如果今天出現 negative weight edges，後面可能出現「繞遠路但有負邊」的更短路徑，Dijkstra 就會出錯了，而這個時候就必須用到 - Bellman-Ford Algorithm。

### **Template**

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

### **範例**

[[ Leetcode 743 ] Network Delay Time | 解題思路分享](https://www.jamesblogger.com/leetcode/articles/leetcode-743)