---
title: "[ Leetcode 494 ] Target Sum | 解題思路分享"
date: "2025-07-02"
author: James
tags: Array,DP,0/1 Knapsack Problem
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/target-sum/](https://leetcode.com/problems/target-sum/)

### **問題分析**

這題最暴力的解法應該是 dfs + backtracking，但即便把重複的數字 prune 掉，時間複雜度還是 O(2^n) 這樣太高了，所以這題有更快的方式。

題目是問正負，因為每個數字都會選到，所以事實上不是挑不挑的問題，而是拆兩邊的問題，如果想得到拆兩邊，一邊為 positive，另一邊為 negative，我們自然就可以寫出這個方程式：

```python
sum(positive) - sum(negative) = target
```

也就是說，這題其實是在問

> 有幾種方法能把 `nums` 拆成兩邊，而兩邊差為 target

我們可以列出兩條方程式

```python
sum(positive) - sum(negative) = target
sum(positive) + sum(negative) = totalSum
```

兩條相加，最後會得到：

```python
2 * sum(positive) = target + totalSum
sum(positive) = (target + totalSum) / 2
```

也就是說這題題目變成

> 有多少 subset 可以可以組合出 `sum(positive)`

這幾乎就變成 [ Leetcode 416 ] Partition Equal Subset Sum 了，我們可以直接利用 0/1 Knapsack Problem 來解，如果沒有解過這題的可以先看下面的文章：

[[ Leetcode 416 ] Partition Equal Subset Sum | 解題思路分享](https://www.jamesblogger.com/leetcode/articles/leetcode-416)

### **解題思路 - 0/1 Knapsack Problem**

我們需要一個 dp[i][j] 代表「前 i 個數字中有多少 subset 可以組合出 j」，而 nums[i] 只有「選 / 不選」兩種 actions，所以是 0/1 Knapsack Problem。

如果不選 nums[i]，方法數就是「前 i-1 個數字中組成 j 的方法數」，也就是 dp[i-1][j]，如果選 nums[i]，方法數就是「前 i-1 個數字中組成 j - nums[i] 的方法數」，兩者相加即可，所以 Transition Function 是

```cpp
dp[i][j] = dp[i-1][j] + dp[i-1][j - nums[i]]
```

再來我們要思考初始化的情況，dp[0][0] 肯定要放 1，因為不管 nums[0] 是多少，空的 subset 方法數就是 1，再來 dp[0][nums[0]] 的方法數也是 1，

**Time Complexity** - `O(mlogk)`，m 是 10，k 是該 user following 的人數<br>
**Space Complexity** - `O(n)`

### **Implementation**

```cpp
 int findTargetSumWays(vector<int>& nums, int target) {
    int totalSum = 0;
    int positive = 0;

    for(int num : nums) totalSum += num;
    if(totalSum < abs(target) || (totalSum + target) % 2 != 0) return 0;
    positive = (totalSum + target) / 2;

    vector<vector<int>>dp(nums.size(), vector<int>(positive + 1, 0));
    int n = dp.size(), m = dp[0].size();
    dp[0][0] = 1;
    if(nums[0] < m) dp[0][nums[0]] += 1;

    for(int i = 1; i < n; i++){
        for(int j = 0; j < m; j++){
            dp[i][j] = dp[i-1][j];
            if (j >= nums[i]) dp[i][j] += dp[i-1][j - nums[i]];
        }
    }

    return dp[n-1][m-1];
}
```