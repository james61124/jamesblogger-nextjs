---
title: "[ Leetcode 684 ] Redundant Connection | 解題思路分享"
date: "2025-07-07"
author: James
tags: Graph,Union Find,Minimum Spanning Tree,Kruskal’s Algorithm
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: ecbe10d0-a911-45c0-852c-3e6373027149
---

原本有一個 Tree，其中裡面多加了一個 edge 就產生了 cycle，找出那個 edge。

題目連結 🔗：[https://leetcode.com/problems/redundant-connection/](https://leetcode.com/problems/redundant-connection/)

### **問題分析**

這題要找到會產生 cycle 的一條 edge，這其實就是 Minimum Spanning Tree 中 Kruskal’s Algorithm 的變形，Kruskal's Algorithm 會先將每條 edge 進行 sorting，由最小 cost 的 edge 開始，逐一加進去 Graph 中，如果發現加入的 edge 會形成 cycle 就丟棄這個 edge，這可以直接運用在這題。

我們一樣將 edge 逐條加入 Graph 中，只要發現 cycle 就直接 return 這個 edge 就行了，而在 Kruskal's Algorithm 中是利用 Union Find 來判斷有沒有出現 cycle。

### **解題思路 - Union Find**

簡單來說每一條 edge 上的 node 都會被 unite 起來，而當發現有一條 edge 的 node 在同一個 disjoint set 底下，就代表加入這條 edge 會形成 cycle。

首先我們來看一下 Union Find 要怎麼實作，直接看這篇文章就可以了：

[[ Algorithm ] Union Find | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/union-find)

我們將最重要的兩個 function 先寫出來

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
```

再來就是將每一條 edge unite 起來，如果發現兩個 edge 身在同一個 disjoint set 裡面，就表示遇到 cycle 了。

```cpp
vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    int n = edges.size();
    UnionFind uf(n + 1);
    for(vector<int>edge : edges){
        if(uf.find(edge[0]) == uf.find(edge[1])) return edge;
        uf.unite(edge[0], edge[1]);
    }

    return {};
}
```

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
