---
title: "[ Leetcode 48 ] Rotate Image | 解題思路分享"
date: "2025-03-28"
author: James
tags: Array,Math,Matrix
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 3
readTime: 3
id: e65b3fb1-8c8e-405e-b9c4-85e61a94c222
---

給一個 Matrix，return 他順時針轉 90 度的結果。

題目連結 🔗：[https://leetcode.com/problems/rotate-image/](https://leetcode.com/problems/rotate-image/)

## 問題分析

直接先來暴力分析一下問題，rotate 的話一定有他的規律，所以列出來找找看：

```
0,0 -> 0,2
0,1 -> 1,2
0,2 -> 2,2
1,0 -> 0,1
1,1 -> 1,1
1,2 -> 2,1
2,0 -> 0,0
2,1 -> 1,0
2,2 -> 2,0
```

從這個列表，我們可以找到轉換式 `(i, j) -> (j, n - i - 1)`，所以理論上就是 iterate 完所有 (i, j) 就解完這題了，但我們會發現他交換的模式其實是四個點一個循環，所以我們就用「四點交換法 (four-way swap)」來解。

## 解題思路 - Four-Way Swap

根據上面的轉換式，我們可以寫出四個點彼此的轉換式：

```cpp
matrix[i][j] = matrix[n - j - 1][i]; 
matrix[n - j - 1][i] = matrix[n - i - 1][n - j - 1];
matrix[n - i - 1][n - j - 1] = matrix[j][n - i - 1]; 
matrix[j][n - i - 1] = matrix[i][j];  
```

最後 iterate 走過所有 Four-Way Swap 的 starting point 就可以了，i 只需要 iterate 一半的 rows，因為 starting point 都是在四個點的左上角，而 j 最多就是到 `n - i - 1`，所以我們就可以直接寫出 Implementation。

**Time Complexity** - `O(n^2)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    for (int i = 0; i < n / 2; i++) { 
        for (int j = i; j < n - i - 1; j++) { 
            int temp = matrix[i][j];

            matrix[i][j] = matrix[n - j - 1][i];
            matrix[n - j - 1][i] = matrix[n - i - 1][n - j - 1];
            matrix[n - i - 1][n - j - 1] = matrix[j][n - i - 1];
            matrix[j][n - i - 1] = temp; 
        }
    }
}
```

## 解題思路 2 - Math

這題其實可以用數學解，如果要將 Matrix 順時針 rotate，先將 matrix transpose，然後再 reverse 每一個 row 就好了。

**Time Complexity** - `O(n^2)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    for(int i = 0; i < n; i++) {
        for(int j = i + 1; j < n; j++) {
            swap(matrix[i][j], matrix[j][i]);
        }
    }

    for(int i = 0; i < n; i++) {
        reverse(matrix[i].begin(), matrix[i].end());
    }
}
```
