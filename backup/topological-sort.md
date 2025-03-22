---
title: "Topological Sort | 解題思路分享"
date: 2025-03-10
draft: false
author: "James"
tags:
  - DFS
  - BFS
  - Topological Sort
  - Algorithm
image: /images/program/Leetcode.jpeg
description: ""
toc: 
categories:
  - Algorithm
---

Topological Sort 是一種用在 Directed Acyclic Graph 的 Sorting 方法，他可以找到一條 Order 滿足所有 dependency，例如說 u->v，那在那條 Order 中 u 就一定會出現在 v 前面。

值得注意的是 Topological Sort 只能用在沒有 cycle 的 Graph 中，因為如果遇到了 cycle，就沒有辦法產生合理的順序來安排這些 node，而 Topological Sort 有兩種 implement 的方法，兩種方法遇到 cycle 產生的問題會不太一樣，下面會進行詳細的討論。

### **BFS( Kahn’s Algorithm )**

1. 先計算每一個 node 的 in-degree，in-degree 的意思就是指向自己的 edge 的數量
2. 把 in-degree 為 0 的 node 都先 push 進去 queue 中，因為這些都是可以當成 order 的第一位的 node
3. 再來從 queue 中一個一個把 node pop 出來放到 order 中，然後把這個 node 的 neighbor push 進去 queue 中，只是 push 進去前要先多做一件事情，要把這個 neighbor 的 in-degree 先減一，表示他跟現在這個 node 的 edge 已經被看過了，如果 in-degree 變成 0 了才可以 push 進去 queue 中。
4. 最後 order 的順序就是 Topological Sort 的結果。

##### **遇到 cycle**

BFS 的解法是用維護 in-degree 的方式做的，所以如果遇到 cycle 的話表示 order 裡面不會包含所有的 node，所以最後判斷 order.size() 是不是跟 adj.size() 一樣就知道有沒有 cycle 了。

##### **Template**

```cpp
vector<int> topologicalSort(int n, vector<vector<int>>& adj) {
    vector<int> in_degree(n, 0);
    vector<int> order;

    for(int i=0; i<adj.size(); i++){
        for(int j=0; j<adj[0].size(); j++){
            in_degree[adj[i][j]]++;
        }
    }

    queue<int> q;
    for (int i = 0; i < n; ++i) {
        if (in_degree[i] == 0) {
            q.push(i);
        }
    }

    while (!q.empty()) {
        int node = q.front();
        q.pop();
        order.push_back(node);

        for (int next : adj[node]) {
            if (--in_degree[next] == 0) {
                q.push(next);
            }
        }
    }

    return (order.size() == n) ? order : vector<int>();
}
```

### **DFS + Stack**

1. 對每一個 node 都做 DFS，DFS 中看完所有 neighbors 的 node 就可以 push 進去 stack 中，所以第一個被 push 進去的就會是 terminal node，也就是最後 order 中的最後一個。
2. 最後把 stack 的結果 pop 進去 order 中，就是最後答案。

##### **遇到 cycle**

這個解法如果遇到 cycle 會輸出一個錯誤的 order，但是光從這個 order 是沒有辦法分辨有沒有 cycle 的，所以我們需要幫 node 加上 status，如果 DFS 過程中遇到 VISITING 的 node，也就是還沒有被加進去 stack 中，但是卻已經被 visit 過了，那就是遇到 cycle 了

##### **Template**

```cpp
void dfs(int v, vector<vector<int>>& adj, vector<bool>& visit, stack<int>& st) {
    visit[v] = true;

    for (int neighbor : adj[v]) {
        if (!visited[neighbor]) {
            dfs(neighbor, adj, visit, st);
        }
    }

    st.push(v);
}

vector<int> topologicalSort(int n, vector<vector<int>>& adj) {
    vector<bool> visit(n, false);
    stack<int> st;
    vector<int> order;

    for (int i = 0; i < n; i++) {
        if (!visit[i]) {
            dfs(i, adj, visit, st);
        }
    }

    while (!st.empty()) {
        order.push_back(st.top());
        st.pop();
    }

    return order;
}
```