---
title: "[ Algorithm ] Minimum Spanning Tree - Prim's Algorithm | 核心概念與 Leetcode 題型解析"
date: "2025-07-23"
author: James
tags: Algorithm,Minimum Spanning Tree,Prim's Algorithm
image: /images/program/algorithm.png
description: ""
readTime: 2
---

首先先介紹甚麼是 Minimum Spanning Tree (MST)，就是

> 從 weighted undirected graph 中，找出一個路線包含所有 nodes 且沒有任何 cycle，而且 edges 的 cost 最小

Prim's Algorithm 是用來找 Minimum Spanning Tree 的演算法，思路很簡單

> 1. 從任意 node 開始，先加入 MST 中<br>
> 2. 再來從已知的 MST 中擴散，每一次都找 cost 最小的 edges，並把新的 nodes 加入 MST

我們來看程式碼

首先我們需要一個 priority queue 來儲存 edges 的資訊 [cost, dest]，還有一個 visit[i] 來判斷哪些 nodes 已經被加入 MST，一開始先將 starting point 加入 priority queue 中

```cpp
int prim(const vector<vector<pair<int, int>>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, 0});

    // ...
}
```

priority queue 裡面存的是 MST 的候選人，我們每一次會選擇 cost 最小的加入 MST 中，而當一組 [cost, dest] 被 pop 出來並被寫入 visit[i] 時，才是真正將 `dest` 存入 MST。

```cpp
int prim(const vector<vector<pair<int, int>>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, 0});

    while (!pq.empty()) {
        auto [cost, u] = pq.top(); pq.pop();
        visited[u] = true; // 加入 MST 中
    }
}
```

而每一個被加入 MST 的 node，都要把他們的鄰居都推入 priority queue 中，當作是新的 MST 候選人，就是一種 MST 擴展的感覺。而如此一來有可能會重複推入已經看過的 nodes 進去 priority queue 中，所以遇到已經在 MST 裡的 node，就直接 drop 就可以了

```cpp
int prim(const vector<vector<pair<int, int>>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, 0});

    while (!pq.empty()) {
        auto [cost, u] = pq.top(); pq.pop();
        if (visited[u]) continue; // u 已經在 MST 中，直接 drop
        visited[u] = true;

        // 把 neighbors 推入 priority queue
        for (auto& [v, w] : adj[u]) {
            if (!visited[v]) {
                pq.push({w, v});
            }
        }
    }
}
```

Prim's Algorithm 是要計算 MST 中所有 edges 的 cost 總和，所以當一個 node 被加入 MST 中，就加總 cost 就行了

```cpp
int prim(const vector<vector<pair<int, int>>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, 0});
    int totalCost = 0;

    while (!pq.empty()) {
        auto [cost, u] = pq.top(); pq.pop();
        if (visited[u]) continue;
        visited[u] = true;
        totalCost += cost;

        for (auto& [v, w] : adj[u]) {
            if (!visited[v]) {
                pq.push({w, v});
            }
        }
    }

    return totalCost;
}
```

684