---
title: "[ Leetcode 235 ] Lowest Common Ancestor of a Binary Search Tree | 解題思路分享"
date: "2025-04-23"
author: James
tags: Tree,DFS,Binary Tree
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

### **問題分析**

題目有說是 Binary Tree，所以這題的規律很明顯，如果 `p`, `q` 都在左邊，那表示要繼續往左邊的 node dfs，如果 `p`, `q` 都在右邊，就要繼續往右邊的 node dfs，

### **解題思路 - Bit Manipulation**



**Time Complexity** - `O(32) = O(1)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
uint32_t reverseBits(uint32_t n) {
    uint32_t result = 0;
    for(int i = 0; i < 32; ++i) {
        result = (result << 1) | (n & 1);
        n >>= 1;                    
    }
    return result;
}
```
