---
title: "[ Leetcode 389 ] Find the Difference | 解題思路分享"
date: "2025-11-20"
author: James
tags: String,Bit Manipulation,Google
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給兩個 string `s`, `t`，`t` 是 `s` random shuffle 後再加上一個字母的結果，找出那個字母

題目連結 🔗：[https://leetcode.com/problems/find-the-difference/](https://leetcode.com/problems/find-the-difference/)

### **問題分析**

這題當然可以用 Hash Table 做，但是用 Bit Manipulation 是最快也最省空間的，只要知道一條公式就可以了

> a ^ a = 0，而 a ^ 0 = a

**Time Complexity** - `O(1)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
char findTheDifference(string s, string t) {
    char x = 0;
    for (char c : s) x ^= c;
    for (char c : t) x ^= c;
    return x;
}
```