---
title: "[ Leetcode 53 ] Maximum Subarray | 解題思路分享"
date: 2025-01-29
draft: false
author: "James"
tags:
  - Dynamic Programming
  - Sliding Window
  - Algorithms
  - Leetcode
image: /images/program/Leetcode.jpeg
description: ""
toc: 
categories:
  - Algorithm
---

給定一個整數陣列 nums，找到一個連續子陣列（至少包含一個數字），使其和最大，並返回該最大和。

### **方法一 - DP**

這題可以用 DP 來解，利用前一個 element 的狀態 + 新的 element 來更新新的狀態。以這題來說，建立一個 dp，dp[i] 代表以 nums[i] 為結尾的 subarray 的 maximum subarray，這樣更新完整個 dp，就看過所有以 nums[i] 為結尾的狀況，取得 max(dp) 就是答案。

##### **Step 1**

維護一個 dp，dp[i] 代表以 nums[i] 為結尾的 subarray 的 maximum subarray

##### **Step 2**

計算 dp[i] 時有兩種情況，第一種就是 nums[i] 接在 nums[i-1] 後面，這就代表 dp[i] = dp[i-1] + nums[i]，而這種狀況只會在 dp[i-1] >= 0 時，如果 dp[i-1] < 0，表示 dp[i] = nums[i]，因為如果讓 nums[i] 接在 nums[i-1] 後面，dp[i-1] 是負數的關係，就不會是最大的，subarray 必須重新計算

##### **Step 3**

max(dp) 就是答案，找到所有以 nums[i] 為結尾的 subarray 的 maximum subarray 中最大的

#### **Implementation**

```cpp
int maxSubArray(vector<int>& nums) {

    vector<int>dp(nums.size(), 0);
    dp[0] = nums[0];

    for(int i=1;i<nums.size();i++){
        dp[i] = max(dp[i-1] + nums[i], nums[i]);
    }

    return *max_element(dp.begin(), dp.end());
}
```

### **方法二 - **