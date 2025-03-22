---
title: "[ Leetcode 802 ] Find Eventual Safe States | 解題思路分享"
date: 2025-03-10
draft: false
author: "James"
tags:
  - BFS
  - DFS
  - Graph
  - Topological Sort
  - Leetcode
image: /images/program/Leetcode.jpeg
description: ""
toc: 
categories:
  - Algorithm
---

你需要修 numCourses 門課，這些課程從 0 到 numCourses - 1 編號。某些課程有先修課，用一個 prerequisites array 來表示，prerequisites[i] = [a, b]，意思是：

- 想修課 a，必須先修課 b（b → a）。

題目要求返回一個可行的修課順序，讓你可以完成所有課程。如果無法完成所有課程（ Graph 中存在 Cycle ），則返回 empty array []。

題目連結🔗：[https://leetcode.com/problems/course-schedule-ii/](https://leetcode.com/problems/course-schedule-ii/)

### **問題分析**

題目需要找到所有的 safe node，而 safe node 因為不管怎麼走都一定會走到 terminal node，也就是說 safe node 一定不會在 cycle 上，換句話說這題就是找到所有不在 cycle 上的 node，而跟 Graph 的 cycle 扯到關係所以第一個想到的就是 Topological Sort。

##### **解題思路 - Topological Sort**

這題思路要轉一下，我們的目標是找到所有 out-degree 不會經過 cycle 的 node，如果做一般的 Topological Sort，因為從一個 in-degree=0 的 node 找到一條 order 我們只能確定這個 node 可以到達 terminal node，但不能確定他一定不會到達 cycle。

**Time Complexity** - O( V + E )，因為用 BFS traverse 過整個 Graph

**Space Complexity** - O( V + E )，建了一個 Adjacency List

##### **Implementation**

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

##### **Implementation**

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