---
title: "[ Leetcode 695 ] Max Area of Island | 解題思路分享"
date: "2025-07-07"
author: James
tags: Matrix,DFS
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
---

給一個 matrix，其中 `1` 代表陸地，`0` 代表水，找出最大的 island area。

題目連結 🔗：[https://leetcode.com/problems/max-area-of-island/](https://leetcode.com/problems/max-area-of-island/)

### **問題分析**

這題沒有什麼特殊的技巧，就是 DFS。對每一個 grid 做 DFS，遇到水就直接跳過，如果遇到 island 就往四個方向進行 DFS，把每一個方向回傳回來的 DFS 深度加起來就是這個 island 的 area。

### **解題思路 - DFS**

這邊注意幾個小地方就好，其中走過的 grid 不會再被走一次，但我們不需要重新定義一個 2D vector `visit` 來儲存，可以直接改 grid 上的資訊即可。

```cpp
int dfs(vector<vector<int>>& grid, int x, int y){
    int n = grid.size(), m = grid[0].size();
    if(x < 0 || x >= n || y < 0 || y >= m || grid[x][y] == 0) return 0;

    int area = 1;
    grid[x][y] = 0;

    area += dfs(grid, x - 1, y);
    area += dfs(grid, x + 1, y);
    area += dfs(grid, x, y + 1);
    area += dfs(grid, x, y - 1);

    return area;
}
```

最後找出最大的 area 就好

```cpp
int maxAreaOfIsland(vector<vector<int>>& grid) {
    int n = grid.size(), m = grid[0].size();
    int maxArea = 0;
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            maxArea = max(maxArea, dfs(grid, i, j));
        }
    }

    return maxArea;
}
```

**Time Complexity** - `O(m * n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int dfs(vector<vector<int>>& grid, int x, int y){
    int n = grid.size(), m = grid[0].size();
    if(x < 0 || x >= n || y < 0 || y >= m || grid[x][y] == 0) return 0;

    int area = 1;
    grid[x][y] = 0;

    area += dfs(grid, x - 1, y);
    area += dfs(grid, x + 1, y);
    area += dfs(grid, x, y + 1);
    area += dfs(grid, x, y - 1);

    return area;
}

int maxAreaOfIsland(vector<vector<int>>& grid) {
    int n = grid.size(), m = grid[0].size();
    int maxArea = 0;
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            maxArea = max(maxArea, dfs(grid, i, j));
        }
    }

    return maxArea;
}
```
