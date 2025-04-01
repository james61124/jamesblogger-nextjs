---
title: "[ Leetcode 70 ] Climbing Stairs | 解題思路分享"
date: "2025-04-01"
author: James
tags: DP
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

有一條階梯，我們只能跳一步或是跳兩步，求我們要跳到第 n 階總共有幾種跳法？

題目連結 🔗：[https://leetcode.com/problems/climbing-stairs/](https://leetcode.com/problems/climbing-stairs/)

### **問題分析**

這題是非常經典的遞迴題目，因為只能走一步或是兩步的關係，假設 f(n) 代表到第 n 格的所有方法數量，那 `f(n) = f(n-1) + f(n-2)`，因為第 n 格只會從 n-1 或是 n-2 跳過來，如果要直接計算這個遞迴可能會計算到很多重複的資訊，所以我們可以利用 dp 建表存下已經計算過的 status，遇到一樣的就可以直接拿來使用。

### **解題思路 - DP**

所以思路清晰，直接建立 dp[i] 代表到第 n 格的所有方法數量，轉換式為 `dp[i] = dp[i - 1] + dp[i - 2];`，其中 dp[1] = 1, dp[2] = 2

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int climbStairs(int n) {
    if (n == 1) return 1;
    vector<int> dp(n + 1);
    dp[1] = 1, dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

### **空間優化**

不過我們會發現每一次 iterate 都只會用到 dp 的其中兩格而已，所以我們可以不用建整條 dp[i]，我們只需要兩個變數就可以了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int climbStairs(int n) {
    if (n == 1) return 1;
    int prev1 = 1, prev2 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev1 = prev2;
        prev2 = curr;
    }
    return prev2;
}
```
