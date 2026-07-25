---
title: "[ Leetcode 312 ] Burst Balloons | 解題思路分享"
date: "2025-06-29"
author: James
tags: Array,DP
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: 0b4a27e2-c38e-4a3e-bbb3-26806f637ede
---

你面前有一排氣球，每個氣球都有一個編號，存放在 `nums` 陣列中，每次你可以戳破一顆氣球，獲得的金幣數是：

> nums[i - 1] * nums[i] * nums[i + 1]

如果 `i-1` 或 `i+1` 超出邊界，則視為 1，目標在戳破所有氣球的過程中，讓你獲得的金幣總數最大。

題目連結 🔗：[https://leetcode.com/problems/burst-balloons/](https://leetcode.com/problems/burst-balloons/)

### **問題分析**

這題是個有點反直覺的 dp，先來看一個範例，如果要計算 `nums = [3, 1, 5, 8]`，假設 dp[interval] 代表這個區間內可以得到的最大 value，我們可以這樣看

```cpp
dp[3, 1, 5, 8] = max(dp[1, 5, 8], dp[3, 5, 8], dp[3, 1, 8], dp[3, 1, 5]) + 3 * 1 * 5 * 8
```

這是最直覺的想法，但是這樣子 dp table 會很難設計，因為所有的區間都被切開了，所以實際上我們不應該先看哪顆氣球最先被戳破，而是先看哪顆氣球最後被戳破。

同樣的陣列，如果最後被戳破的是 5，那 dp[3, 1, 5, 8] 就是這樣

```cpp
dp[3, 1, 5, 8] = dp[3, 1] + 1 * 5 * 1 + dp[8];
```

那這樣設計的話，左邊的區間跟右邊的區間就會是連續且完整的，不會像剛剛一樣可能需要跳著處理，因為 5 號是最後才被戳破，所以不會出現任何跳過 5 號的區間出現，那利用這個思路，我們只要找到所有區間內可以得到的 value 最大的即可。

首先因為最後戳破的氣球旁邊不會有氣球，所以我們要在 `nums` 的頭尾先 insert 1，變成 nums = [1, 3, 1, 5, 8, 1]，而 Transition Function 如下：

```cpp
dp[i][j] = max(dp[i][k] + nums[i] * nums[k] * nums[j] + dp[k][j]) for k in (i+1, j-1)
```

dp[i][j] 代表區間 i ~ j ( 不含 i, j 本身 ) 可以獲得的最大值，那這其實就是 Interval DP 中的一個變形。

[[ Algorithm ] Dynamic Programming (五) - Interval DP | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/interval-dp)

### **解題思路 - Interval DP**

我們會發現大區間都是由小區間得到的，所以更新這個 dp table 要先從小區間開始

```cpp
for(int len = 2; len < n; len++){
    // ...
}
```

再來讓 `j = i + len`，最後 iterate i, j 中間的所有 k 就行了

```cpp
for(int len = 2; len < n; len++){
    for(int i = 0; i + len < n; i++){
        int j = i + len;
        for(int k = i + 1; k < j; k++){
            dp[i][j] = max(dp[i][j], dp[i][k] + nums[i] * nums[j] * nums[k] + dp[k][j]);
        }
    }
}
```

最後回傳答案即可

**Time Complexity** - `O(n^2)`<br>
**Space Complexity** - `O(n^2)`

### **Implementation**
```cpp
int maxCoins(vector<int>& nums) {
    nums.insert(nums.begin(), 1);
    nums.push_back(1);
    int n = nums.size();

    vector<vector<int>>dp(n, vector<int>(n, 0));
    for(int len = 2; len < n; len++){
        for(int i = 0; i + len < n; i++){
            int j = i + len;
            for(int k = i + 1; k < j; k++){
                dp[i][j] = max(dp[i][j], dp[i][k] + nums[i] * nums[j] * nums[k] + dp[k][j]);
            }
        }
    }

    return dp[0][n-1];
}
```