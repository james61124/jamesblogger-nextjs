---
title: "[ Algorithm ] Dynamic Programming (三) - 背包問題 | 核心概念與 Leetcode 題型解析"
date: "2025-04-20"
author: James
tags: Algorithm,DP
image: /images/program/algorithm.png
description: ""
readTime: 2
---

背包問題是一種很經典的 DP 問題，敘述如下：

> 有一個背包，他最多可以容納總重 W 的物品，而我總共有 n 個物品，每個物品的重量為 w[i]，價值為 v[i]，請選擇一組放物品的方法讓背包內的重量不會超重且價值最大化。

當然題目不會都這樣出，大部分題目都會包裝過，不過如果問題核心都是背包問題的話，那就會有一套很完整的解題流程。那根據不同類型，我們還可以將背包問題分類，

1. 0/1 Knapsack Problem：每個物品只有一個，也就是說每個物品只能選擇「放 / 不放」。
2. Unbounded Knapsack Problem
3. Bounded Knapsack Problem



### **0/1 Knapsack Problem**

> 有 n 種物品和只能裝 W 的背包，第 i 種 item 的重量和價值分別是 w[i], v[i]，每種物品只有一個，要求不超過限重的情況下背包能裝的最大 value 是多少。

這是最經典的背包問題，換句話說，每一種物品只有「放 / 不放」兩種狀態。dp[i][j] 的定義是「前 i 個物品放入限重為 j 的背包中最大的 value」，也就是說我們最後要的答案就是 dp[n-1][m-1]，dp 的右下角那一格。

對於每一個 item `i` 來說，我們有「選 / 不選」兩種 actions，所以 dp[i][j] 會從兩個地方來，如果 item i 不選的話，dp[i][j] 就是 dp[i-1][j]，等於說「前 i-1 個物品放入限重 j 的背包中最大的 value」，那如果 item i 要選的話，dp[i][j] 就是 dp[i][j-w[i]] + v[i]，也就是說「前 i 個物品放入限重 j-w[i] 的背包中最大的 value」再加上 item i 自己的 value，因為限重 j-w[i] 在放入 item i 之後裡面的東西確定可以放入限重為 j 的背包，所以我們的 Transition Function 就是

```cpp
dp[i][j] = max(dp[i-1][j], dp[i][j-w[i]] + v[i])
```



### Unbounded
279

### **Bounded Knapsack Problem**

> 有 n 種物品和只能裝 W 的背包，第 i 種 item 的重量是 weight[i], value 是 value[i], 數量上限是 count[i]，要求不超過限重的情況下背包能裝的最大 value 是多少。

這個問題跟 0/1, Bounded 不一樣的地方在於每件 item 都有固定數量，而且每件還不一樣。

#### **2D DP**

參考前面的思路，所以對於每一個 item `i` 來說，我們有我們有「不選 / 選 1 個 / 選 2 個 / ... / 選 count[i] 個」的這些 actions，dp[i][j] 用來描述「前 i 個 items 在限重 j 的背包中可以裝的最大 value」，我們可以根據這些寫出我們的 Transition Function :

```cpp
for (int k = 0; k <= count[i - 1] && k * weight[i - 1] <= j; k++) {
    dp[i][j] = max(dp[i][j], dp[i - 1][j - k * weight[i - 1]] + k * value[i - 1]);
}
```

`k` 表示選擇 item 的個數，`k=0` 表示不選，Transition Function 是 `dp[i][j] = max(dp[i][j], dp[i - 1][j])`，也就是 `dp[i][j] = dp[i - 1][j]`，直接拿「前 i-1 個 items 在限重 j 的背包中可以裝的最大 value」的結果就行了。

而選了 k 個物品，Transition Function 是 `dp[i - 1][j - k * weight[i - 1]] + k * value[i - 1]`，我們需要拿 `dp[i - 1][j - k * weight[i - 1]]` 的資料，j 減掉 k 個 item i 的 weight 意思是「前 i-1 個 items 在限重 j - k * weight[i - 1] 的背包中可以裝的最大 value」，然後加上 `k * value[i - 1]`，也就是 k 個自己的 value，dp[i][j] 要填的是所有 k 中讓 dp[i][j] 最大的。

至於為什麼 weight, value 都是 i-1，dp 是 i？是因為 weight, value 是 0-based 的，item 1 的值會存在 index 0 的位置，而 dp 是 1-based 的，不要搞錯了。

O(n × capacity × max(count[i]))
空間複雜度：O(n × capacity)

```cpp
int boundedKnapsack(int capacity, vector<int>& weight, vector<int>& value, vector<int>& count) {
    int n = weight.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= capacity; j++) {
            for (int k = 0; k <= count[i - 1] && k * weight[i - 1] <= j; k++) {
                dp[i][j] = max(dp[i][j], dp[i - 1][j - k * weight[i - 1]] + k * value[i - 1]);
            }
        }
    }
    return dp[n][capacity];
}
```

#### **1D DP**

當然我們可以優化，因為 Knapsack Problem 只會用到 dp 的兩個 rows，所以用 dp[i] 來存數據就可以了。

O(n × capacity × max(count[i]))
空間複雜度：O(capacity)

```cpp
int boundedKnapsack(int capacity, vector<int>& weight, vector<int>& value, vector<int>& count) {
    int n = weight.size();
    vector<int> dp(capacity + 1, 0);

    for (int i = 0; i < n; i++) {
        for (int j = capacity; j >= 0; j--) {
            for (int k = 1; k <= count[i] && k * weight[i] <= j; k++) {
                dp[j] = max(dp[j], dp[j - k * weight[i]] + k * value[i]);
            }
        }
    }
    return dp[capacity];
}
```

#### **Binary Optimization**

然而 Bounded Knapsack Problem 不像 Unbounded Knapsack Problem 可以減少一層迴圈的數量，我們還是需要三層的 loop，但是我們可以用 Binary 的技巧大幅降低迴圈時間。

在 k 這層迴圈中，我們必須 iterate c[i] 次，但是如果我們將 c[i] 轉成 Binary 數量的組合，將這些組合視為新的虛擬 item，那可以大幅降低 count 的數量，舉例來說

c[i] = 13 = 0b1101，13 用 Binary 表示是：

```
13 = 2^0 + 2^2 + 2^3 = 1 + 4 + 8
```

所以所以我們可以將這個物品拆成三個新物品

- `w = w[i]*1`, `v = v[i]*1`, `c = 1`
- `w = w[i]*4`, `v = v[i]*4`, `c = 1`
- `w = w[i]*8`, `v = v[i]*8`, `c = 1`

原因是因為我們用 1, 4, 8 可以組合出任何 1~13 的數字，這樣原本 loop 需要看 13 次，就可以縮減為 3 次了。


O(n × capacity × log(count[i]))
空間複雜度：O(capacity)

```cpp
int boundedKnapsack(int capacity, vector<int>& weight, vector<int>& value, vector<int>& count) {
    int n = weight.size();
    vector<int> dp(capacity + 1, 0);

    for (int i = 0; i < n; i++) {
        int w = weight[i], v = value[i], c = count[i];
        
        // 將 count[i] 拆解為二進制組合
        for (int k = 1; c > 0; k <<= 1) {
            int quantity = min(k, c);  // 防止超過剩餘數量
            c -= quantity;

            // 0/1 背包更新，注意這裡要倒序遍歷
            for (int j = capacity; j >= quantity * w; j--) {
                dp[j] = max(dp[j], dp[j - quantity * w] + quantity * v);
            }
        }
    }
    return dp[capacity];
}
```