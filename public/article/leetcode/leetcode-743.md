---
title: "[ Leetcode 743 ] Network Delay Time | 解題思路分享"
date: "2025-07-14"
author: James
tags: Graph,Shortest Path,Dijkstra
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: b20cd333-940b-4ace-beea-7ce66a152642
---

給一個 weighted graph times[i]，其中 times[i] = [u, v, w]，代表從 u 傳訊號到 v 需要時間 w，給一個起點 k，訊號從 k 開始傳。要回傳從 k 出發，把訊號傳到所有 node 需要多久？如果有 node 永遠收不到訊號，回傳 -1。

題目連結 🔗：[https://leetcode.com/problems/network-delay-time/](https://leetcode.com/problems/network-delay-time/)

## 問題分析

這題轉成白話文其實意思就是找到從 `k` 出發到最遠的點的最短距離，而如果有 node 跟 `k` 的距離是無限大，也就是到不了，那就要回傳 `-1`。而在 Shortest Path 的 Algorithm 中，有一種就是專門處理 single source 且沒有負數 edges 的，那就是 Dijkstra，詳情可以參考下面這篇文章。

[[ Algorithm ] Shortest Path - Dijkstra | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/dijkstra)

## 解題思路 - Dijkstra Algorithm

首先先建立 adjacency list

```cpp
vector<vector<pair<int, int>>>adj(n + 1);

for(int i = 0; i < times.size(); i++){
    adj[times[i][0]].push_back({times[i][2], times[i][1]});
}
```

我們可以直接寫出 Dijkstra Algorithm

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

在做完 Dijkstra 後會得到一個 dist[i]，代表從 `k` 出發到每個點的最短距離，因此直接從 dist[i] 中找到最長的距離就好，但如果這裡面有 INT_MAX，表示從 `k` 出發到不了，就要回傳 -1。

```cpp
int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int, int>>>adj(n + 1);
    int maxDist = 0;
    
    for(int i = 0; i < times.size(); i++){
        adj[times[i][0]].push_back({times[i][2], times[i][1]});
    }

    vector<int>dist = dijkstra(n, k, adj);
    for(int i = 1; i < n + 1; i++){
        if(dist[i] == INT_MAX) return -1;
        maxDist = max(maxDist, dist[i]);
    }

    return maxDist;
}
```

**Time Complexity** - `O((V + E) log V)`<br>
**Space Complexity** - `O(V + E)`

```cpp
class Solution {
public:
    vector<int> dijkstra(int n, int k, vector<vector<pair<int, int>>>&adj){
        vector<int>dist(n + 1, INT_MAX);
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>>pq;

        dist[k] = 0;
        pq.push({0, k});

        while(!pq.empty()){
            auto [srcCost, src] = pq.top();
            pq.pop();

            if(srcCost > dist[src]) continue;
            for(auto [neighborCost, neighbor] : adj[src]){
                if(dist[neighbor] > dist[src] + neighborCost){
                    dist[neighbor] = dist[src] + neighborCost;
                    pq.push({dist[neighbor], neighbor});
                }
            }
        }

        return dist;
    }

    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<vector<pair<int, int>>>adj(n + 1);
        int maxDist = 0;
        
        for(int i = 0; i < times.size(); i++){
            adj[times[i][0]].push_back({times[i][2], times[i][1]});
        }

        vector<int>dist = dijkstra(n, k, adj);
        for(int i = 1; i < n + 1; i++){
            if(dist[i] == INT_MAX) return -1;
            maxDist = max(maxDist, dist[i]);
        }

        return maxDist;
    }
};
```