---
title: "[ Leetcode 153 ] Find Minimum in Rotated Sorted Array | 解題思路分享"
date: "2025-04-14"
author: James
tags: Array,Binary Search
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
---

給一個 increasing 但是被 rotate 過的 sorted array，回傳他被 rotate 了幾次。

題目連結 🔗：[https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)

### **問題分析**

這題翻成白話文就是「找到最小數字的 index」，所以最直覺的解就是 O(n)，但因為這題給的是 rotated sorted array，雖然不是真的 sorted array，但感覺上應該要有方法可以用 O(logn) 解決。

按照前面的思路，sorted array 變體中，要找到特定 target，可以從 Binary Search 想想看。

### **解題思路 - Binary Search**

Binary Search 不只可以用在「找 sorted array 中的 target」，而是如果這個 array 可以找到一個 function 讓他左邊都是 false，右邊都是 true，就可以用 Binary Search 來解，詳細內容可以看我整理的這篇文章：[[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/binary-search)

所以按照文章思路，我們需要設計一個 `is_valid` 的 function 讓最小數字的 index 開始都是 true，而 Binary Search 的 left 最後就會落在最左邊的 true 身上，有點像這樣：

```
nums     = [4, 5, 6, 7, 1, 2, 3]
is_valid = [0, 0, 0, 0, 1, 1, 1]
```

這邊來討論幾個 edge case，一般情況沒有問題，那如果是 increasing array 跟 decreasing array 呢？

```
nums     = [1, 2, 3, 4, 5, 6, 7]
is_valid = [1, 1, 1, 1, 1, 1, 1]

nums     = [7, 6, 5, 4, 3, 2, 1]
is_valid = [0, 0, 0, 0, 0, 0, 1]
```

所以我們會發現，所有小於等於 min(nums[0], nums[nums.size()-1]) 的 index 的 is_valid 就要設為 true，那這題就解完了

**Time Complexity** - `O(logn)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
bool isValid(vector<int>& nums, int mid, int& threshold){
    return threshold >= nums[mid];
}

int binarySearch(vector<int>& nums){
    int left = 0, right = nums.size() - 1;
    int threshold = min(nums[left], nums[right]);
    while( right >= left ){
        int mid = left + (right - left)/2;
        if( isValid(nums, mid, threshold) ) right = mid - 1;
        else left = mid + 1;
    }
    return left;
}

int findMin(vector<int>& nums) {
    int index = binarySearch(nums);
    return index >= nums.size() ? nums[0] : nums[index];
}
```
