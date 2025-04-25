

狀態描述如果是一個區間的 DP，沒有特別整理過第一次遇到都會想不太到，這邊整理了兩種遇到 Interval DP 可以去思考的方向。

Interval DP 的 dp[i][j] 定義都是「區段 i ~ j 中間的最佳解」，但是從 dp[i][j] 的來源可以分成以下兩種：

> 第一種 - 從中間向兩側轉移的 Interval DP

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

> 第二種 - 從多個小區間轉移到大區間的 Interval DP

用 Transition Function 表示可以寫成這樣：

```cpp
dp[i][j] = max/min(dp[i][k] + dp[k+1][j] + cost[i][j])
```

其中 k 是 i ~ j 中間的所有點，也就是說我們利用中間所有 k 點把區間 i ~ j 切成兩段，區間 i ~ j 的來源就是這些可能性中最好的，[ Leetcode 1547 ] Minimum Cost to Cut a Stick 就是很好的例子，題目如下：

> 有一根長度為 n 的木棍，並且你有一個整數陣列 cuts，其中 cuts[i] 表示你需要在位置 cuts[i] 上切這根木棍。每次切割會將木棍切成兩段，切割的成本等於這次被切的那段木棍的長度。目標是決定一個切割順序，讓總成本最小，並回傳成本。







516



1547