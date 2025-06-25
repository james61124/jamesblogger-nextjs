---
title: "[ Leetcode 207 ] Course Schedule | 解題思路分享"
date: "2025-06-25"
author: James
tags: Graph,DFS,BFS,Topological Sort
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

總共要上 `numCourses` 門課（編號為 0 ~ numCourses - 1），有一些課程有先修要求，若 prerequisites[i] = [a, b]，代表要先修課程 b 才能修課程 a，請判斷是否有可能完成所有課程？

題目連結 🔗：[https://leetcode.com/problems/course-schedule/](https://leetcode.com/problems/course-schedule/)

### **問題分析**

這題應該是 Topological Sort 最經典的題目，各種課程有 dependency 的關係，可以畫出一個 dependency graph，要問說這個 graph 能不能產出一個 valid 的修課順序，也就是問說這個 dependency graph 裡面有沒有 cycle，那用 Topological Sort 就可以判斷一個 Graph 有沒有 cycle 了。

細節可以參考下面這篇文章。

[[ Algorithm ] Topological Sort | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/topological-sort)

### **解題思路 - Topological Sort**

所以這題思路很簡單，先把 `prerequisites` 轉成 adjacency list，做完 Topological Sort 之後判斷 Graph 中有沒有 cycle 即可。

一步一步來，先把 `prerequisites` 轉成 adjacency list。

```cpp
vector<vector<int>>adj(numCourses);
for(int i = 0; i < prerequisites.size(); i++){
    int prev = prerequisites[i][1];
    int next = prerequisites[i][0];
    adj[prev].push_back(next);
}
```

再來直接對這個 adjacency list 做 topological sort，細節就不贅述了，都在上面那篇文章中。

```cpp
void topologicalSort(vector<vector<int>>& adj, vector<int>& order) {
    queue<int>q;
    vector<int>in_degree(adj.size(), 0);

    for(int i = 0; i < adj.size(); i++){
        for(int j = 0; j < adj[i].size(); j++){
            in_degree[adj[i][j]]++;
        }
    }

    for(int i = 0; i < in_degree.size(); i++){
        if(in_degree[i] == 0) q.push(i);
    }

    while(!q.empty()){
        int node = q.front(); q.pop();
        order.push_back(node);
        for(int neighbor : adj[node]) {
            in_degree[neighbor]--;
            if(in_degree[neighbor] == 0) q.push(neighbor);
        }
    }
}
```

那因為是用 BFS 寫的，所以如果 `order` 的 size 不對表示出現 cycle，那就要回傳 `false`，反之要回傳 `true`。

```cpp
bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>>adj(numCourses);
    vector<int>order;

    for(int i = 0; i < prerequisites.size(); i++){
        int prev = prerequisites[i][1];
        int next = prerequisites[i][0];
        adj[prev].push_back(next);
    }

    topologicalSort(adj, order);

    return (order.size() == numCourses);
}
```

**Time Complexity** - `O(V + E)`<br>
**Space Complexity** - `O(V + E)`

### **Implementation**
```cpp
void topologicalSort(vector<vector<int>>& adj, vector<int>& order) {
    queue<int>q;
    vector<int>in_degree(adj.size(), 0);

    for(int i = 0; i < adj.size(); i++){
        for(int j = 0; j < adj[i].size(); j++){
            in_degree[adj[i][j]]++;
        }
    }

    for(int i = 0; i < in_degree.size(); i++){
        if(in_degree[i] == 0) q.push(i);
    }

    while(!q.empty()){
        int node = q.front(); q.pop();
        order.push_back(node);
        for(int neighbor : adj[node]) {
            in_degree[neighbor]--;
            if(in_degree[neighbor] == 0) q.push(neighbor);
        }
    }
}

bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>>adj(numCourses);
    vector<int>order;

    for(int i = 0; i < prerequisites.size(); i++){
        int prev = prerequisites[i][1];
        int next = prerequisites[i][0];
        adj[prev].push_back(next);
    }

    topologicalSort(adj, order);

    return (order.size() == numCourses);
}
```