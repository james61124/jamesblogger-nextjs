---
title: "[ Leetcode 704 ] Binary Search | 解題思路分享"
date: "2025-07-08"
author: James
tags: Binary Search
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 0ade77c4-85fc-40b6-bd3a-5475bbee8f9f
---

回傳 `nums` 中 `target` 的 index，如果找不到就回傳 -1。

題目連結 🔗：[https://leetcode.com/problems/binary-search/](https://leetcode.com/problems/binary-search/)

### **問題分析**

真的就是 Binary Search 而已，詳情可以參考這篇文章：

[[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/binary-search)

**Time Complexity** - `O(log n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
bool is_valid(vector<int>& nums, int target, int mid) {
    return nums[mid] >= target;
}

int search(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    while(left <= right) {
        int mid = left + (right - left) / 2;
        if(is_valid(nums, target, mid)) right = mid - 1;
        else left = mid + 1;
    }

    return left < 0 || left >= nums.size() || nums[left] != target ? -1 : left;
}
```
