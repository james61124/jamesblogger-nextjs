---
title: "[ Leetcode 1466 ] Reorder Routes to Make All Paths Lead to the City Zero | 解題思路分享"
date: "2025-09-21"
author: James
tags: Graph,DFS,BFS,Google,Meta
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 3
---

給 n 個城市與 n - 1 條 edges，保證整張 graph 是聯通的，問最少需要 reverse 多少條 edges 才能讓所有 nodes 都可以到達 node 0

題目連結 🔗：[https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/](https://leetcode.com/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/)

### **問題分析**

這題最關鍵的訊息是「整個 graph 只有 n - 1 條 edges」，這代表整張圖是一個 tree，點到點只會有唯一一條路線，沒有 cycle 的存在

因此，基本上可以看成利用 DFS 從 node 0 出發，如果遇到「逆向」的 edge，表示這個 node 可以正常抵達 node 0，如果遇到「正向」的 node，表示這個 edge 需要 reverse 之後這個 node 才能正常抵達 node 0，至於為什麼可以直接翻轉呢？是因為整條 Graph 都沒有 cycle，所以表示不管是正向的 edge 還是逆向的 edge，這條路都是唯一一個可以到達 node 0 的方式，也就是說，從 node 0 出發，我們只要計算路上會遇到多少「正向」的 edge 就好。

### **解題思路 - DFS**

我們可以先幫 edges 做 label，所有「正向」的 edge 都標成 0，將他們反過來之後就會變成「逆向」的 edge，標成 1

```cpp
vector<vector<pair<int, int>>>adj(n);

for(auto& c : connections) {
    adj[c[0]].push_back({c[1], 1});
    adj[c[1]].push_back({c[0], 0});
}
```

再來從 node 0 開始 dfs，把路上會遇到的 edge 所有標籤的數字加起來就好，因為「正向」的 edge 都標成 0 所以沒差，「逆向」的 edge 每遇到一個就會加一

```cpp
void dfs(int x, vector<bool>& visit, vector<vector<pair<int, int>>>& adj, int &result) {
    if(visit[x]) return;
    visit[x] = true;

    for(auto &[neighbor, flag] : adj[x]) {
        if(visit[neighbor]) continue;
        result += flag;
        dfs(neighbor, visit, adj, result);
    }
}
```

合起來就會像下面這樣

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**

```cpp
void dfs(int x, vector<bool>& visit, vector<vector<pair<int, int>>>& adj, int &result) {
    if(visit[x]) return;
    visit[x] = true;

    for(auto &[neighbor, flag] : adj[x]) {
        if(visit[neighbor]) continue;
        result += flag;
        dfs(neighbor, visit, adj, result);
    }
}


int minReorder(int n, vector<vector<int>>& connections) {
    vector<vector<pair<int, int>>>adj(n);
    vector<bool>visit(n, false);
    int result = 0;

    for(auto& c : connections) {
        adj[c[0]].push_back({c[1], 1});
        adj[c[1]].push_back({c[0], 0});
    }

    dfs(0, visit, adj, result);
    return result;
}
```