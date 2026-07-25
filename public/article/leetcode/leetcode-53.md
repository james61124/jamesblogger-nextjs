---
title: "[ Leetcode 53 ] Maximum Subarray | 解題思路分享"
date: "2025-03-01"
author: James
tags: Array,DP,Divide and Conquer,Google,Meta
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
id: 093d9dbb-c297-4f71-9eb3-345d40305763
---

給一個整數 array `nums`，找到一個連續 subarray（至少包含一個數字），使其和最大，並返回該最大和。

題目連結 🔗：[https://leetcode.com/problems/maximum-subarray/](https://leetcode.com/problems/maximum-subarray/)

### **方法一 - DP**

這題可以用 DP 來解，利用前一個 element 的狀態 + 新的 element 來更新新的狀態。以這題來說，建立一個 dp，dp[i] 代表以 nums[i] 為結尾的 subarray 的 maximum subarray，這樣更新完整個 dp，就看過所有以 nums[i] 為結尾的狀況，取得 max(dp) 就是答案。

#### **Step 1**

維護一個 dp，dp[i] 代表以 nums[i] 為結尾的 subarray 的 maximum subarray

#### **Step 2**

以 nums[i] 為結尾的 subarray 有兩種情況，第一種是在 nums[i] 前面接上「以 nums[i-1] 為結尾的 maximum subarray」，第二種是單獨取 nums[i] 當成 subarray，兩種比較大的放到 dp[i] 就行了，寫成 code 就是

```cpp
dp[i] = max(dp[i-1] + nums[i], nums[i]);
```

稍微分析一下，所以只有在 dp[i-1] >= 0 時會是第一種情況，不然如果 dp[i-1] < 0 ，我就不需要把前面的 maximum subarray 接上來了，直接取 nums[i] 就好了。

#### **Step 3**

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

### **空間優化 - Kadane's Algorithm**

上面的解法我們會發現我們一次只會用到 dp 的兩個 index 而已，所以我們完全不用開一個完整的 dp array，可以簡單用兩個 integer 代替就好。`currentSum` 就代表 dp[i]，當我們 iterate 到下一個 index，就做

```cpp
currentSum = max(currentSum + nums[i], nums[i]);
```

這樣我們就成功更新 dp[i] 了，那最後我們需要找到 max(dp)，所以只要先維護一個 `maxSum`，把當前的 maximum 一直存進去就好。

```cpp
maxSum = max(maxSum, currentSum);
```

#### **Implementation**

```cpp
int maxSubArray(vector<int>& nums) {
    int currentSum = nums[0];
    int maxSum = nums[0];
    for(int i=1;i<nums.size();i++){
        currentSum = max(currentSum + nums[i], nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}
```