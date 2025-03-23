---
title: "[ Leetcode 221 ] Maximal Square | 解題思路分享"
date: "2025-03-23"
author: James
tags: Array,DP,Matrix
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給定一個 `m × n` 的 matrix，其中：

- '1' 表示該位置可以成為正方形的一部分
- '0' 表示該位置不能形成正方形

找出 matrix 中只包含 '1' 的最大正方形，並返回其面積（即邊長的平方）。

題目連結 🔗：[https://leetcode.com/problems/maximal-square/](https://leetcode.com/problems/maximal-square/)

### **解題思路 - DP (Matrix-based Dynamic Programming)**

這題最關鍵的就在於 grid 本身跟其他 grid 的關係是甚麼，我們可以簡化問題來想，如果一個 grid 可以組成邊長是 2 的正方形，除了自己是 '1'，表示他的左邊、左上、上面的 grid 都是 '1'，如果一個 grid 可以組成邊長是 3 的正方形，那他的左邊、左上、上面的 grid 都要有能力可以組成邊長是 2 的正方形，所以 dp 轉換式就很明顯了。

我們需要維護一個 2D array `dp` 代表「以 matrix[i][j] 為右下角的最大正方形邊長」，轉換式如下：

```cpp
dp[i][j] = min(dp[i-1][j-1], min(dp[i-1][j], dp[i][j-1])) + 1;
```

**Time Complexity** - `O( m × n )`，因為 iterate 過 matrix<br>
**Space Complexity** - `O( m × n )`，因為開了一個 m x n 的 dp

#### **Implementation**

```cpp
int maximalSquare(vector<vector<char>>& matrix) {
    vector<vector<int>>dp(matrix.size(), vector<int>(matrix[0].size(), 0));
    int maxSideLength = 0;

    for(int i=0; i<matrix.size(); i++){
        for(int j=0; j<matrix[0].size(); j++){
            if(matrix[i][j] == '1') {
                if(!i || !j) dp[i][j] = 1;
                else dp[i][j] = min(dp[i-1][j-1], min(dp[i-1][j], dp[i][j-1])) + 1;
                maxSideLength = max(maxSideLength, dp[i][j]);
            }
        }
    }

    return maxSideLength*maxSideLength;
}
```