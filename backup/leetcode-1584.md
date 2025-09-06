---
title: "[ Leetcode 1584 ] Min Cost to Connect All Points | 解題思路分享"
date: "2025-07-23"
author: James
tags: Minimum Spanning Tree,Prim's Algorithm,Graph
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/min-cost-to-connect-all-points/](https://leetcode.com/problems/min-cost-to-connect-all-points/)

### **問題分析**

這題要找的是

> 連接所有點，使得 cost 最小

這就是 Minimum Spanning Tree 最基本的運用，而這題因為 edges 太多了，所以比較適合 Prim's Algorithm

[[ Algorithm ] Minimum Spanning Tree - Prim's Algorithm | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/prim-algorithm)

### **解題思路 - Prim's Algorithm**

如果看完上面的文章，就會發現幾乎只要 Prim's Algorithm 重新做一次就可以了，只是要注意兩個地方，第一是每一個 nodes 的 neighbors 是剩下的其他所有 nodes，因為每一個點都有機會接到剩下每一個點

```cpp
while(!pq.empty()){
    auto [cost, node] = pq.top(); pq.pop();
    if(visit[node]) continue;
    visit[node] = true;
    minCost += cost;

    for(int i = 0; i < n; i++){
        // add neighbors into priority queue
    }
}
```

再來 cost 的計算就是如同題目所說的，用公式解就可以了

```cpp
while(!pq.empty()){
    auto [cost, node] = pq.top(); pq.pop();
    if(visit[node]) continue;
    visit[node] = true;
    minCost += cost;

    for(int i = 0; i < n; i++){
        int dist = abs(points[node][0] - points[i][0]) + abs(points[node][1] - points[i][1]);
        if(!visit[i]) pq.push({dist, i});
    }
}
```

**Time Complexity** - `O(n^2 log n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**

```cpp
int minCostConnectPoints(vector<vector<int>>& points) {
    int n = points.size();
    int minCost = 0;
    vector<bool>visit(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>>pq;
    pq.push({0, 0});

    while(!pq.empty()){
        auto [cost, node] = pq.top(); pq.pop();
        if(visit[node]) continue;
        visit[node] = true;
        minCost += cost;

        for(int i = 0; i < n; i++){
            int dist = abs(points[node][0] - points[i][0]) + abs(points[node][1] - points[i][1]);
            if(!visit[i]) pq.push({dist, i});
        }
    }

    return minCost;
}
```