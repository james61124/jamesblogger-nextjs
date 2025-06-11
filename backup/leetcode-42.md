---
title: "[ Leetcode 42 ] Trapping Rain Water | 解題思路分享"
date: "2025-06-10"
author: James
tags: 
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---



題目連結 🔗：[https://leetcode.com/problems/search-in-rotated-sorted-array/](https://leetcode.com/problems/search-in-rotated-sorted-array/)

### **問題分析**

我一開始的想法非常直覺，這題看起來就很像 Monotonic Stack，維持一個 decreasing 的 Monotonic Stack，代表還等待填入水的 height，當遇到比 stack 的頭還要大的 height，表示遇到牆了可以儲水了，就把元素從 Stack 中移出來計算儲水量，這個版本乍看沒甚麼問題也是 O(n)，但想起來就是有一點繞，沒想到這題竟然可以用 Two Pointers 解。

### **解題思路 - Two Pointers**

我們需要兩個 pointers `left`, `right` 分別在最左跟最右，再來


<!-- 0 1 1 1 1 1 1 0 0 1 1 1
0 2 0 0 0 0 0 2 0 2 4

if(different and dp[i] != dp[i-dp[i-1]-1]) dp[i] = dp[i-1] + 2
else if(different) dp[i] = 2
else if(same and dp[i] != dp[i-dp[i-1]-1]) dp[i] = dp[i-1] + 2
else if(same) dp[i] = 0 -->

**Time Complexity** - `O(log n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int leftMax = 0, rightMax = 0;
    int water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            leftMax = max(leftMax, height[left]);
            water += leftMax - height[left];
            left++;
        } else {
            rightMax = max(rightMax, height[right]);
            water += rightMax - height[right];
            right--;
        }
    }

    return water;
}
```