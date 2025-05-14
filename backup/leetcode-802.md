---
title: "[ Leetcode 802 ] Find Eventual Safe States | 解題思路分享"
date: "2025-03-10"
author: James
tags: Graph,DFS,BFS,Topological Sort
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結🔗：[https://leetcode.com/problems/find-eventual-safe-states/](https://leetcode.com/problems/find-eventual-safe-states/)

### **問題分析**

題目需要找到所有的 safe node，而 safe node 因為不管怎麼走都一定會走到 terminal node，也就是說 safe node 一定不會在 cycle 上，換句話說這題就是找到所有不在 cycle 上的 node，而跟 Graph 的 cycle 扯到關係所以第一個想到的就是 Topological Sort。

##### **解題思路 - Topological Sort**

這題思路要轉一下，我們的目標是找到所有 out-degree 不會經過 cycle 的 node，如果做一般的 Topological Sort，從一個 `in-degree=0` 的 node 找到一條 order 我們只能確定這個 node 可以到達 terminal node，但不能確定他一定不會到達 cycle，所以這題我們要做反向的 Topological Sort。

反向的 Topological Sort 意味著我們會利用 out-degree 計算，起始位置是 terminal node，也就是 `out-degree = 0` 的 node，而出現在 order 裡的一定是 out-degree 最後會變成 0 的 node，也就代表這個 node 不管怎麼走都會走到 terminal node。

**Time Complexity** - `O(V+E)`，因為用 BFS traverse 過整個 Graph<br>
**Space Complexity** - `O(V+E)`，建了一個 Adjacency List

#### **Implementation**

```cpp
vector<int> eventualSafeNodes(vector<vector<int>>& graph) {
    vector<int>in_degree(graph.size());
    vector<vector<int>>adj(graph.size());
    queue<int>q;
    vector<int>result;

    for(int i=0; i<graph.size(); i++){
        for(int j=0; j<graph[i].size(); j++){
            adj[graph[i][j]].push_back(i);
        }
        in_degree[i] = graph[i].size();
        if(graph[i].size()==0) q.push(i);
    }

    while(!q.empty()){
        int cur = q.front();
        q.pop();
        result.push_back(cur);
        
        for(int i=0; i<adj[cur].size(); i++){
            in_degree[adj[cur][i]]--;
            if(in_degree[adj[cur][i]]==0){
                q.push(adj[cur][i]);
            }
        }
    }

    sort(result.begin(), result.end());
    return result;
}
```

### **時間優化 - Topological Sort (DFS)**



#### **Implementation**

```cpp
enum class State : char {
    UNVISITED,
    VISITED,
    SAFE,
};

bool dfs(vector<vector<int>>& graph, vector<State>& visit, int v){
    if(visit[v]==State::SAFE) return true;
    if(visit[v]==State::VISITED) return false;
    visit[v] = State::VISITED;

    for(int i=0; i<graph[v].size(); i++){
        if(!dfs(graph, visit, graph[v][i])){
            return false;
        }
    }

    visit[v] = State::SAFE;
    return true;
}

vector<int> eventualSafeNodes(vector<vector<int>>& graph) {

    vector<int>result;
    vector<State>visit(graph.size(), State::UNVISITED);

    for(int i=0; i<graph.size(); i++){
        if(dfs(graph, visit, i)){
            result.push_back(i);
        }
    }

    return result;
}
```