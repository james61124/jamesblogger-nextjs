---
title: "[ Leetcode 1 ] Two Sum | 解題思路分享"
date: "2025-03-26"
author: James
tags: Array,Hash Table,Google,Meta
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: edd03e40-4101-4270-9f4d-84248f808f40
---

給一個整數 array `nums` 和一個目標數字 `target`，要在 array 中找到兩個數，使它們的和等於 target，並回傳它們的 index。

題目連結 🔗：[https://leetcode.com/problems/two-sum/](https://leetcode.com/problems/two-sum/)

### **問題分析**

暴力解就是跑雙迴圈，找到 nums[i] 之後再跑一層看看有沒有 `target-nums[i]`，所以如果要省時間的話就是要想辦法讓尋找 `target-nums[i]` 這件事情變成 O(1)，那用 Hash Table 就可以解了。

### **解題思路 - Hash Table**

解題思路很簡單，unordered_map 用來記錄 nums[i] 跟他們對應的 index，找到 nums[i] 的時候看看 `target-nums[i]` 是不是已經在 unordered_map 裡了，是的話就直接 return 彼此的 index，不然就把 {nums[i], i} 推到 unordered_map 裡紀錄。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int>umap;

    for(int i=0; i<nums.size(); i++){
        int complement = target-nums[i];
        if(umap.count(complement)) return {umap[complement], i};
        else umap[nums[i]] = i;
    }
    return {};
}
```