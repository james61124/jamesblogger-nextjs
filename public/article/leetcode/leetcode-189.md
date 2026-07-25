---
title: "[ Leetcode 189 ] Rotate Array | 解題思路分享"
date: "2025-08-30"
author: James
tags: Array,Math,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
id: ee91a105-dd08-4d8e-b7b0-38a332d45db8
---

給一個 nums[i]，回傳 rotate k 次後的結果

題目連結 🔗：[https://leetcode.com/problems/rotate-array/](https://leetcode.com/problems/rotate-array/)

### **題目分析**

這題可以直接使用 Reverse Array 來完成，不用另外開新的空間。

### **解題思路**

我們先簡單用圖示來看一下 rotate k 次後的 array 會長什麼樣子

```
[ 後 k 個 elements ][ 前 n - k 個 elements ]
```

我們先想辦法將「 後 k 個 elements 」往前放，「 前 n - k 個 elements 」往後放，而只要 reverse 整個 array 就可以做到這件事，大概會變成這樣：

```
[ reversed 後 k 個 elements ][ reversed 前 n - k 個 elements ]
```

最後再將前後兩部分分別再做一次 reverse 就好，寫成程式碼就是

```cpp
void rotate(vector<int>& nums, int k) {
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
}
```

但 `k` 有可能會超過 array 的長度，幫她取個餘數就好

```cpp
k %= nums.size();
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
void rotate(vector<int>& nums, int k) {
    k %= nums.size();
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
}
```