---
title: "[ Leetcode 841 ] Keys and Rooms | 解題思路分享"
date: "2025-01-29"
author: James
tags: Graph,DFS,BFS
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
---

有 n 個房間，編號從 0 到 n-1，其中 rooms[i] 包含一個 list，代表房間 i 中可以獲得的鑰匙，這些鑰匙可以用來打開其他房間。最開始，你在房間 0，且已經打開它。請判斷是否能夠訪問所有房間。

題目連結🔗：[https://leetcode.com/problems/keys-and-rooms/](https://leetcode.com/problems/keys-and-rooms/)

### **解法 - DFS**

其實就是 DFS 而已，因為它本質上是一個 Graph Traversal 問題。房間和它們的鑰匙形成了一個 Directed Graph，其中 rooms[i] 中的一把鑰匙表示從房間 i 到另一個房間的一個 edge。

### **Implementation**

```cpp

void DFS(vector<vector<int>>& arr, vector<bool>& visit, int v) {
    visit[v] = true;
    for( int neighbor : arr[v] ) {
        if(!visit[neighbor]) {
            DFS(arr, visit, neighbor);
        }
    }
}

bool canVisitAllRooms(vector<vector<int>>& rooms) {
    vector<bool>visit(rooms.size(), false);
    DFS(rooms, visit, 0);
    for( bool element: visit ) {
        if( !element ) return false;
    }
    return true;
}

```