---
title: "[ Leetcode 27 ] Remove Element | 解題思路分享"
date: "2025-08-29"
author: James
tags: Array,Two Pointers,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
id: f762ebd4-2080-4787-a8f6-ceec17ac0ec9
---

輸入 nums[i] 和一個數字 `val`，要 in-place 移除所有等於 `val` 的元素，並回傳移除後的陣列長度，多餘的元素可以不用管，但不能新建額外的陣列。

題目連結 🔗：[https://leetcode.com/problems/remove-element/](https://leetcode.com/problems/remove-element/)

### **解題思路 - Two Pointers**

這題還滿簡單的，因為他不用管剩下的空間要放什麼，所以只要設兩個 pointers，`right` 一直往前跑，跑到跟 `val` 不一樣就丟給 `left`，這題基本上就解完了

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int removeElement(vector<int>& nums, int val) {
    int left = 0, right = 0;
    while(right < nums.size()){
        if(nums[right] != val){
            nums[left] = nums[right];
            left++;
        }
        right++;
    }

    return left;
}
```