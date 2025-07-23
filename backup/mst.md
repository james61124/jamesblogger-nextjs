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

首先我們需要一個 priority queue 來儲存 edges 的資訊 [cost, destination]，每一次選擇 cost 最小的 edge 取出，簡單來說，priority queue 裡面存的是 MST 的候選人，而當一組 [cost, destination] 被 pop 出來時，才是真正將 `destination` 存入 MST。



```cpp
int prim(const vector<vector<pair<int, int>>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, 0}); // {cost, node}
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