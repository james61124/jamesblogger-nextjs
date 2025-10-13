---
title: "[ Leetcode 133 ] Clone Graph | 解題思路分享"
date: "2025-03-08"
author: James
tags: DFS,BFS,Graph,Hash Table
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
---

複製一個 Graph，但不能直接 return 這個 Graph 的 pointer 回去。

題目連結🔗：[https://leetcode.com/problems/clone-graph/](https://leetcode.com/problems/clone-graph/)

### **解題思路 - DFS**

這題其實就是 DFS 整個 Graph 把他們都 clone 出來就沒事了，所以最大的問題就是 DFS 時這些被 clone 出來的 node 要放哪裡。

##### **visit 的設計**

如果我們的 visit 跟以往一樣只是一個 `vector<bool>`，在遇到 visit 過的 node 我們只會知道他已經 visited，但是不會知道他被 clone 到哪裡去，所以應該要用 unordered_map 來存這個對應關係，這樣只要這個 Node* 出現在 unordered_map 中，就表示他已經被 visit 過了，也可以直接找到 clone 出來的 node 在哪。

**Time Complexity** - `O(V+E)`，V 是 node 數量，E 是 edge 數量。<br>
**Space Complexity** - `O(V)`，開了一個 unordered_map。

#### **Implementation**

```cpp
Node* DFS(Node* node, unordered_map<Node*, Node*>&visit){
    if(!node) return nullptr;
    if(visit[node]) return visit[node];

    vector<Node*>cloneNeighbors;
    Node* cloneNode = new Node(node->val, cloneNeighbors);
    visit[node] = cloneNode;

    for(Node* next : node->neighbors) {
        cloneNode->neighbors.push_back(DFS(next, visit));
    }

    return cloneNode;
}

Node* cloneGraph(Node* node) {
    unordered_map<Node*, Node*>visit;
    return DFS(node, visit);
}
```

