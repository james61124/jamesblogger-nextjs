---
title: "[ Leetcode 80 ] Remove Duplicates from Sorted Array II | 解題思路分享"
date: "2025-08-29"
author: James
tags: Array,Two Pointers,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
---

給一個 sorted array nums[i]，每個數最多只能出現兩次，in-place 移除多餘的元素並回傳新的陣列長度。

題目連結 🔗：[https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/)

### **解題思路 - Two Pointers**

這題可以利用 Two Pointers 解決，`fast` 可以一直跑，把可以留下的數字放到 `slow`，如果寫成 pesudo code 會像這樣

```cpp
int removeDuplicates(vector<int>& nums) {
    int slow = 0, fast = 0;

    while(fast < nums.size()){
        if (nums[fast] is acceptable) {
            nums[slow] = nums[fast];
            slow++;
        }
        fast++;
    }

    return slow;
}
```

所以關鍵在於要怎麼判斷 `nums[fast]` 是不是已經重複兩次了，而因爲 `nums` 是 increasing，如果 `nums[fast]` 跟 `nums[slow - 1]` 一樣，表示這個數字剛被用一次而已，還可以再被用一次，如果他跟 `nums[slow - 2]` 也一樣，就表示他已經被用兩次了，就不能再被用了，簡單來說，只要 `nums[fast] != nums[slow - 2]`，就表示這個數字可以被放進去 nums 中。

不過我們需要處理一下 edge case，如果 `slow < 2` 就沒辦法這樣比，所以要拉出來寫

```cpp
if(slow < 2 || nums[fast] != nums[slow - 2])
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int removeDuplicates(vector<int>& nums) {
    int slow = 0, fast = 0;

    while(fast < nums.size()){
        if(slow < 2 || nums[fast] != nums[slow - 2]) {
            nums[slow] = nums[fast];
            slow++;
        }
        fast++;
    }

    return slow;
}
```