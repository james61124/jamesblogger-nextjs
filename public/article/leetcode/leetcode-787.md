---
title: "[ Leetcode 787 ] Cheapest Flights Within K Stops | 解題思路分享"
date: "2025-07-15"
author: James
tags: Graph,Shortest Path,Dijkstra,Bellman-Ford
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: f121ee3a-c2b3-44fb-a90d-fe02b5ccf382
---

給一個 weighted directed graph，代表飛機從一個 node 飛到下一個需要花費的錢，要算出從 `src` 飛到 `dst` 最省可以花到多少就到達，而其中只能經過 `k` 個中轉站。

題目連結 🔗：[https://leetcode.com/problems/cheapest-flights-within-k-stops/](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

### **問題分析**

分析這題的本質，就是要找

> 從 starting point 出發，edges 數量不超過 k + 1 的 path 中最便宜的路線

這屬於，single source shortest path，而且沒有 negative edges，所以可以朝 Dijkstra 想。

[[ Algorithm ] Shortest Path - Dijkstra | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/dijkstra)

### **解題思路 - Dijkstra**

Dijkstra 其實只能解決 shortest path，對於限制路徑長是沒有辦法的，我們需要額外處理這部分。

Dijkstra Algorithm 我們可以簡單分解成幾個步驟

> 1. visit node - 從 priority queue 中取出確定 shortest path 的 node<br>
> 2. remove outdated data - 有一些 node 已經找到更短的路徑了，這些舊的資料就不用管了<br>
> 3. iterate neighbor - 計算這個 node 所有鄰居的狀態<br>
> 4. push into pq - 如果這個 neighbor 有找到更短的路徑，就可以被 push 進去 priority queue

```cpp
while(!pq.empty()){
    // visit node
    auto [srcCost, src] = pq.top();
    pq.pop();

    // remove outdated data
    if(srcCost > dist[src]) continue;

    // iterate neighbor
    for(auto [destCost, dest] : adj[src]){

        // push into pq
        if(dist[dest] > dist[src] + destCost){
            dist[dest] = dist[src] + destCost;
            pq.push({dist[dest], dest});
        }
    }
}
```

我們要限制路徑長，第一感就是控制哪些 node 應該要被放入 priority queue 中，所以從 `dist[dest] > dist[src] + destCost` 這個 condition 下手，我們可以在 pq 裡面多存一個距離 starting point 的路徑長，當這個路徑長已經比 k + 1 大，就不要推進去 priority queue

```cpp
if(dist[dest] > dist[src] + destCost && stops < k + 1)
```

但這會有一個致命的問題，Dijkstra 的本質就是找到 `node` 的最短路徑後就不會再更新 dist[node] 了，因此如果有一條路徑原本是 shortest path，但是因為 stops 超過了而不能用，理論上要去找下一條 path，但是因為 Dijkstra 的特性，他會找不到其他條 path，因為找到最短路徑後就不會再繼續更新了，看下面這個例子：

```
(0, 1, 1)
(1, 2, 1)
(2, 3, 1)
(0, 2, 4)

k = 1
```

(0, 2) 這條 edge 被 pop 出來時，會因為 node 2 已經有最短路徑而不會繼續往下更新，所以會找不到 `0 -> 2 -> 3` 這條路線，因此我們必須把這個特性剔除。

這條 condition `if(dist[dest] > dist[src] + destCost)` 事實上只是為了 priority queue 不要爆炸而已，但 priority queue 本身就已經會排序了，所以不要考慮時間複雜度，把全部的 neighbor 都推進去 pq 中也不會錯，而拿掉這條 condition 之後，dist[node] 就算找到 shortest path 之後也有機會繼續更新。

```cpp
while(!pq.empty()){
    auto [srcCost, src] = pq.top();
    pq.pop();

    if(srcCost > dist[src]) continue;
    for(auto [destCost, dest] : adj[src]){
        pq.push({dist[dest], dest});
    }
}
```

那我們要怎麼限制路徑長呢？priority queue 裡面可以多存一個欄位，代表從這個 node 到 starting point 的路徑長，當這個路徑長超過 k + 1，就不要繼續把他的 neighbor 丟進去 priority queue 了，因為這條 path 已經不會通，寫起來會像這樣

```cpp
int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>>pq;
    vector<vector<pair<int, int>>>adj(n);

    for(auto f : flights){
        adj[f[0]].push_back({f[1], f[2]});
    }

    pq.push({0, 0, src});

    while(!pq.empty()){
        auto [cost, stops, from] = pq.top();
        pq.pop();

        if(from == dst) return cost; // 如果 visit 到 dst 就可以 return
        if(stops > k) continue; // 路徑長太長，直接不考慮這條 path

        for(auto [neighbor, price] : adj[from]){
            pq.push({cost + price, stops + 1, neighbor});
        }
    }

    return -1;
}
```

用上面的寫法我們會發現，dist[node] 只是用來儲存 `node` 當下的最短路徑，如果我們不需要控制推入 priority queue 的東西了，就也不用存了。

這個寫法邏輯上已經沒有問題，只是會花太多時間，因為 priority queue 還是放太多東西，所以我們如果找到 starting point -> `node` 路徑長 < k + 1 的路徑後，後續遇到比這個路徑更長的 path 就可以直接丟掉，原因是越晚從 priority queue pop 出來的路徑一定更長，表示我們已經找到符合路徑長的條件下 starting point -> `node` 的最佳解了，那就不用再繼續更新了。

```cpp
int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>>pq;
    vector<vector<pair<int, int>>>adj(n);
    vector<int>bestStop(n,INT_MAX); // 儲存當前最短的路徑長

    for(auto f : flights){
        adj[f[0]].push_back({f[1], f[2]});
    }

    pq.push({0, 0, src});

    while(!pq.empty()){
        auto [cost, stops, from] = pq.top();
        pq.pop();

        if(from == dst) return cost;
        if(stops > k) continue;
        if(stops >= bestStop[from]) continue; // 如果遇到更長的路徑，就 drop
        bestStop[from] = stops;

        for(auto [neighbor, price] : adj[from]){
            pq.push({cost + price, stops + 1, neighbor});
        }
    }

    return -1;
}
```

**Time Complexity** - `O(E log E)`，因為有 `E` 個 edge，每一次 push / pop 都是 `log E`<br>
**Space Complexity** - `O(E + n)`，priority queue size 最多是 E，還有一個 size n 的 `bestStop`

#### **Implementation**

```cpp
int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>>pq;
    vector<vector<pair<int, int>>>adj(n);
    vector<int>bestStop(n,INT_MAX);

    for(auto f : flights){
        adj[f[0]].push_back({f[1], f[2]});
    }

    pq.push({0, 0, src});

    while(!pq.empty()){
        auto [cost, stops, from] = pq.top();
        pq.pop();

        if(from == dst) return cost;
        if(stops > k) continue;
        if(stops >= bestStop[from]) continue;
        bestStop[from] = stops;

        for(auto [neighbor, price] : adj[from]){
            pq.push({cost + price, stops + 1, neighbor});
        }
    }

    return -1;
}
```

### **時間空間優化 - Bellman-Ford Algorithm**

為什麼 Bellman-Ford 會適合這題？因為我們發現 Dijkstra 需要重複 relax 同一個 node，表示每一個 `stops` 其實都是不同狀態，那與其我們需要手動維護 priority queue 中 `stops` 的狀態，不如利用 Bellman-Ford 一次 relax 所有 edges，這樣就把所有 stops 都考慮進去了

[[ Algorithm ] Shortest Path - Bellman-Ford | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/bellman-ford)

我們先寫一個 Bellman-Ford 的 template

```cpp
vector<int>dist(V, INT_MAX);
dist[src] = 0;

for (int i = 0; i < V - 1; ++i) {
    for (auto [u, v, w] : edges) {
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
        }
    }
}
```

這題的關鍵有兩個

> 1. 限制只能走 K + 1 次<br>
> 2. 每一次 relax 要確保只走了一個 step

第一件事情很簡單，只要限制 relax k + 1 次就行了

```cpp
int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<int>dist(n, INT_MAX);
    dist[src] = 0;

    for(int i = 0; i < k + 1; i++){
        bool changed = false;
        for(auto &f : flights){
            int from = f[0], to = f[1], price = f[2];
            if(dist[from] != INT_MAX && dist[from] + price < dist[to]){
                dist[to] = dist[from] + price;
                changed = true;
            }
        }
        if(!changed) break;
    }

    return dist[dst] == INT_MAX ? -1 : dist[dst];
}
```

但這樣每一次 relax 可能會走很多 step，我們要確保計算新的距離時用的是上一次 relax 的資料，所以更新時我們要避免更新到舊的資料

```cpp
int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<int>dist(n, INT_MAX);
    dist[src] = 0;

    for(int i = 0; i < k + 1; i++){
        bool changed = false;
        vector<int>tmp(dist); // 更新在這，這樣就不會動到 dist
        for(auto &f : flights){
            int from = f[0], to = f[1], price = f[2];
            if(dist[from] != INT_MAX && dist[from] + price < tmp[to]){
                tmp[to] = dist[from] + price; // 保持 dist 的狀態
                changed = true;
            }
        }
        swap(dist, tmp);
        if(!changed) break;
    }

    return dist[dst] == INT_MAX ? -1 : dist[dst];
}
```

這樣就完成了，實作非常簡單

**Time Complexity** - `O(KE)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<int>dist(n, INT_MAX);
    dist[src] = 0;

    for(int i = 0; i < k + 1; i++){
        bool changed = false;
        vector<int>tmp(dist); 
        for(auto &f : flights){
            int from = f[0], to = f[1], price = f[2];
            if(dist[from] != INT_MAX && dist[from] + price < tmp[to]){
                tmp[to] = dist[from] + price; 
                changed = true;
            }
        }
        swap(dist, tmp);
        if(!changed) break;
    }

    return dist[dst] == INT_MAX ? -1 : dist[dst];
}
```