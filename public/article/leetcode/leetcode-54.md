---
title: "[ Leetcode 54 ] Spiral Matrix | 解題思路分享"
date: "2025-03-30"
author: James
tags: Array,Matrix
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 2
id: 95bc5602-fe1d-4d8c-aefa-0a94208545f7
---

給一個 `m x n` 的 matrix，請按照 spiral order 返回 matrix 中的所有 element。

題目連結 🔗：[https://leetcode.com/problems/spiral-matrix/](https://leetcode.com/problems/spiral-matrix/)

## 問題分析

這乍聽之下沒有甚麼想法，所以就先簡化問題看一下規律，我們可以發現總共是四個方向一個循環，左上 -> 右上、右上 -> 右下、右下 -> 左下、左下 -> 左上，然後我們會發現如果一個循環過後，像是左下 -> 左上，那他左上角走過的那排就不會再走過了，就會縮進來，也就是說每經過一個循環，邊界就要縮進來一排。

## 解題思路

所以我們四個邊都各設一個邊界 `right`, `bottom`, `left`, `top`，每做完一個動作邊界就縮進來，最後碰到邊界不能繼續做的時候就是結束了。

**Time Complexity** - `O(n*m)`<br>
**Space Complexity** - `O(1)`

## Implementation

```cpp
vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int>result;
    int right = matrix[0].size()-1;
    int bottom = matrix.size()-1;
    int left = 0;
    int top = 0;

    while(true){
        if(left>right) break;
        for(int i=left; i<=right; i++) result.push_back(matrix[top][i]);
        top++;

        if(top>bottom) break;
        for(int i=top; i<=bottom; i++) result.push_back(matrix[i][right]);
        right--;

        if(left>right) break;
        for(int i=right; i>=left; i--) result.push_back(matrix[bottom][i]);
        bottom--;

        if(top>bottom) break;
        for(int i=bottom; i>=top; i--) result.push_back(matrix[i][left]);
        left++;
    }

    return result;
}
```