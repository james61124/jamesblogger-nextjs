---
title: "[ Leetcode 136 ] Single Number | 解題思路分享"
date: "2025-06-18"
author: James
tags: Array,Bit Manipulation
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個 array `nums`，裡面只有一個數字出現一次，其他數字都有出現兩次，找出只出現一次的數字。

題目連結 🔗：[https://leetcode.com/problems/single-number/](https://leetcode.com/problems/single-number/)

### **問題分析**

這題是 Bit Manipulation，基本上只要知道一個技巧就解完了

> a ^ a = 0<br>
> a ^ 0 = a

### **解題思路 - Bit Manipulation**

所以就是全部的數字都做 XOR，最後的答案就是 single number。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int singleNumber(vector<int>& nums) {
    int result = 0;
    for(int num : nums){
        result ^= num;
    }
    return result;
}
```
