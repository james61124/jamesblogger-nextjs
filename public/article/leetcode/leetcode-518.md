---
title: "[ Leetcode 518 ] Coin Change II | 解題思路分享"
date: "2025-07-03"
author: James
tags: Array,DP,Unbounded Knapsack Problem,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 coins[i]，代表不同面額的 coins，每一個 coin 都有無限多個，要回傳有幾種方法可以組合成 `amount`。

題目連結 🔗：[https://leetcode.com/problems/coin-change-ii/](https://leetcode.com/problems/coin-change-ii/)

### **問題分析**

這題白話文就是問利用 coins[i] 的組合，有幾種方法可以組合出 `amount`，那其實就是變形的 [ Leetcode 494 ] Target Sum

[[ Leetcode 494 ] Target Sum | 解題思路分享](https://www.jamesblogger.com/leetcode/articles/leetcode-494)

從上面這題的經驗我們會知道，問「幾種方法可以組合出 `target`」就是 Knapsack Problem，但這題比較不一樣的是每一個 coins 都有無限多個，所以是 Unbounded Knapsack Problem。

[[ Algorithm ] Dynamic Programming (四) - Knapsack Problem | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/knapsack-problem)

### **解題思路 - Unbounded Knapsack Problem**

我們需要一個 dp[i][j] 代表「前 i 個 coins 組成 j 的方法數」，因為是 Unbounded Knapsack Problem，每一個 coins[i] 有「不選 / 選 n 個」這幾種 actions，如果不選，表示方法數是「前 i - 1 個 coins 組成 j 的方法數」，如果選 n 個，表示方法數是「前 i 個 coins 組成 j - coins[i] 的方法數」，兩者相加即可，所以 Transition Function 是這樣；

```cpp
dp[i][j] = dp[i-1][j] + dp[i][j - coins[i]];
```

先看初始化的狀況，我們看第一個 row，當 `amount` 為 0，任何 coins 都會有一種方法達成，就是不要選，所以 dp[0][0] = 1，再來每一個 coins[0] 的倍數的方法數都是 1，所以初始化長這樣：

```cpp
int n = coins.size(), m = amount + 1;
vector<vector<int>>dp(n, vector<int>(m, 0));

dp[0][0] = 1;
for(int j = 1; j < m; j++) {
    if(j - coins[0] >= 0) dp[0][j] = dp[0][j - coins[0]];
}
```

再來照 Transition Function 更新 table 就好

```cpp
for(int i = 1; i < n; i++){
    for(int j = 0; j < m; j++){
        dp[i][j] = dp[i-1][j];
        if(j - coins[i] >= 0) dp[i][j] += dp[i][j - coins[i]];
    }
}
```

需要注意的是，這題因為過程中數字會被加到很大，所以需要開到 unsigned int int 才會過。

**Time Complexity** - `O(n * m)`<br>
**Space Complexity** - `O(n * m)`

#### **Implementation**

```cpp
int change(int amount, vector<int>& coins) {
    int n = coins.size(), m = amount + 1;
    vector<vector<unsigned long long>>dp(n, vector<unsigned long long>(m, 0));

    dp[0][0] = 1;
    for(int j = 1; j < m; j++) {
        if(j - coins[0] >= 0) dp[0][j] = dp[0][j - coins[0]];
    }

    for(int i = 1; i < n; i++){
        for(int j = 0; j < m; j++){
            dp[i][j] = dp[i-1][j];
            if(j - coins[i] >= 0) dp[i][j] += dp[i][j - coins[i]];
        }
    }

    return dp[n-1][m-1];
}
```

### **空間優化**

Unbounded Knapsack Problem 一次只會關注兩格，所以其實不用開到 2D DP Table 這麼大，可以簡化為 1D

**Time Complexity** - `O(n * m)`<br>
**Space Complexity** - `O(m)`

#### **Implementation**

```cpp
int change(int amount, vector<int>& coins) {
    vector<unsigned long long> dp(amount + 1, 0);
    dp[0] = 1;

    for (int coin : coins) {
        for (int i = coin; i <= amount; ++i) {
            dp[i] += dp[i - coin];
        }
    }

    return dp[amount];
}
```