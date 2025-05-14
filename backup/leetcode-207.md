---
title: "[ Leetcode 207 ] Course Schedule | 解題思路分享"
date: "2025-03-06"
author: James
tags: Graph,DFS,BFS,Topological Sort
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/course-schedule/](https://leetcode.com/problems/course-schedule/)

### **問題分析**

關鍵在於我們要怎麼找到下一個大於自己的 element，如果重新跑一次迴圈肯定太費時。

### **解題思路 - Monotonic Stack**



**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**
```cpp
bool dfs(vector<vector<int>>& adj, vector<bool>&visited, vector<bool>&visited_same_path, int node){
    if(visited[node]) return true;
    visited_same_path[node] = true;
    visited[node] = true;
    for(int i=0;i<adj[node].size();i++){
        if (visited_same_path[adj[node][i]]==false){
            if(!dfs(adj,visited,visited_same_path,adj[node][i])){
                return false;
            }
        }else{
            return false;
        }
    }
    visited_same_path[node] = false;          
    return true;
}

bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<bool> visited(numCourses, false);
    vector<vector<int>>adj(numCourses+1);
    for(int i=0;i<prerequisites.size();i++){
        adj[prerequisites[i][0]].push_back(prerequisites[i][1]);
    }
    
    for(int i=0;i<adj.size();i++){
        vector<bool> visited_same_path(numCourses, false);
        if(visited[i]==false){
            bool res = dfs(adj, visited, visited_same_path, i);
            if(res==false){
                return false;
            }
        }
        
    }
    return true;
}
```