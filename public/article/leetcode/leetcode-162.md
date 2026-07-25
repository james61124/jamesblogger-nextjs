---
title: "[ Leetcode 162 ] Find Peak Element | 解題思路分享"
date: "2025-11-20"
author: James
tags: Array,Binary Search,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
id: f2b2028c-50ff-4f54-a443-fe33aed9f7b8
---

給一個 nums[i]，找到一個 peak，他前面跟後面的數字都比自己小

題目連結 🔗：[https://leetcode.com/problems/find-peak-element/](https://leetcode.com/problems/find-peak-element/)

### **問題分析**

這題一看就是 Binary Search，因為他符合一個 pattern

> 這個 array 可以找到一個 function 讓他左邊都是 false，右邊都是 true

看我下面的文章就可以了

[[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/binary-search)

### **解題思路 - Binary Search**

看個例子，nums = [1, 2, 3, 4, 3, 2, 1]，我們為他設計一個 `is_valid` function

```
nums     = [1, 2, 3, 4, 3, 2, 1]
is_valid = [0, 0, 0, 1, 1, 1, 1]
```

簡單來說，decreasing part 的就給他 true，increasing part 的就給他 false，由於題目只要找任意一段 peak 就可以，所以就算題目有很多段 peak 這個方法也可以解

**Time Complexity** - `O(logn)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
bool is_valid(vector<int>& nums, int mid) {
    if(mid == nums.size() - 1 || nums[mid] > nums[mid + 1]) return true;
    else return false;
}

int findPeakElement(vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;

    while(right >= left){
        int mid = left + (right - left) / 2;
        if(is_valid(nums, mid)) right = mid - 1;
        else left = mid + 1;
    }

    return left;
}
```