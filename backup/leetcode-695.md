---
title: "[ Leetcode 695 ] Max Area of Island | 解題思路分享"
date: "2025-07-07"
author: James
tags: Matrix,DFS
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/max-area-of-island/](https://leetcode.com/problems/max-area-of-island/)

### **問題分析**

這題沒有什麼特殊的技巧，就是 DFS。對每一個 grid 做 DFS，遇到水就直接跳過，如果遇到 island 就往下 DFS，把每一個方向回傳回來的 DFS 深度加起來就是

### **解題思路 - Union Find**



**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
class UnionFind {
private:
    vector<int>parent;
    vector<int>rank;
public:
    UnionFind(int n) {
        parent.resize(n, 0);
        rank.resize(n, 0);
        for(int i = 0; i < n; i++){
            parent[i] = i;
        }
    }

    int find(int x){
        if(parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    void unite(int x, int y){
        int rootX = find(x);
        int rootY = find(y);
        if(rank[rootX] > rank[rootY]) parent[rootY] = rootX;
        else if(rank[rootY] > rank[rootX]) parent[rootX] = rootY;
        else {
            parent[rootX] = rootY;
            rank[rootY]++;
        }
    }
};

class Solution {
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n = edges.size();
        UnionFind uf(n + 1);
        for(vector<int>edge : edges){
            if(uf.find(edge[0]) == uf.find(edge[1])) return edge;
            uf.unite(edge[0], edge[1]);
        }

        return {};
    }
};
```
