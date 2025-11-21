---
title: "[ Leetcode 3370 ] Smallest Number With All Set Bits | 解題思路分享"
date: "2025-11-20"
author: James
tags: Math,Google
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 n，求大於等於 n 最小的數且 binary 每一個 bit 都是 1 的數

題目連結 🔗：[https://leetcode.com/problems/smallest-number-with-all-set-bits/](https://leetcode.com/problems/smallest-number-with-all-set-bits/)

### **問題分析**

這題我直覺是用 Binary Search 解，結果看了一下 n 的限制只到 1000，那一個一個算可能還比較快，最多就 10 次而已

**Time Complexity** - `O(1)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int smallestNumber(int n) {
    int curr = 1;
    while(n > curr - 1) curr *= 2;
    return curr - 1;
}
```
