---
title: "[ Leetcode 377 ] Combination Sum IV | 解題思路分享"
date: "2025-12-03"
author: James
tags: Array,Greedy,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 2855b541-fc97-4822-92dc-b1dca6f6bd39
---

給 nums[i] 還有 target，從 nums[i] 裡拿數字出來加總成 target，問總共有幾種方法可以讓總和剛好為 target，注意順序不一樣要算成不同組合數

題目連結 🔗：[https://leetcode.com/problems/increasing-triplet-subsequence/](https://leetcode.com/problems/increasing-triplet-subsequence/)

## 問題分析

這題不是 coin change，因為順序不一樣也會被當作不同方法，所以不能把他當 knapsack problem 來想

這題正確解法應該是要用 dp，我們需要一個 dp[i] 代表「合成出 i 的方法數」，舉個例子，如果 target = 4, nums = [1, 2, 3]

dp[1] = dp[0]，因為只有 1 能放，在放 1 前 sum 是 0

dp[2] = dp[1] + dp[0]，因為我們可以放 1 or 2，所以總方法數就會是 dp[2 - 1] + dp[2 - 2]，把最後放 1 or 放 2 的方法數都加起來

dp[3] = dp[2] + dp[1] + dp[0]，一樣因為我們可以放 1 or 2 or 3，所以總方法數就是 dp[3 - 1] + dp[3 - 2] + dp[3 - 3]

最後 dp[4] = dp[3] + dp[2] + dp[1]

## 解題思路 - DP

知道方法之後實作就很簡單了

**Time Complexity** - `O(n * target)`<br>
**Space Complexity** - `O(target)`

### Implementation

```cpp
int combinationSum4(vector<int>& nums, int target) {
    vector<unsigned long long>dp(target + 1, 0);

    dp[0] = 1;
    for(int i = 1; i <= target; i++){
        for(int &num : nums){
            if(i >= num) dp[i] += dp[i - num];
        }
    }

    return (int)dp[target];
}
```
