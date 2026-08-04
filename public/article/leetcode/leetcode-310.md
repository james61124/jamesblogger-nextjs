---
title: "[ Leetcode 310 ] Minimum Height Trees | 解題思路分享"
date: "2025-06-02"
author: James
tags: DFS,Tree,Topological Sort
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 87e2cbef-6426-4817-b395-6eb598437484
---

給一個 Tree，回傳哪些 nodes 當 root 樹的高度會最小。

題目連結 🔗：[https://leetcode.com/problems/minimum-height-trees/](https://leetcode.com/problems/minimum-height-trees/)

## 問題分析

這題我覺得超難，我有看到 rerooting DP 的解法，不過那個太複雜了以後有機會再整理，先講看起來實作起來最快的類 Topological Sort 解法。

## 解題思路 - 類 Topological Sort

首先我們要先知道一個很重要的解題關鍵

> 最小高度的 root 一定在 Tree 的中心上，而一顆 Tree 最多只會有兩個中心

這個原因是甚麼呢？因為 Tree 是 acyclic connected undirected graph，也就是沒有環的圖，因此兩個 node 之間只會有一條 path，而最小高度的 root 會落在最長的那幾條 path 的交會處，而如果 path 上有奇數個 nodes，center 就只有一個，如果 path 上有偶數個 nodes，center 就會有兩個。

因此這題可以利用 Topological Sort 的概念，把 degree = 1 先拿掉 ( degree = 鄰居數量 )，相當於拿掉 Tree 的葉子的部分，再來就更新 degree，然後繼續拿掉 degree = 1 的 nodes，直到剩下的 nodes 數量 <= 2，那就是找到 center 了。

所以首先我們要先把 adjacency list 建好，並且紀錄 degree。

```cpp
vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
    vector<vector<int>>adj(n);
    vector<int>degree(n, 0);

    for(int i = 0; i < edges.size(); i++){
        adj[edges[i][0]].push_back(edges[i][1]);
        adj[edges[i][1]].push_back(edges[i][0]);
        degree[edges[i][0]]++;
        degree[edges[i][1]]++;
    }
}
```

再來按照 Topological Sort 的邏輯，我們要把 degree = 1 的 nodes 移除，因此我們要把這些 nodes 先推進去 queue。

```cpp
vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
    vector<vector<int>>adj(n);
    vector<int>degree(n, 0);
    queue<int>q;

    for(int i = 0; i < edges.size(); i++){
        adj[edges[i][0]].push_back(edges[i][1]);
        adj[edges[i][1]].push_back(edges[i][0]);
        degree[edges[i][0]]++;
        degree[edges[i][1]]++;
    }

    for(int i = 0; i < degree.size(); i++){
        if(degree[i] == 1) {
            q.push(i);
        }
    }
}
```

再來我們要把這些 nodes 從 queue 裡面拿出來，然後把這些 nodes 的鄰居的 degree 都減一，因為我們移除這些 nodes 了，然後一直持續這個過程直到整棵樹剩下不到兩個 nodes。

```cpp
vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
    vector<vector<int>>adj(n);
    vector<int>degree(n, 0);
    queue<int>q;
    int remain = n;

    for(int i = 0; i < edges.size(); i++){
        adj[edges[i][0]].push_back(edges[i][1]);
        adj[edges[i][1]].push_back(edges[i][0]);
        degree[edges[i][0]]++;
        degree[edges[i][1]]++;
    }

    for(int i = 0; i < degree.size(); i++){
        if(degree[i] == 1) {
            q.push(i);
        }
    }

    while(remain > 2){ // 如果剩不到兩個 nodes 就跳出
        int times = q.size();
        remain -= times;

        for(int i = 0; i < times; i++){
            int u = q.front();
            q.pop();
            degree[u]--;

            for(int v : adj[u]){
                degree[v]--;
                if(degree[v] == 1) { // 持續將 degree = 1 的 nodes 推到 queue
                    q.push(v);
                }
            }
        }
    }
}
```

最後 queue 裡面剩下的 nodes 就是 center，也就是我們的答案。

```cpp
vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
    vector<vector<int>>adj(n);
    vector<int>degree(n, 0);
    queue<int>q;
    vector<int>result;
    int remain = n;

    if(n <= 2) {
        for(int i = 0; i < n; i++){
            result.push_back(i);
        }
        return result;
    }

    for(int i = 0; i < edges.size(); i++){
        adj[edges[i][0]].push_back(edges[i][1]);
        adj[edges[i][1]].push_back(edges[i][0]);
        degree[edges[i][0]]++;
        degree[edges[i][1]]++;
    }

    for(int i = 0; i < degree.size(); i++){
        if(degree[i] == 1) {
            q.push(i);
        }
    }

    while(remain > 2){
        int times = q.size();
        remain -= times;

        for(int i = 0; i < times; i++){
            int u = q.front();
            q.pop();
            degree[u]--;

            for(int v : adj[u]){
                degree[v]--;
                if(degree[v] == 1) {
                    q.push(v);
                }
            }
        }
    }

    while(!q.empty()){ // 把 queue 裡的資料推進去 result 中
        result.push_back(q.front());
        q.pop();
    }

    return result;
}
```

最後有一種 edge case，如果一開始的 Tree 只有一個 node，那他的 degree 就是 0，一開始就不會被推進去 queue 中，那我們的 result 就會吃不到，因此一開始的 Tree 如果 nodes 數量小於等於 2，就可以直接回傳答案了。

```cpp
if(n <= 2) {
    for(int i = 0; i < n; i++){
        result.push_back(i);
    }
    return result;
}
```

完整程式碼如下。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### Implementation

```cpp
vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
    vector<vector<int>>adj(n);
    vector<int>degree(n, 0);
    queue<int>q;
    vector<int>result;
    int remain = n;

    if(n <= 2) {
        for(int i = 0; i < n; i++){
            result.push_back(i);
        }
        return result;
    }

    for(int i = 0; i < edges.size(); i++){
        adj[edges[i][0]].push_back(edges[i][1]);
        adj[edges[i][1]].push_back(edges[i][0]);
        degree[edges[i][0]]++;
        degree[edges[i][1]]++;
    }

    for(int i = 0; i < degree.size(); i++){
        if(degree[i] == 1) {
            q.push(i);
        }
    }

    while(remain > 2){
        int times = q.size();
        remain -= times;

        for(int i = 0; i < times; i++){
            int u = q.front();
            q.pop();
            degree[u]--;

            for(int v : adj[u]){
                degree[v]--;
                if(degree[v] == 1) {
                    q.push(v);
                }
            }
        }
    }

    while(!q.empty()){
        result.push_back(q.front());
        q.pop();
    }

    return result;
}
```
