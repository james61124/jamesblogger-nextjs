---
title: "[ Leetcode 167 ] Two Sum II - Input Array Is Sorted | 解題思路分享"
date: "2025-02-26"
author: James
tags: Array,Two Pointers
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

這題是 Two Sum 的變體，給定一個「遞增排序」的 array，要求找出兩個數，使它們的和等於目標值，並返回這兩個數的「1-based index」

題目連結 🔗：[https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

### **解題思路 - Opposite Direction Two Pointers**

這題可以用 opposite direction 的 two pointer 來解，因為這題算是在 sorted array 中找到某些約束條件的元素，left 先指在第一個元素，right 指在最後一個，如果兩個數的和大於 target，就移動 right，反之，就移動 left。

**Time Complexity** - `O(n)`，每個元素最多被 right 或 left 掃過。<br>
**Space Complexity** - `O(1)`，只使用了兩個指針

#### **Implementation**

```cpp
vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0;
    int right = numbers.size()-1;
    while(left <= right) {
        if(numbers[left] + numbers[right] < target) left++;
        else if(numbers[left] + numbers[right] > target) right--;
        else return {left+1, right+1};
    }
    return {};
}
```