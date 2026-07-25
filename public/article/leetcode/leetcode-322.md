---
title: "[ Leetcode 322 ] Coin Change | 解題思路分享"
date: "2025-06-30"
author: James
tags: Array,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: 20645195-cc56-44cc-84da-910b557fa121
---

給你一個 coins[i]，代表各種硬幣的面額（ 每種面額的硬幣數量無限 ），再給一個 int `amount`，代表你要湊出的金額，請找出最少需要幾枚硬幣，才能剛好湊出 amount。

題目連結 🔗：[https://leetcode.com/problems/coin-change/](https://leetcode.com/problems/coin-change/)

### **問題分析**

這題我們可以換個思維想，他其實是在問說一個限重為 `amount` 的包包，可以利用最少的幾個 coins 裝滿，這樣就可以利用 Knapsack Problem 來解了。

[[ Algorithm ] Dynamic Programming (四) - Knapsack Problem | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/knapsack-problem)

### **解題思路 - Knapsack Problem**

用 Knapsack Problem 來想，我們需要一個 dp[i][j] 代表「前 i 個 coins 最少可以只用幾個來裝滿 `amount`」，而每一個物品都有無限多個可以選，所以實際上這個是 Unbounded Knapsack Problem，根據上面的文章，這類問題會有「不選 / 選 n 次」多種 actions。

先看不選，對於 coins[i] 而言，如果不選 coins[i]，表示這次裝的東西完全由前 i-1 個 coins 組成，所以最少的數量就是 dp[i-1][j]，而如果我們選擇 coins[i]，不管我們選了幾次，背包裡的最小物品數量都會是「前 i 個 coins 放入限重 j-coins[i] 的背包中最小的數量」再 + 1，因為要加上最後一次的自己，到這裡 Transition Function 就完成了

```cpp
dp[i][j] = min(dp[i-1][j], dp[i][j - coins[i]] + 1);
```

由於我們會需要 i-1 的資訊，所以要先初始化第一排，第一排表示 coins[0] 完全裝入限重 j 的背包中所需的數量，因為這題比的是最小值，所以一開始可以先全部初始化為 `INT_MAX`，而 coins[0] 有可能會出現沒有辦法裝滿背包的情況，那就維持 `INT_MAX` 即可，表示沒有辦法單純利用 coins[0] 組合出 j。

```cpp
int n = coins.size();
int m = amount + 1;
vector<vector<int>>dp(n, vector<int>(m, INT_MAX));

for(int j = 0; j < m; j++){
    if(j % coins[0] == 0){
        dp[0][j] = j / coins[0];
    }
}
```

再來因為 `j-coins[i]` 可能會超過範圍，所以更新的時候檢查一下不要 overflow 即可，而如果前 i 個 coins 沒有辦法組成 j - coins[i]，那自然也沒有辦法組成 j。

```cpp
for(int i = 1; i < n; i++){
    for(int j = 0; j < m; j++){
        int prev = j - coins[i];
        dp[i][j] = dp[i-1][j];
        if(prev >= 0 && dp[i][prev] != INT_MAX) dp[i][j] = min(dp[i][j], dp[i][prev] + 1);
    }
}
```

如果最後一格還是 INT_MAX，表示 coins 沒有辦法組成 `amount`，就要回傳 -1

```cpp
return dp[n-1][m-1] == INT_MAX ? -1 : dp[n-1][m-1];
```

**Time Complexity** - `O(m*n)`<br>
**Space Complexity** - `O(m*n)`

### **Implementation**
```cpp
int coinChange(vector<int>& coins, int amount) {
    int n = coins.size();
    int m = amount + 1;
    vector<vector<int>>dp(n, vector<int>(m, INT_MAX));

    for(int j = 0; j < m; j++){
        if(j % coins[0] == 0){
            dp[0][j] = j / coins[0];
        }
    }

    for(int i = 1; i < n; i++){
        for(int j = 0; j < m; j++){
            int prev = j - coins[i];
            dp[i][j] = dp[i-1][j];
            if(prev >= 0 && dp[i][prev] != INT_MAX) dp[i][j] = min(dp[i][j], dp[i][prev] + 1);
        }
    }

    return dp[n-1][m-1] == INT_MAX ? -1 : dp[n-1][m-1];
}
```

### **空間優化**

Unbounded Knapsack Problem 一次只會關注 dp table 的兩個格子，所以不用宣告整個 dp table，只需要用一個就行了，這邊看完文章應該都可以直接轉換，所以就直接給解法了。

**Time Complexity** - `O(m*n)`<br>
**Space Complexity** - `O(m)`

### **Implementation**
```cpp
int coinChange(vector<int>& coins, int amount) {
    int n = coins.size();
    int m = amount + 1;
    vector<int>dp(m, INT_MAX);

    for(int j = 0; j < m; j++){
        if(j % coins[0] == 0){
            dp[j] = j / coins[0];
        }
    }

    for(int i = 1; i < n; i++){
        for(int j = 0; j < m; j++){
            int prev = j - coins[i];
            if(prev >= 0 && dp[prev] != INT_MAX) dp[j] = min(dp[j], dp[prev] + 1);
        }
    }

    return dp[m-1] == INT_MAX ? -1 : dp[m-1];
}
```