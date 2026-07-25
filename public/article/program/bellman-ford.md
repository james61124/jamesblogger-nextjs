---
title: "[ Algorithm ] Shortest Path - Bellman-Ford | 核心概念與 Leetcode 題型解析"
date: "2025-07-15"
author: James
tags: Algorithm,Shortest Path,Bellman-Ford
image: /images/program/algorithm.png
description: "Bellman-Ford 是一個 single source shortest path 的 Algorithm，運用在 weighted graph 上，可以找到 single source 到其他所有 nodes 的 shortest path，因此會輸出一個 dist[i] 代表從 starting point 到 node `i` 的最短距離，他跟 Dijkstra 最大的差別是，他可以運用在有 negative edges 的 graph 上，不過如果出現 negative cycle 就不行。"
readTime: 2
id: be9d5c54-f36e-4a95-9433-79c80267535d
---

Bellman-Ford 是一個 single source shortest path 的 Algorithm，運用在 weighted graph 上，可以找到 single source 到其他所有 nodes 的 shortest path，因此會輸出一個 dist[i] 代表從 starting point 到 node `i` 的最短距離，他跟 Dijkstra 最大的差別是，他可以運用在有 negative edges 的 graph 上，不過如果出現 negative cycle 就不行。

negative cycle 的定義是

> cycle 上所有 edge 加起來是負數

所以如果出現 negative cycle，表示我可以一直繞圈圈而距離反而會越來越小，那 shortest path 就沒有意義，因此不能出現 negative cycle

Bellman-Ford 的核心思想是對所有 edges (from, to, cost)，嘗試用 dist[from] + cost 更新 dist[to]

```cpp
vector<int>dist(V, INT_MAX);
dist[src] = 0;

for (auto [from, to, cost] : edges) {
    if (dist[from] != INT_MAX && dist[from] + cost < dist[to]) {
        dist[to] = dist[from] + cost;
    }
}
```

這是在幹嘛呢？從「有 visit 過的 nodes」開始，對他們周邊的 edges 都檢查過一次，看看有沒有更短的路徑出現，所以 dist[node] 如果不是 INT_MAX 就表示已經被 visit 過了，而這個過程就是 relaxation。

假設總共有 `V` 個 node，在沒有 negative cycle 的情況下這個過程最多只會重複 V - 1 次，因為就算每一次 relax 只走了一個 step，對於有 V 個 node 的 graph 來說最長的 shortest path 一定不會超過 V - 1，所以我們最多只需要做 V - 1 次 relaxation。

```cpp
vector<int>dist(V, INT_MAX);
dist[src] = 0;

for (int i = 0; i < V - 1; ++i) {
    for (auto &[from, to, cost] : edges) {
        if (dist[from] != INT_MAX && dist[from] + cost < dist[to]) {
            dist[to] = dist[from] + cost;
        }
    }
}
```

這樣已經可以求出 shortest path，但還可以再優化一點，只要這一次的 relaxation 沒有改變任何值，就表示已經結束更新了，不用再繼續往下 relax 了。

```cpp
vector<int>dist(V, INT_MAX);
dist[src] = 0;

for (int i = 0; i < V - 1; i++) {
    bool changed = false;
    for (auto &[from, to, cost] : edges) {
        if (dist[from] != INT_MAX && dist[from] + cost < dist[to]) {
            dist[to] = dist[from] + cost;
            changed = true;
        }
    }
    if(!changed) break;
}
```

## Negative Cycle Detection

而做完 V - 1 次的 relax，如果發現繼續 relax dist[i] 還可以繼續被修改，就表示我們遇到 negative cycle 了，也就是說我們可以利用 bellman-ford 來 detect negative cycle

```cpp
vector<int>dist(V, INT_MAX);
dist[src] = 0;

for (int i = 0; i < V - 1; i++) {
    bool changed = false;
    for (auto &[from, to, cost] : edges) {
        if (dist[from] != INT_MAX && dist[from] + cost < dist[to]) {
            dist[to] = dist[from] + cost;
            changed = true;
        }
    }
    if(!changed) break;
}

// negative cycle detection (optional)
bool isNegativeCycle = false;
for (auto [from, to, cost] : edges) {
    if (dist[from] != INF && dist[from] + cost < dist[to]) {
        isNegativeCycle = true;
    }
}
```

- Time Complexity - `O(V x E)`，比 Dijkstra 慢，但可以用在 negative edges 身上<br>
- Space Complexity - `O(V)`

## Example

[[ Leetcode 787 ] Cheapest Flights Within K Stops](https://www.jamesblogger.com/leetcode/articles/leetcode-787)