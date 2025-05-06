---
title: "[ Algorithm ] Dynamic Programming (六) - Counting DP | 核心概念與 Leetcode 題型解析"
date: "2025-04-20"
author: James
tags: Algorithm,DP
image: /images/program/algorithm.png
description: ""
readTime: 2
---

Counting DP 有別於一般 DP 求最大值 / 最小值，他主要是用來計算某種「方法數」、「組合數」、「路徑數」等結果的總數，所以 Transition Function 是用加法轉移的，不是 max() 或是 min()。

這種題目一般會朝兩個方向解題：

> 1. 推導出 Transition Function 然後用 DP 解
> 2. 轉成數學問題直接用數學公式解題

很多時候 DP 會是首選，因為數學公式不一定好想，而且推導出來之後大數的計算也會是個問題，所以雖然數學解會快很多，但 DP 的解法通常比較直覺也比較好想一點，底下舉幾個例子：

最經典的就是 [ Leetcode 62 ] Unique Paths，題目說

> 給一個 `m × n` 的 Matrix，一個機器人從左上角 (0,0) 出發，每次只能向右或向下移動，最終到達右下角 (m-1, n-1)，問有多少條不同的路徑？

DP 解法非常簡單，可以觀察到 Transition Function 就不像以前是用 min() / max()，而是用加法的

```cpp
dp[i][j] = dp[i-1][j] + dp[i][j-1]
```

那當然這題也有數學解，`C(m-1+n-1, n-1)` 就是答案，只不過直接計算的話一定會 overflow，所以我們需要小心處理 Combination 計算的過程，詳細內容就直接看底下這題的介紹就可以了。