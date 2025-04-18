

### 線性 DP

Linear DP 是什麼呢？簡單來說，就是

> 當一個問題可以被分成「線性順序」的多個階段，而每個階段只依賴前面幾個階段的狀態，就是 Linear DP

「線性順序的階段劃分」意思是把整個問題按照時間或是位置，依照一條線的順序劃分成多個階段，例如說第一天、第二天...，或是第一個位置、第二個位置...，用 Transition Function 來看，我們會需要一個 dp[i]，對於每一個 i 來說，狀態的更新是需要利用前面的資訊來更新的，例如：

```
dp[i] = max(dp[i-1], dp[i-2] + nums[i])
dp[i][j] = dp[i-1][j] + dp[i][j-1]
```

按照輸入的狀態可以分成下面幾種類型：Single Sequence, Two Sequences, Grid DP, 還有 No Sequence，下面會一一舉例介紹：

### Linear DP - Single Sequence

在處理只有一個序列的 DP，通常只會需要 1D 的 dp table，這種可以統稱為 Single Sequence Linear DP，那最常見的兩種 dp[i] 的定義方式如下：

> 1. 以 nums[i] 為結尾的 subarray / subsequence 的解
> 2. 以 nums 中前 i 個元素組成的 subarray / subsequence 的解

第一種「以 nums[i] 為結尾的解」最經典的例子就是 [ Leetcode 300 ] Longest Increasing Subsequence，在更新完 dp[i] 之後我們可以得到以每一個 nums[i] 為結尾的 subsequence 的解，所以所求就是 dp[i] 之中最大的。

第二種「取 nums 中前 i 個元素的解」其中一個例子就是 [ Leetcode 213 ] House Robber II，所以更新完 dp[i] 之後最終結果就是 dp[i] 的最後一個 (dp[n-1])，因為我們沒有限制每一個 dp[i] 的解都要包含 nums[i]。



300
53
873

雙串 DP

1143
718
72

矩陣線性 DP

64

沒規律 DP

650


0-1 背包問題
416

區間 DP

516

樹形 DP

124
