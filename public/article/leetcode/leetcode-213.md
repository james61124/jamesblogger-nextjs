---
title: "[ Leetcode 213 ] House Robber II | 解題思路分享"
date: "2025-04-18"
author: James
tags: Array,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 3
readTime: 3
---

你是一名專業竊賊，計劃搶劫一排房子。每間房子內藏有一定金額的現金，nums[i] 代表第 i 間房子的金額。要注意的是相鄰的兩間房不能在同一晚搶，否則會觸發警報，而且房子呈環狀排列，所以第一間房與最後一間房相鄰。題目要求是給整數 array `nums`，回傳你在不觸發警報的前提下，最多可以搶到多少錢。

題目連結 🔗：[https://leetcode.com/problems/house-robber-ii/](https://leetcode.com/problems/house-robber-ii/)

### **問題分析**

這題如果嘗試找到所有 subsequence，時間複雜度會指數型成長，所以滿明顯是 DP 的，關鍵在於怎麼逐步推導出 Transition Function。

### **解題思路 - DP**

這題環狀的設計有一個很好的方式可以直接解決，對於一個 size 為 n 的 nums，我們只要分析這兩個 array 中比較大的就行了：nums[0...n-2], nums[1...n-1]，總之就是取頭不取尾，取尾不取頭

```cpp
return max(maxMoney(nums, 1, n-1), maxMoney(nums, 0, n-2)); 
```

所以我們需要一個 function `maxMoney` 來處理 nums[left...right] 可以獲得的最大 money，首先先用我第一個想到的解法思考，我們假設 dp[i] 為「以 nums[i] 為結尾的 array 能獲得的最大 money」，對於每一個 dp[i] 來說，如果一定會 rob nums[i] 的話，那最大值就是 dp[left] ~ dp[i-2] 中最大的再加上 nums[i] 自己，所以需要雙迴圈，最後結果就是 dp[i] 中最大的，Transition Function 會長這樣：

```cpp
dp[left] = nums[left];
dp[left + 1] = max(nums[left], nums[left + 1]);
for(int i = left + 2; i <= right; i++){
    for(int j = left; j <= i - 2; j++){
        dp[i] = max(dp[i], nums[i] + dp[j]);
    }
}
```

但上面的方法是 `O(n^2)`，再來再繼續思考這題是不是可以用 `O(n)` 就解決，如果 dp[i] 不要侷限在「以 nums[i] 為結尾」的話，改成定義為「nums[left...i] 中能獲得的最大 money」，這樣對於每一個 dp[i] 來說，因為 nums[i] 都是正整數，就是很單純的分成「選 dp[i] / 不選 dp[i]」兩種情況，選的話就是 `nums[i] + dp[i - 2]`，不選的話就是 `dp[i-1]`，所以取最大的，Transition Function 就是：

```cpp
dp[left] = nums[left];
dp[left + 1] = max(nums[left], nums[left + 1]);
for(int i = left + 2; i <= right; i++){
    dp[i] = max(dp[i - 1], nums[i] + dp[i - 2]);
}
return dp[right];
```

那接下來我們就會發現這個 dp array 一次只需要關注三格的資訊就可以了，所以我們其實不用宣告一整個 dp[i]，只需要三個 integer 就可以了，直接看下面的 implementation。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int maxMoney(vector<int>&nums, int left, int right){
    int prev = 0;
    int cur = 0;

    for(int i=left; i<=right; i++){
        int temp = max(cur, nums[i] + prev);
        prev = cur;
        cur = temp;
    }

    return cur;
}

int rob(vector<int>& nums) {
    int n = nums.size();
    if(n == 1) return nums[0];
    else return max(maxMoney(nums, 1, n-1), maxMoney(nums, 0, n-2)); 
}
```
