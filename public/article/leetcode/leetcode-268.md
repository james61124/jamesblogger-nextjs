---
title: "[ Leetcode 268 ] Missing Number | 解題思路分享"
date: "2025-05-06"
author: James
tags: Array,Bit Manipulation
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個 size n 的 array，裡面會儲存 0 ~ n 其中的 ｎ 個數字，要找出缺少的那個數字。

題目連結 🔗：[https://leetcode.com/problems/missing-number/](https://leetcode.com/problems/missing-number/)

### **問題分析**

最簡單的做法就是開一個 hash set 紀錄哪一個數字被看過就行了，但這邊題目要求要 space complexity 只能 O(1) 而 time complexity 也只能 O(n)，所以就要想其他方法。

### **解題思路 - Bit Manipulation**

這裡要引進一個 XOR 很重要的觀念

> a ^ a = 0，而 a ^ 0 = a

所以用這題來看，如果我們用 (0 ^ 1 ^ ... ^ n) ^ (nums[0] ^ nums[1] ^ ... ^ nums[n-1])，最後的結果就會是缺少的那個數字，因此直接進實作

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int missingNumber(vector<int>& nums) {
    int n = nums.size();
    int xor_result = n;
    for(int i=0; i<nums.size(); i++){
        xor_result ^= i ^ nums[i];
    }

    return xor_result;
}
```
