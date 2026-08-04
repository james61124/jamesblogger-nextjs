---
title: "[ Leetcode 283 ] Move Zeroes | 解題思路分享"
date: "2025-11-20"
author: James
tags: Array,Google
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: 683d45bc-b69b-4b32-a022-df7a3f4c5a16
---

給 nums[i]，要把所有 0 搬到後面並且不影響到其他 non-zero 的相對順序

題目連結 🔗：[https://leetcode.com/problems/move-zeroes/](https://leetcode.com/problems/move-zeroes/)

## 問題分析

這題沒什麼特別的技巧，只要把 non-zero 的數全部搬來前面，後面全部填成 0 就好了

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

## Implementation

```cpp
void moveZeroes(vector<int>& nums) {
    int curr = 0;
    for(int i = 0; i < nums.size(); i++){
        if(nums[i] != 0){
            nums[curr] = nums[i];
            curr++;
        }
    }

    for(int i = curr; i < nums.size(); i++) nums[i] = 0;
}
```