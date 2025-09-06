---
title: "[ Leetcode 26 ] Remove Duplicates from Sorted Array | 解題思路分享"
date: "2025-02-26"
author: James
tags: Array,Two Pointers,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
---

給定一個 ascending sorted array - `nums`，要原地移除重複出現的元素，使得每個元素只出現一次，並返回移除後的陣列長度。

⚠ 要求：
1. 不能使用額外的陣列空間，必須在原陣列上修改。
2. 如果返回的陣列長度是 k，表示修改後的 `nums` 前 k 個元素為 remove duplicates 後的結果，後面的元素可以是任意值，不用管後續數據。

題目連結 🔗：[https://leetcode.com/problems/remove-duplicates-from-sorted-array/](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)

### **解題思路 - Fast and Slow Pointers**

#### **為什麼使用 Two Pointers？**

我們可以使用 Two Pointers，其中
- **Fast Pointer** 用來遍歷整個陣列
- **Slow Pointer** 用來標記「 Remove Duplicates 後的最後一個元素」

fast 一直往前走，當 nums[fast] != nums[slow]，代表找到新元素，應該將其存到 slow 的位置，然後 slow 向前移動。

**Time Complexity** - `O(n)`，每個元素最多被 fast 掃過一次。<br>
**Space Complexity** - `O(1)`，只使用了兩個指針

#### **Implementation**

```cpp
int removeDuplicates(vector<int>& nums) {
    int slow = 0;
    int fast = 1;
    while(fast < nums.size()){
        if(nums[slow]!=nums[fast]){
            slow++;
            nums[slow]=nums[fast];
        }
        fast++;
    }
    return slow+1;
}
```