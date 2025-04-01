---
title: "[ Leetcode 62 ] Unique Paths | 解題思路分享"
date: "2025-04-01"
author: James
tags: Math,DP,Combinatorics
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 `m × n` 的 Matrix，一個機器人從左上角 (0,0) 出發，每次只能向右或向下移動，最終到達右下角 (m-1, n-1)，問有多少條不同的路徑？

題目連結 🔗：[https://leetcode.com/problems/unique-paths/](https://leetcode.com/problems/unique-paths/)

### **問題分析**

這種算總路徑和的題目如果用 DP 解就是建個 dp[i][j] 代表從左上角的格子走到 (i, j) 總共的路徑數量，所以對於每個 dp[i][j] 把左邊跟上面的格子加起來變成自己，邊邊因為只有一條可以到所以都設 1，這樣一路加到右下角就是答案了，轉換式為 `dp[i][j] = dp[i-1][j] + dp[i][j-1]`。

但是 dp 解我覺得不是這題最大的價值，因為這個大家都想得到，所以我就不特別紀錄了，這題應該是排列組合中「同物排列」的問題，我們直接來看數學解要怎麼寫。

### **解題思路 - Math**

簡單來說以 `m = 5, n = 7` 為例，相當於路徑中我們有 m-1 個 `→` 跟 n-1 個 `↓` 要做排列組合，最後組合出多少種路徑就是我們的答案，所以 C(m-1+n-1, n-1) 就是我們的答案。

接下來才是這題的關鍵，如果直接像數學計算一樣直接把階乘爆開一定會 overflow，所以我們要在乘法的過程中就先除掉分母的一些數字，舉例來說，這題我們的式子把 n-1 約分掉之後是這樣：

```
(10 * 9 * 8 * 7) / (1 * 2 * 3 * 4)
```

如果乘到 10 的時候就先約分掉 1，乘到 9 的時候先約分掉 2，乘到 8 的時候先約分掉 3，這樣分子的階乘就不會一直保持在很大的狀況了。那為什麼這樣約分是可以的呢？因為分子是逐步遞減的，也就是說前 i 個數字相乘一定會有 i 這個因數存在，而這就是這題的關鍵！

```cpp
for (int i = 1; i <= small; i++) {
    res = res * (m + n - 1 - i) / i;
}
```

**Time Complexity** - `O(1)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int uniquePaths(int m, int n) {
    long long res = 1;
    int small = min(m - 1, n - 1);
    for (int i = 1; i <= small; i++) {
        res = res * (m + n - 1 - i) / i;
    }
    return res;
}
```
