---
title: "[ Leetcode 64 ] Minimum Path Sum | 解題思路分享"
date: "2025-03-23"
author: James
tags: Array,DP,Matrix
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
id: af8c40c0-8e50-41af-b232-a88934b9383a
---

給定一個 `m × n` 的 matrix `grid`，其中 grid[i][j] 代表該位置的 value。你只能向右或向下移動，從左上角 (0,0) 走到 右下角 (m-1, n-1)，求路徑上的數值總和的 min。

題目連結 🔗：[https://leetcode.com/problems/minimum-path-sum/](https://leetcode.com/problems/minimum-path-sum/)

## 解題思路 - DP (Matrix-based Dynamic Programming)

這題要問從左上走到左下的 minimum path sum，然後只能往右或是往下走，換句話說就是要到達一個 grid 只可能從上面來或是從左邊來，所以如果知道上面的 minimum path sum，知道左邊的 minimum path sum，兩個之中比較小的再加上自己的 grid[i][j] 就是這格的 minimum path sum 了。

所以思路清晰，維護一個 2D array `dp` 來記錄每一個 grid 的 minimum path sum，而轉換式如下

```cpp
dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
```

**Time Complexity** - `O( m × n )`，因為 iterate 過 matrix<br>
**Space Complexity** - `O( m × n )`，因為開了一個 m x n 的 dp

### Implementation

```cpp
int minPathSum(vector<vector<int>>& grid) { 
    vector<vector<int>>dp(grid.size(), vector<int>(grid[0].size(), 0));
    dp[0][0] = grid[0][0];
    for(int i=1; i<grid.size(); i++) dp[i][0] = grid[i][0] + dp[i-1][0];
    for(int j=1; j<grid[0].size(); j++) dp[0][j] = grid[0][j] + dp[0][j-1];

    for(int i=0; i<grid.size(); i++){
        for(int j=0; j<grid[0].size(); j++){
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
        }
    }

    return dp[dp.size()-1][dp[0].size()-1];
}
```

## 空間優化

但是我們會發現我們從頭到尾只會用到 dp 的兩個 rows，所以可以把 2D `dp` 改寫成 1D `dp`。每一個 grid 都會跟他的左邊那格跟上面那格拿資訊，所以在更新這個 1D dp 的時候，假設現在換到 grid[i][j]，左邊那格一樣就跟 dp[j-1] 拿，上面那格的資訊就是現在這個 dp[j]，因為上一個 row 的資訊會保留在這，所以更新上去就可以了，轉換式在這：

```cpp
dp[j] = min(dp[j-1], dp[j]) + grid[i][j];
```

**Time Complexity** - `O( m × n )`，因為 iterate 過 matrix<br>
**Space Complexity** - `O( n )`，因為開了一個 n 的 dp

### Implementation

```cpp
int minPathSum(vector<vector<int>>& grid) {
    vector<int>dp(grid[0].size(), 0);
    dp[0] = grid[0][0];
    for(int j=1; j<grid[0].size(); j++) dp[j] = grid[0][j] + dp[j-1];

    for(int i=1; i<grid.size(); i++){
        for(int j=0; j<grid[0].size(); j++){
            if(j==0) dp[j] += grid[i][j];
            else dp[j] = min(dp[j-1], dp[j]) + grid[i][j];
        }
    }

    return dp[dp.size()-1];
}
```