---
title: "[ Leetcode 3607 ] Power Grid Maintenance | 解題思路分享"
date: "2025-11-24"
author: James
tags: Union Find,Hash Table,Graph,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
id: e29e116c-6a20-442c-8c46-838862a60abd
---

給 `c` 個 power stations，給 connections[i][j] 紀錄哪些 power stations 彼此有連接，給 query[i][j]，當 query[i][0] == 1，表示要檢查 query[i][1] 這個 station，如果這個 station 是 online，就把這個 station 推進去 result，如果這個 station 是 offline，就把連接的 station 中最小的 online station 推進去 result

當 query[i][0] == 2，就把 query[i][1] 轉成 offline

題目連結 🔗：[https://leetcode.com/problems/power-grid-maintenance/](https://leetcode.com/problems/power-grid-maintenance/)

## 問題分析

要解這題我們必須克服幾個問題

> 1. 快速判斷 power stations 是否相連<br>
> 2. 快速判斷目前有相連的最小的 online power stations 是哪個

第一個問題很簡單，用 Union Find 就可以解決，所以關鍵在於第二個問題要怎麼解決

首先我們需要一個 Hash Table `online` 來紀錄每個 power stations 現在的狀態 online / offline，注意這題 power stations 變成 offline 之後就沒有辦法轉變回 online 了，我們需要一個 data structure 可以來讓我們紀錄目前每一個 Disjoint Set 最小的 online power station 是哪個，當有 power station 被轉成 offline 之後，還要可以更新

所以我們在建立完 Union Find 後，可以利用每一個 Disjoint Set 的 root 來當作每一個 set 的 id，利用 2D vector 來紀錄每一個 Disjoint Set 由小到大的順序，再來建立一個 pointer 來紀錄目前最小的 online power station 的位置，當有 power station 被轉成 offline，就移動 pointer 來更新就好，這樣每一次查找最小的 online power stations 就只需要 O(1)，直接來看程式碼

## 解題思路 - Union Find

首先先建立一個 Union Find Class

```cpp
class UnionFind {
private:
    vector<int>parent;
    vector<int>rank;

public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n);
        for(int i = 0; i < n; i++){
            parent[i] = i;
            rank[i] = 0;
        }
    }

    int find(int x){
        if(parent[x] == x) return x;
        parent[x] = find(parent[x]);
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

我們先把 Union Find 的 Graph 建立好

```cpp
UnionFind uf(c + 1);
vector<bool>online(c + 1, true);
vector<vector<int>>order(c + 1);
vector<int>currPtr(c + 1, 0);
vector<int>result;

for(auto &c : connections){
    uf.unite(c[0], c[1]);
}
```

再來 iterate 每一個 power station，我們要紀錄每一顆以 root 當作 id 的 disjoint set 底下按照大小順序排好的 power station 長什麼樣子

```cpp
for(int i = 1; i <= c; i++){
    order[uf.find(i)].push_back(i);
}
```

我們按照順序 iterate 每一個 power station，`uf.find(i)` 可以找到 root，最後再把 power station 推到 root 底下，這樣就可以成功紀錄順序

再來看每一個 query，currPtr[i] 紀錄的是以 i 為 root 的 disjoint set 目前最小的 online power station 在 `order` 裡面的 index，所以當有 power station 被切換成 offline，就要更新 currPtr[i]

```cpp
for(auto &q : queries){
    int action = q[0];
    int station = q[1];
    int root = uf.find(station);

    if(action == 2) {
        online[station] = false;
        while(currPtr[root] < order[root].size() && !online[order[root][currPtr[root]]]) currPtr[root]++;
    }
}
```

當 action == 1，表示要更新 `result`，那就直接查表即可，最後再把 result 送出就好

```cpp
for(auto &q : queries){
    int action = q[0];
    int station = q[1];
    int root = uf.find(station);

    if(action == 1) {
        if(online[station]) result.push_back(station);
        else if(currPtr[root] >= order[root].size()) result.push_back(-1);
        else result.push_back(order[root][currPtr[root]]);
    } else {
        online[station] = false;
        while(currPtr[root] < order[root].size() && !online[order[root][currPtr[root]]]) currPtr[root]++;
    }
}
```

**Time Complexity** - `O((station + connections.size() + query) * α(station))`，幾乎就是線性時間<br>
**Space Complexity** - `O(station + query)`

### Implementation

```cpp
class UnionFind {
private:
    vector<int>parent;
    vector<int>rank;

public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n);
        for(int i = 0; i < n; i++){
            parent[i] = i;
            rank[i] = 0;
        }
    }

    int find(int x){
        if(parent[x] == x) return x;
        parent[x] = find(parent[x]);
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
    vector<int> processQueries(int c, vector<vector<int>>& connections, vector<vector<int>>& queries) {
        UnionFind uf(c + 1);
        vector<bool>online(c + 1, true);
        vector<vector<int>>order(c + 1);
        vector<int>currPtr(c + 1, 0);
        vector<int>result;

        for(auto &c : connections){
            uf.unite(c[0], c[1]);
        }

        for(int i = 1; i <= c; i++){
            order[uf.find(i)].push_back(i);
        }

        for(auto &q : queries){
            int action = q[0];
            int station = q[1];
            int root = uf.find(station);

            if(action == 1) {
                if(online[station]) result.push_back(station);
                else if(currPtr[root] >= order[root].size()) result.push_back(-1);
                else result.push_back(order[root][currPtr[root]]);
            } else {
                online[station] = false;
                while(currPtr[root] < order[root].size() && !online[order[root][currPtr[root]]]) currPtr[root]++;
            }
        }

        return result;
    }
};
```
