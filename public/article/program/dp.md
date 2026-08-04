---
title: "[ Algorithm ] Dynamic Programming (一) - Introduction | 核心概念與 Leetcode 題型解析"
date: "2025-05-27"
author: James
tags: Algorithm,DP
image: /images/program/algorithm.png
description: "Dynamic Programming (DP) 是一種算法技巧，簡單來說想要求得原問題的最優解，就先往下拆解成小問題，最後把小問題的解組合起來得到原問題的解"
readTime: 2
id: 07c9658c-5d4c-4ff0-996d-dcf44c1a15dd
---

Dynamic Programming (DP) 是一種算法技巧，簡單來說

> 想要求原問題的最優解，就先往下拆解成小問題，最後把小問題的解組合起來得到原問題的解

這聽起來很像 Divide and Conquer，但是不一樣的地方是，DP 的各種小問題之間是有聯繫的，而且有可能會重複，所以我們會需要一個額外的 table `dp[i]` 來儲存這些重複的 state，遇到就可以直接查表。

但想要用 DP，題目本身必須符合以下三大條件：

1. **最優子結構 ( Optimal Subsructure )** - 一個問題的最優解，一定是子問題最優解的組合，換句話說，如果子問題的最優解不一定能推出原問題的最優解，那這題就不能用 DP 來解。
2. **重複子問題 ( Overlapping Subproblems )** - 相同的子問題在遞迴的過程會不斷出現，例如說 Fibonacci 的題目中，`f(3)`, `f(4)`, `f(5)` 會一直被重複呼叫，我們不用每次都重複算，用一個 table 紀錄起來就可以了。
3. **無後效性 ( No Aftereffect )** - 一個子問題的狀態只和前面的 state 有關，和後面的 state 沒有關係，也就是說當決定了一個子問題的解後，前面那些子問題的解都不會被影響到。

## DP 分類

DP 的題目百百種，為了避免看到 DP 題目時腦袋空白，我們可以先將 DP 分組分好，當我們明確知道這個問題是哪一種類型的 DP 時，就比較有個方向可以去想要怎麼做。按照「輸入狀態的結構」跟「狀態轉移的方式」分類，我會喜歡將題目區分成下面幾種常見的類型。

> 1. **Memorization** - 最基礎的 DP，建立 dp[i] 來儲存遞迴中重複的 state
> 2. **Linear DP** - 處理有明確順序性的問題，例如時間、序列、位置。通常用 1D 或是 2D 的 dp table 表示。
> 3. **Knapsack Problem** - 經典的背包問題，負責處理「選 / 不選」的組合問題。
> 4. **Interval DP** - 負責處理一段區間的問題，利用 dp[i][j] 來代表「區間 i ~ j」
> 5. **Digit DP** - 負責處理跟數位有關的問題，數位指的是個位、十位、百位等等這種
> 6. **Counting DP** - 負責處理計數類的問題

接下來我一個分類會寫一篇文章，把每一個細節都徹底交代。

[[ Algorithm ] Dynamic Programming (二) - Memorization | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/dp-memo/)<br>
[[ Algorithm ] Dynamic Programming (三) - Linear DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/linear-dp/)<br>
[[ Algorithm ] Dynamic Programming (四) - Knapsack Problem | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/knapsack-problem/)<br>
[[ Algorithm ] Dynamic Programming (五) - Interval DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/interval-dp/)<br>
[[ Algorithm ] Dynamic Programming (六) - Digit DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/digit-dp/)<br>
[[ Algorithm ] Dynamic Programming (七) - Counting DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/counting-dp/)
