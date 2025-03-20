---
title: "[ Leetcode 217 ] Contains Duplicate | 解題思路分享"
date: "2025-03-10"
author: James
tags: Array,Hash Table
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個整數 array `nums`，判斷是否存在重複的數字。

題目連結 🔗：[https://leetcode.com/problems/contains-duplicate/](https://leetcode.com/problems/contains-duplicate/)

### **解題思路 - Hash Table**

非常的直覺，把數字存進去 Hash Table，檢查數字有沒有在 Hash Table 裡就行了，因為 Hash Table 的 search 是 O(1)。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**

```cpp
bool containsDuplicate(vector<int>& nums) {
    unordered_set<int>uset;

    for(int& num : nums){
        if(uset.count(num)) return true;
        uset.insert(num);
    }

    return false;
}
```