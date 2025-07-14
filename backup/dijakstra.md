
> single source shortest path

Dijkstra 可以找到 single source 到其他所有 nodes 的 shortest path

首先 adjacency list

利用 dist[i] 儲存當前 `i` 到 `k` 的最短路徑，也就是說 dist[k] = 0。

dist 會持續更新，而 Dijkstra 的目標是將所有 node `src` 轉成「已經確定起始點 `k` 到自己最短距離」的狀態，到達這個狀態的 node 我們將不會再修改 dist[src]，而當所有 `src` 都到達這個狀態，就可以回傳 dist。

當我們 visit 到一個「已經確定起始點 `k` 到自己最短距離」的 node `src`，就可以去更新 dist[i]，因為 dist[src] 已經不會再變，所以所有 `src` 的 neighbor 在通過 `src` 的這條路徑的最短路線已經確定，就是

```cpp
dist[neighbor] = dist[src] + (src->neighbor cost)
```

但是要注意，這個只是「從 `k` 出發通過 `src`」的最短路徑，並不一定是從 `k` 出發的最短路徑，所以如果 `dist[src] + (src->neighbor value)` 比原始的 dist[neighbor] 還要小，那也不用更新到 dist 上了，甚至也不用 push 進去 priority queue。

```cpp
for(auto [neighborCost, neighbor] : adj[src]){
    if(dist[neighbor] > dist[src] + neighborCost){
        dist[neighbor] = dist[src] + neighborCost;
        pq.push({dist[neighbor], neighbor});
    }
}
```

如果 priority queue 裡面放的都是「從 `k` 出發通過 `src` 的最短路徑」，那先被 pop 出來的 pair { 到 `k` 的距離, node } 就已經確定到 `k` 的最短距離了，因為後面再被 pop 出來的 node 到 `k` 的距離都會更長，簡單來說

> 被 pop 出來的 node，就是「已經確定起始點 `k` 到自己最短距離」的 node

寫到這邊 Dijkstra 就是一個 cycle

> 1. pop 出已經確定起始點 `k` 到自己最短距離」的 node `src`<br>
> 2. 計算 `k` -> `src` -> `neighbor` 的最短距離<br>
> 3. 如果找到從 `k` 出發更短的路徑就推入 priority queue 並更新 dist[neighbor]

我們把所有 visit 到新的更短路徑的 nodes 都丟進去 priority queue 中，queue 裡面放的是一個 pair { 到 `k` 的距離, node }，如果每一次都將「到 `k` 的距離」最小的 pop 出來，表示被 pop 出來的 node 已經確定起始點 `k` 到自己的最短距離了，

而我們持續 visit「已經確定起始點 `k` 到自己的最短距離」的 node，我們叫它 `src`，`src` 的 neighbors 就可以計算路徑經過 `src` 的最短路徑，如果這條路徑

每 pop 出一個點 `src`，代表這個 node 已經確定了起始點 `k` 到自己的最短距離了，所以就可以更新他所有 neighbors 目前的最小距離，也就是

```
dist[neighbor] = cost + dist[src]
```

而 dist[neighbor] 如果要放進去 priority queue 裡面，表示找到了更小的 dist[neighbor]，

dist[1] = 1
push 1, 1
dist[3] = 2
push 3, 4

pop 1, 1
dist[2] = 2
push 2, 1

pop 2, 1

pop 3, 2


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

ex

743