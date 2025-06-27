---
title: "[ Leetcode 287 ] Find the Duplicate Number | 解題思路分享"
date: "2025-06-26"
author: James
tags: Array,Two Pointers,Floyd's Cycle Detection
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/find-the-duplicate-number/](https://leetcode.com/problems/find-the-duplicate-number/)

### **問題分析**

最簡單的方式肯定是 Hash Table，但這題的空間複雜度實際上可以用 O(1) 就解決。

這題的核心條件是 nums[i] 的範圍落在 [1, n-1]，也就是這些 value 的範圍不會超過 index 的範圍，因此如果我們將 nums[i] 指向下一個 index，也就是一直執行 `i = nums[i]`，我們就可以得到一個類似 linked list 的圖

```
nums[i] -> nums[nums[i]] -> nums[nums[nums[i]]]
```

如果這個過程中 nums[i] 有重複的數字，表示這條 linked list 上面會有 cycle，linked list 上面 detect cycle，就是直接往 Floyd's Cycle Detection 想了。

### **解題思路 - Floyd's Cycle Detection**

不過這題會遇到另一個問題，他想要找的是重複的數字，也就是 cycle 開始的那個 node，這樣要怎麼做呢？我們來畫一張圖

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