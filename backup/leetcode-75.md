---
title: "[ Leetcode 75 ] Sort Colors | 解題思路分享"
date: "2025-09-10"
author: James
tags: Array,Two Pointers
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/sort-colors/](https://leetcode.com/problems/sort-colors/)

### **問題分析**

這題的目標是要想一個 O(n) 而且不用到任何 extra space 的方法，如果簡單使用 quick sort，那就會是 O(nlogn)，因此關鍵在於如何利用「nums[i] 裡面只包含三種數字」。

### **解題思路 - Dutch National Flag Algorithm**

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
void sortColors(vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;

    for(int i = 0; i <= right; i++) {
        if(nums[i] == 0){
            swap(nums[i], nums[left]);
            left++;
        } else if(nums[i] == 2){
            swap(nums[i], nums[right]);
            right--;
            i--;
        }
    }
}
```