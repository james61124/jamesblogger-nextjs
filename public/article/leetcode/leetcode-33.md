---
title: "[ Leetcode 33 ] Search in Rotated Sorted Array | 解題思路分享"
date: "2025-06-09"
author: James
tags: Array,Binary Search
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""  
readTime: 2
---

給定一個 ratated increasing array `nums`（不含重複元素），以及一個 `target`，要在 array 中找出 target 的 index，若不存在則回傳 -1。

題目連結 🔗：[https://leetcode.com/problems/search-in-rotated-sorted-array/](https://leetcode.com/problems/search-in-rotated-sorted-array/)

### **問題分析**

這題是很典型的 Binary Search 變形，為什麼他可以用 Binary Search 解呢？可以先看我整理的這篇文章：

[[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/binary-search)

### **解題思路 - Binary Search**

看完文章後我們可以得到一個觀念

> Binary Search 不只是用來「找 sorted array 中的 target」，而是如果這個 array 可以找到一個 function 讓他左邊都是 false，右邊都是 true，就可以用 Binary Search 來解。

舉一些例子，可能就會像這樣

```python
target   = 1
is_valid = [0, 0, 0, 0, 0, 1, 1]
nums     = [4, 5, 6, 7, 0, 1, 2]

target   = 5
is_valid = [0, 1, 1, 1, 1, 1, 1]
nums     = [4, 5, 6, 7, 0, 1, 2]

target   = 3
is_valid = [0, 0, 0, 0, 0, 0, 0]
nums     = [4, 5, 6, 7, 0, 1, 2]
```

所以這題的重點就是我們要找到 Binary Search 裡面的 `is_valid` function。

我們首先來觀察一下，因為 `nums` 是 rotated sorted array，所以可以分成 left section 跟 right section，用顏色來分類會長這樣：

<figure>
  <img src="/images/leetcode/leetcode-33/section.png" alt="Section" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">

  </figcaption>
</figure>

首要目標是先判斷 target 落在 right section 還是 left section，因為 `nums` 是 increasing 的，所以如果 `target >= nums[left]` 表示 target 會在 left section，如果 `target < nums[left]`，target 就會落在 right section。

再來要判斷甚麼樣的 nums[mid] 要在 is_valid 裡面回傳 true，如果 target 落在 right section，nums[mid] 落在 right section 同時 nums[mid] >= target 那 is_valid 就要被標成 1。

<figure>
  <img src="/images/leetcode/leetcode-33/right-section.png" alt="Section" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">

  </figcaption>
</figure>

那如果 target 落在 left section，如果 nums[mid] 落在 right section 或是 nums[mid] >= target，那 is_valid 就要被標成 1。

<figure>
  <img src="/images/leetcode/leetcode-33/left-section.png" alt="Section" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">

  </figcaption>
</figure>

所以寫成程式碼是這樣

```cpp
bool is_valid(vector<int>& nums, int left, int mid, int target){
    if(target >= nums[left]) return (nums[mid] < nums[left]) || (target <= nums[mid]);
    else return (nums[mid] < nums[left]) && (target <= nums[mid]);
}
```

Binary Search 的 Template 最後都是回傳 `left`，但這裡需要處理沒有找到 target 的情況，我們這個寫法 `left` 會落在兩種地方，有可能 target 如果落在 left section 跟 right section 的數值中間，left 就會超出去，像這樣：

```python
target   = 3
is_valid = [0, 0, 0, 0, 0, 0, 0]
nums     = [4, 5, 6, 7, 0, 1, 2]

left = 7
```

但如果 target 落在中間的話，left 就會落在大於等於 target 的最小值身上，像這樣：

```python
target   = 2
is_valid = [0, 1, 1]
nums     = [1, 3, 5]

left = 1
```

所以 return 處理一下這兩種狀況即可。

```cpp
int search(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while(left <= right){
        int mid = left + (right - left) / 2;
        if(is_valid(nums, left, mid, target)) right = mid - 1;
        else left = mid + 1;
    }
    return left != nums.size() && nums[left] == target ? left : -1;
}
```

**Time Complexity** - `O(log n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
bool is_valid(vector<int>& nums, int left, int mid, int target){
    if(target >= nums[left]) return (nums[mid] < nums[left]) || (target <= nums[mid]);
    else return (nums[mid] < nums[left]) && (target <= nums[mid]);
}

int search(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while(left <= right){
        int mid = left + (right - left) / 2;
        if(is_valid(nums, left, mid, target)) right = mid - 1;
        else left = mid + 1;
    }
    return left != nums.size() && nums[left] == target ? left : -1;
}
```