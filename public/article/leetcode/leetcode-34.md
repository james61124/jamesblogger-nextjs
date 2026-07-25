---
title: "[ Leetcode 34 ] Find First and Last Position of Element in Sorted Array | 解題思路分享"
date: "2025-11-19"
author: James
tags: Array,Binary Search,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: 0a660302-aeef-4360-89bb-89a2886d32a6
---

給一個 non-decreasing 的 array，回傳 target 的起始 index 跟結束 index，如果整個 array 找不到 target，就回傳 {-1, -1}

題目連結 🔗：[https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

### **問題分析**

這題是 sorted array 裡面找 target，直接用 Binary Search 就好

[[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/binary-search)

### **解題思路 - Binary Search**

利用上面 Binary Search 的技巧可以來解這題，首先我們需要定義出 `is_valid()` function 來將整個 array 分成左半邊跟右半邊，我們要讓 left pointer 最後落在第一個 target 身上，大概像這樣

```
target = 3
nums     = 1 1 2 2 2 3 3 4 4 4
is_valid = 0 0 0 0 0 1 1 1 1 1 
```

寫成程式碼就是這樣

```cpp
int left = 0, right = nums.size() - 1;
while(right >= left){
    int mid = left + (right - left) / 2;
    if(nums[mid] >= target) right = mid - 1;
    else left = mid + 1;
}
```

下一步最直覺的方式就是從 left 一路往後找，直到發現 nums[left] 跟 target 不一樣的時候就回傳最後一個 index，這樣做沒有問題但是如果整個 array 數字都是一樣的，time complexity 就會退化回 O(n)，所以我們可以再做一次 Binary Search 找到 target 下一個數字的 index

```
target = 3
nums     = 1 1 2 2 2 3 3 4 4 4
is_valid = 0 0 0 0 0 0 0 1 1 1 
```

寫成程式碼就是這樣

```cpp
int left_1 = 0, right_1 = nums.size() - 1;
while(right_1 >= left_1){
    int mid = left_1 + (right_1 - left_1) / 2;
    if(nums[mid] > target) right_1 = mid - 1;
    else left_1 = mid + 1;
}
```

最後直接將這兩個 index 回傳就好

```cpp
if(left < 0 || left >= nums.size() || nums[left] != target) return {-1, -1};
return {left, left_1 - 1};
```

**Time Complexity** - `O(logn)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
vector<int> searchRange(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while(right >= left){
        int mid = left + (right - left) / 2;
        if(nums[mid] >= target) right = mid - 1;
        else left = mid + 1;
    }

    int left_1 = 0, right_1 = nums.size() - 1;
    while(right_1 >= left_1){
        int mid = left_1 + (right_1 - left_1) / 2;
        if(nums[mid] > target) right_1 = mid - 1;
        else left_1 = mid + 1;
    }

    if(left < 0 || left >= nums.size() || nums[left] != target) return {-1, -1};
    return {left, left_1 - 1};
}
```