---
title: "[ Algorithm ] Dynamic Programming (二) - Memorization | 核心概念與 Leetcode 題型解析"
date: "2025-06-03"
author: James
tags: Algorithm,DP,Memorization
image: /images/program/algorithm.png
description: "最基礎的 DP，就是從遞迴講起，有一種題目一看就是用遞迴解，但是如果就只有這樣的話會碰到很多重複的狀態，因此大大增加時間複雜度，舉一個最經典的例子，我們要計算一個 Fibonacci 數列的第 n 為的數字，最簡單的方式就是遞迴："
readTime: 2
---

最基礎的 DP，就是從遞迴講起，有一種題目一看就是用遞迴解，但是如果就只有這樣的話會碰到很多重複的狀態，因此大大增加時間複雜度，舉一個最經典的例子，我們要計算一個 Fibonacci 數列的第 n 為的數字，最簡單的方式就是遞迴：

```cpp
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```

但是這樣做會遇到很大的問題，舉例來說，紅色圈起來的這塊被重複計算到了，實際上他們做的是一樣的事情

<figure>
  <img src="/images/program/dp-memo/fibonacci.png" alt="Memo" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    Fibonacci 中重複計算的部分
  </figcaption>
</figure>

所以我們可以建表，建立一個 dp[i]，儲存已經計算過的部分，當遇到已經被計算過的就直接去 dp[i] 裡面拿，就不用重新遞迴計算一次，像這樣：

```cpp
int fib(int n, vector<int>& dp) {
    if (n <= 1) return n;

    if (dp[n] != -1) return dp[n];
    dp[n] = fib(n - 1, dp) + fib(n - 2, dp);

    return dp
}
```

### **DP 其他系列文章**

[[ Algorithm ] Dynamic Programming (一) - Introduction | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/dp/)<br>
[[ Algorithm ] Dynamic Programming (三) - Linear DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/linear-dp/)<br>
[[ Algorithm ] Dynamic Programming (四) - Knapsack Problem | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/knapsack-problem/)<br>
[[ Algorithm ] Dynamic Programming (五) - Interval DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/interval-dp/)<br>
[[ Algorithm ] Dynamic Programming (六) - Digit DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/digit-dp/)<br>
[[ Algorithm ] Dynamic Programming (七) - Counting DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/counting-dp/)