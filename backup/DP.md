---
title: "[ Algorithm ] Dynamic Programming - Linear DP | 核心概念與 Leetcode 題型解析"
date: "2025-04-20"
author: James
tags: Algorithm,DP,Linear DP
image: /images/program/algorithm.png
description: "Greedy Algorithm 最核心的價值就是每一步都選擇當前狀況下最優的選擇，期望能夠得到全局最優解，這種算法不考慮未來的後果，只專注於當前的局部最優解。"
readTime: 2
---



### 線性 DP ( Linear DP )

Linear DP 是什麼呢？簡單來說，就是

> 當一個問題可以被分成「線性順序」的多個階段，而每個階段只依賴前面幾個階段的狀態，就是 Linear DP

「線性順序的階段劃分」意思是把整個問題按照時間或是位置，依照一條線的順序劃分成多個階段，例如說第一天、第二天...，或是第一個位置、第二個位置...，用 Transition Function 來看，我們會需要一個 dp[i]，對於每一個 i 來說，狀態的更新是需要利用前面的資訊來更新的，例如：

```
dp[i] = max(dp[i-1], dp[i-2] + nums[i])
dp[i][j] = dp[i-1][j] + dp[i][j-1]
```

按照輸入的狀態可以分成下面幾種類型：Single Sequence, Two Sequences, Grid DP, 還有 No Sequence，下面會一一舉例介紹：

### **Linear DP - Single Sequence**

在處理只有一個序列的 DP，通常只會需要 1D 的 dp table，這種可以統稱為 Single Sequence Linear DP，那最常見的兩種 dp[i] 的定義方式如下：

> 1. 「以 nums[i] 為結尾的子序列」組成的解<br>
> 2. 「以 nums 中前 i 個元素」組成的的解

第一種「以 nums[i] 為結尾的子序列組成的解」最經典的例子就是 [ Leetcode 300 ] Longest Increasing Subsequence，在更新完 dp[i] 之後我們可以得到以每一個 nums[i] 為結尾的 subsequence 的解，所以所求就是 dp[i] 之中最大的，因此 Transition Function 如下：

```cpp
for(int i=1; i<n; i++) {
    for(int j=0; j<i; j++) {
        if(nums[i]>nums[j]){
            dp[i] = max(dp[j]+1, dp[i]);
        }
    }
}
```

最後要的答案是 dp[i] 中最大的

```cpp
return *max_element(dp.begin(), dp.end());
```

第二種「以 nums 中前 i 個元素組成的的解」其中一個例子就是 [ Leetcode 213 ] House Robber II，所以更新完 dp[i] 之後最終結果就是 dp[i] 的最後一個 (dp[n-1])，因為我們沒有限制每一個 dp[i] 的解都要包含 nums[i]。

### **Linear DP - Two Sequences**

在輸入狀態為兩個序列的 DP，通常就會需要 2D 的 dp table，這種我都將他歸類成 Two Sequences Linear DP，那最常見的兩種 dp[i][j] 的定義方式如下：

> 1. 「以 nums1[i] 為結尾的子序列」與「以 nums2[j] 為結尾的子序列」組成的解<br>
> 2. 「以 nums1 中前 i 個元素」與「以 nums2 中前 j 個元素」組成的解

第二種「以 nums1 中前 i 個元素與以 nums2 中前 j 個元素組成的解」其中一個例子就是 [ Leetcode 72 ] Edit Distance，所以更新完 dp[i][j] 之後最終結果就是 dp[i][j] 的最後一個 (dp[n-1][m-1])，因為我們沒有限制每一個 dp[i][j] 的解都要包含 nums1[i] 跟 nums2[j]。

### **Linear DP - Grid DP**

在輸入為一個 2D 的 Matrix 時，通常就會需要一個 2D 的 dp table，這種可以歸類成 Grid DP，最常見的 dp[i][j] 的定義如下：

> 從位置 (0, 0) 到位置 (i, j) 的解

[ Leetcode 221 ] Maximal Square 就是一個滿好的例子，這題的題目要求是：

> 給一個 `m × n` 的 matrix，其中：
> 
> '1' 表示該位置可以成為正方形的一部分<br>
> '0' 表示該位置不能形成正方形
> 
> 找出 matrix 中只包含 '1' 的最大正方形，並返回其面積（即邊長的平方）。

用 Grid DP dp[i][j] 的定義來想，可以定義 dp[i][j] 為「以 matrix[i][j] 為右下角的最大正方形邊長」，然後就可以寫出 Transition Function

```cpp
dp[i][j] = min(dp[i-1][j-1], min(dp[i-1][j], dp[i][j-1])) + 1;
```

### **Linear DP - No Sequence**

最後一種 Linear DP，就是如果問題的輸入沒有明確的形式，但是還是可以分成很多子 DP 問題的話，就可以被歸類成 No Sequence 的 Linear DP 問題，這種 dp[i] 就比較沒有規則可言，但是按照我目前的經驗來說，如果完全沒有想法可以先把 dp[i] 設為「題目所求」，常常就可以寫出相對應的 Transition Function。

以 [ Leetcode 343 ] Integer Break 為例，題目是

> 給定一個正整數 n，將其拆分為至少兩個正整數的和，並 return 這些數的最大乘積。

如果看到題目沒甚麼想法但暫時把他歸類為 Linear DP - No Sequence，這樣的話 dp[i] 的定義可以先想成「i 被拆分為兩個正整數的和的最大乘積」，也就是最直覺的題目所求，然後我們就會發現我們就已經可以寫出 Transition Function 了

```cpp
for(int i=2; i<=n; i++){
    for(int j=1; j<i; j++){
        dp[i] = max(dp[i], max(j*(i-j), j*dp[i-j]));
    }
}
```

### **區間 DP**

```cpp
dp[i][j] = max(dp[i+1][j-1], dp[i+1][j], dp[i][j-1]) + cost[i][j]
```

```cpp
dp[i][j] = max/min(dp[i][k] + dp[k+1][j] + cost[i][j])
```





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
