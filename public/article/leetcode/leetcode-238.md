---
title: "[ Leetcode 238 ] Product of Array Except Self | 解題思路分享"
date: "2025-04-25"
author: James
tags: Array,Prefix Sum
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 array `nums`，要求 return 一個新的 array `output` 使得 output[i] 等於 nums 陣列中除了 nums[i] 以外的所有數字的乘積。其中不可以使用除法，而且必須在 O(n) 內解完題目。

題目連結 🔗：[https://leetcode.com/problems/product-of-array-except-self/](https://leetcode.com/problems/product-of-array-except-self/)

### **問題分析**

這題題目要求要找到 O(n) 但不能用除法的解法，所以最直覺的暴力法已經不能使用，我們順著題目看看能不能分析出另一種解法。

首先題目需要將除了自己的所有值都乘起來，先從 nums[0]，就算完全沒有其他演算法輔助，肯定還是需要一個從 nums[1] 乘到 nums[n-1] 的過程，但因為要 O(n)，所以表示在計算 nums[1] 的時候「nums[2] 乘到 nums[n-1]」這個過程不能重複計算，要達成這個目的，我們就需要把「nums[1] 乘到 nums[n-1]」的過程記錄下來，這樣才不用重算，所以到這邊可以先開一個 result[i] 儲存「nums[i+1] 乘到 nums[n-1]」的結果。

```cpp
for(int i = n - 2; i >= 0; i--){
    result[i] = result[i+1] * nums[i+1];
}
```

result[i] 是紀錄右邊乘積，所以我們在 iterate 時如果也把左邊的乘積紀錄起來那就可以直接推出結果，我們可以開一個 `curr` 負責記錄左邊的乘積，每 iterate 一個就把 nums[i] 也乘進來，最後 result[i] 的答案就可以利用右邊乘積跟左邊乘積組合起來得到了。

```cpp
for(int i = 0; i < n; i++){
    result[i] *= curr;
    curr *= nums[i];
}
```

思路清晰所以直接進實作。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int>result(n, 1);
    int curr = 1;
    
    for(int i = n - 2; i >= 0; i--){
        result[i] = result[i+1] * nums[i+1];
    }

    for(int i = 0; i < n; i++){
        result[i] *= curr;
        curr *= nums[i];
    }

    return result;
}
```
