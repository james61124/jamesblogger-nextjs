---
title: "[ Leetcode 417 ] Pacific Atlantic Water Flow | 解題思路分享"
date: "2025-05-14"
author: James
tags: Array,DFS,BFS,Matrix
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 2
id: e5e5cfbb-c896-4284-a332-aa8044747b4f
---

你有一個 `m x n` 的整數矩陣 `heights`，代表地圖上每個格子的高度。水可以從任一格流向**上下左右**相鄰且高度小於等於自己的格子。而地圖的左邊界與上邊界 是太平洋（Pacific），右邊界與下邊界是大西洋（Atlantic）。

任務是找出所有的格子 (i, j)，水可以從該格子流到太平洋（Pacific），也可以流到大西洋（Atlantic）。

題目連結 🔗：[https://leetcode.com/problems/pacific-atlantic-water-flow/](https://leetcode.com/problems/pacific-atlantic-water-flow/)

### **問題分析**

這題如果每一個 grid 都 dfs 看看是不是可以碰到 Pacific 跟 Atlantic，結果一定會 TLE，他實際上有更快的做法。

我們的目標只是找到可以流到邊邊的 flow，所以那些只會留在中間的 flow 我們根本不用理他，所以這題最正確的做法是反過來做，從邊邊出發往上爬，看看哪一些 grid 可以流到邊邊這些格子，而同時可以流到 Pacific 跟 Atlantic 的 grid 就是我們要的。

### **解題思路 - DFS**

這題知道解法之後實作應該就不是什麼問題了，建立兩個 2D array `Pacific` 跟 `Atlantic` 紀錄可以流到這兩個海洋的 grid，再來從四條邊出發，一路往上爬更新可以碰到的 grid，只要走得到的就標成 `true`。

```cpp
void dfs(vector<vector<int>>& heights, vector<vector<bool>>& visit, int i, int j){
    int m = heights.size(), n = heights[0].size();

    if(visit[i][j]) return;
    visit[i][j] = true;

    if(i-1 >= 0 && heights[i][j] <= heights[i-1][j]) dfs(heights, visit, i-1, j);
    if(i+1 < m && heights[i][j] <= heights[i+1][j]) dfs(heights, visit, i+1, j);
    if(j-1 >= 0 && heights[i][j] <= heights[i][j-1]) dfs(heights, visit, i, j-1);
    if(j+1 < n && heights[i][j] <= heights[i][j+1]) dfs(heights, visit, i, j+1);
}

vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    int m = heights.size(), n = heights[0].size();

    vector<vector<bool>>Pacific(m, vector<bool>(n, false));
    vector<vector<bool>>Atlantic(m, vector<bool>(n, false));
    vector<vector<int>>result;

    for(int i = 0; i < m; i++) dfs(heights, Pacific, i, 0);
    for(int j = 0; j < n; j++) dfs(heights, Pacific, 0, j);
    for(int i = 0; i < m; i++) dfs(heights, Atlantic, i, n-1);
    for(int j = 0; j < n; j++) dfs(heights, Atlantic, m-1, j);
}
```

最後判斷一個 grid 在兩邊同時都是 `true` 就是我們要的

```cpp
for(int i = 0; i < m; i++){
    for(int j = 0; j < n; j++){
        if(Pacific[i][j] && Atlantic[i][j]) result.push_back({i, j});
    }
}
```

**Time Complexity** - `O(m*n)`<br>
**Space Complexity** - `O(m*n)`

#### **Implementation**

```cpp
void dfs(vector<vector<int>>& heights, vector<vector<bool>>& visit, int i, int j){
    int m = heights.size(), n = heights[0].size();

    if(visit[i][j]) return;
    visit[i][j] = true;

    if(i-1 >= 0 && heights[i][j] <= heights[i-1][j]) dfs(heights, visit, i-1, j);
    if(i+1 < m && heights[i][j] <= heights[i+1][j]) dfs(heights, visit, i+1, j);
    if(j-1 >= 0 && heights[i][j] <= heights[i][j-1]) dfs(heights, visit, i, j-1);
    if(j+1 < n && heights[i][j] <= heights[i][j+1]) dfs(heights, visit, i, j+1);
}

vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    int m = heights.size(), n = heights[0].size();

    vector<vector<bool>>Pacific(m, vector<bool>(n, false));
    vector<vector<bool>>Atlantic(m, vector<bool>(n, false));
    vector<vector<int>>result;

    for(int i = 0; i < m; i++) dfs(heights, Pacific, i, 0);
    for(int j = 0; j < n; j++) dfs(heights, Pacific, 0, j);
    for(int i = 0; i < m; i++) dfs(heights, Atlantic, i, n-1);
    for(int j = 0; j < n; j++) dfs(heights, Atlantic, m-1, j);

    for(int i = 0; i < m; i++){
        for(int j = 0; j < n; j++){
            if(Pacific[i][j] && Atlantic[i][j]) result.push_back({i, j});
        }
    }

    return result;
}
```
