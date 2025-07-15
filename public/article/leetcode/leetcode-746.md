---
title: "[ Leetcode 746 ] Min Cost Climbing Stairs | 解題思路分享"
date: "2025-07-14"
author: James
tags: Array,DP
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 cost[i] 代表從 stair `i` 往下爬的 cost，可以從 stair 0 或 stair 1 開始爬，每一次可以爬 1 格或是 2 格，問爬到底部需要的最小 cost 是多少？

題目連結 🔗：[https://leetcode.com/problems/min-cost-climbing-stairs/](https://leetcode.com/problems/min-cost-climbing-stairs/)

### **問題分析**

題目有一個關鍵限制，一次可以走一格或是兩格，也就是說

> stair `i` 只可能會從 `i-1` 或是 `i-2` 走來

這種 linear 的 state 轉換，就是很明顯的 Linear DP

### **解題思路 - DP**

我們需要一個 dp[i] 代表從 stair `i` 要往下走所需的最小 cost，而 stair `i` 只可能會從 `i-1` 或是 `i-2` 走來，Transition Function 如下

```cpp
dp[i] = min(dp[i-1], dp[i-2]) + cost[i]
```

從頭到尾 iterate 完就結束了，不過要注意的是 dp[i] 代表的是從 stair `i` 要往下走的最小 cost，所以在最後面的兩個 stairs 要選擇從 `n-1` 走比較好還是 `n-2`

```cpp
int minCostClimbingStairs(vector<int>& cost) {
    int n = cost.size();
    vector<int>dp(n, 0);
    dp[0] = cost[0];
    dp[1] = cost[1];

    for(int i = 2; i < n; i++){
        dp[i] = min(dp[i-1], dp[i-2]) + cost[i];
    }

    return min(dp[n-1], dp[n-2]);
}
```

那我們會發現這種 dp 一次只會 focus 兩格，因此可以做空間優化

```cpp
int minCostClimbingStairs(vector<int>& cost) {
    int n = cost.size();
    int prev1 = cost[0];
    int prev2 = cost[1];

    for(int i = 2; i < n; i++){
        int curr = min(prev1, prev2) + cost[i];
        prev1 = prev2;
        prev2 = curr;
    }

    return min(prev1, prev2);
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int minCostClimbingStairs(vector<int>& cost) {
    int n = cost.size();
    int prev1 = cost[0];
    int prev2 = cost[1];

    for(int i = 2; i < n; i++){
        int curr = min(prev1, prev2) + cost[i];
        prev1 = prev2;
        prev2 = curr;
    }

    return min(prev1, prev2);
}
```