---
title: "[ Algorithm ] Dynamic Programming (五) - Interval DP | 核心概念與 Leetcode 題型解析"
date: "2025-06-01"
author: James
tags: Algorithm,DP,Interval DP
image: /images/program/algorithm.png
description: "狀態描述如果是一個區間的 DP，沒有特別整理過第一次遇到都會想不太到，這邊整理了兩種遇到 Interval DP 可以去思考的方向。"
readTime: 2
---

狀態描述如果是一個區間的 DP，沒有特別整理過第一次遇到都會想不太到，這邊整理了兩種遇到 Interval DP 可以去思考的方向。

Interval DP 的 dp[i][j] 定義都是「區段 i ~ j 中間的最佳解」，但是從 dp[i][j] 的來源可以分成以下兩種：「從中間向兩側轉移的 Interval DP」還有「從多個小區間轉移到大區間的 Interval DP」

### **第一種 - 從中間向兩側轉移的 Interval DP**

用 Transition Function 表示可以寫成這樣

```cpp
dp[i][j] = max(dp[i+1][j-1], dp[i+1][j], dp[i][j-1]) + cost[i][j]
```

對於區間 i ~ j 來說，他的來源可能會從三種區段得到 `i+1 ~ j-1`, `i ~ j-1`, `i+1 ~ j`，取出最大的再加上組合起來需要的 cost 就會是 dp[i][j]，[ Leetcode 516 ] Longest Palindromic Subsequence 就是一個很經典的例子，題目如下：

> 給一個 string `s`，找出最長的 palindromic subsequence 長度，注意 subsequence 不用連續，順序不變就好。

所以對於區段 i ~ j 來說，答案可能會從 `i+1 ~ j-1`, `i ~ j-1`, `i+1 ~ j` 三個地方來，如果 `s[i] == s[j]`，表示 dp[i][j] 就是區段 `i+1 ~ j-1` 的答案 + 2，因為不管這個區段的 palindromic 多長，都可以再往外加上這兩個字，但如果 `s[i] != s[j]`，表示 dp[i][j] 會是從 `i ~ j-1`, `i+1 ~ j` 這兩個區段中比較大的那個來的，所以 Transition Function 長這樣：

```cpp
if(s[i] == s[j]) dp[i][j] = 2 + dp[i+1][j-1];
else dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
```

所以這種題目的新關鍵就是，區段 i ~ j 的答案會從三個地方來，`i+1 ~ j-1`, `i ~ j-1` 或 `i+1 ~ j`，再來想清楚 Transition Function 即可。

[[ Leetcode 516 ] Longest Palindromic Subsequence | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-516/)

### **第二種 - 從多個小區間轉移到大區間的 Interval DP**

用 Transition Function 表示可以寫成這樣：

```cpp
dp[i][j] = max/min(dp[i][k] + dp[k+1][j] + cost[i][j])
```

其中 k 是 i ~ j 中間的所有點，也就是說我們利用中間所有 k 點把區間 i ~ j 切成兩段，區間 i ~ j 的來源就是這些可能性中最好的，[ Leetcode 1547 ] Minimum Cost to Cut a Stick 就是很好的例子，題目如下：

> 有一根長度為 n 的木棍，並且你有一個整數陣列 cuts，其中 cuts[i] 表示你需要在位置 cuts[i] 上切這根木棍。每次切割會將木棍切成兩段，切割的成本等於這次被切的那段木棍的長度。目標是決定一個切割順序，讓總成本最小，並回傳成本。

對於 Interval DP 來說，我們會需要一個 dp[i][j]，舉個例子：

```cpp
n = 7, cuts = [1,3,4,5]
```

我們最後要的答案就是 dp[0][7]。

再來就是要想辦法找到 Transition Function，想到這裡我們就會發現，dp[i][j] 其實沒有辦法每一格都更新，舉例來說根本就不會出現 dp[1][2] 這種線段，因為 cuts 沒有辦法切在 2 的位置，所以我們要找到所有可行的線段中，該怎麼更新 dp[i][j]。

先簡化問題，如果看到 dp[0][1], dp[1][3], dp[3][4] 等等，這種都是沒有辦法切的，所以 dp[i][j] 就應該是 0。

再來如果看到 dp[0][3], dp[1][4] 這種中間可以切一刀的，因為只有一種可能性，所以 dp[i][j] 就是 (j-i)。

再往外看一點，如果看到 dp[0][4], dp[1][5] 這種中間可以切兩刀的，因為有兩種可能性，所以開始來思考 Transition Function 應該怎麼下手，以 dp[0][4] 來說，第一刀如果切在 1，那 cost 就會是 (4-0) 加上 dp[1][3] 的 cost，那如果第一刀切在 3，那 cost 就會是 (4-0) 加上 dp[0][3]，然後取這兩種 cost 的最小值，所以 Transition Function 我們就可以寫出一個最陽春的版本，對於每一個在 i, j 中間的 k，

```cpp
dp[i][j] = min(dp[i][k] + dp[k][j] + (j - i))
```

用剛剛的例子來想就合理了，因為 dp[0][1] 跟 dp[1][3] 這種不能切的都是 0

```cpp
dp[0][4] = dp[0][1] + dp[1][3] + (4 - 0) = 0 + 2 + 4 = 6 // k = 1
         = dp[0][3] + dp[3][4] + (4 - 0) = 3 + 0 + 4 = 7 // k = 3
dp[0][4] = min(6, 7) = 6
```

這種題目的關鍵在於 dp[i][j] 來自於 i ~ j 中間的每一個 k，所以從每個 k 中找出 max/min(dp[i][k] + dp[k+1][j] + cost[i][j]) 就可以解出 Transition Function 了。

[[ Leetcode 1547 ] Minimum Cost to Cut a Stick | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-1547/)

### **DP 其他系列文章**

[[ Algorithm ] Dynamic Programming (一) - Introduction | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/dp/)<br>
[[ Algorithm ] Dynamic Programming (二) - Memorization | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/memorization/)<br>
[[ Algorithm ] Dynamic Programming (三) - Linear DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/linear-dp/)<br>
[[ Algorithm ] Dynamic Programming (四) - Knapsack Problem | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/knapsack-problem/)<br>
[[ Algorithm ] Dynamic Programming (六) - Digit DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/digit-dp/)<br>
[[ Algorithm ] Dynamic Programming (七) - Counting DP | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/counting-dp/)