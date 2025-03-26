---
title: "[ Leetcode 279 ] Perfect Squares | 解題思路分享"
date: "2025-03-25"
author: James
tags: DP,Math
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個正整數 n，請找出最少需要幾個完全平方數 (Perfect Squares) 之和，才能表示該數字 n。

題目連結 🔗：[https://leetcode.com/problems/perfect-squares/](https://leetcode.com/problems/perfect-squares/)

### **問題分析**

分析一下這題，暴力解應該是每一個小於 n 的平方數都可以不選或是選很多次，這樣我們可以用 dfs 跑過每一種狀況找出最小的組合，但這樣我們會看到很多重複的 state，所以判斷可以用 dp 來記錄這個重複的 state。

### **解題思路 - DP(Unbounded Knapsack Problem)**

先判斷剛剛重複的部分，因為 n 在做完一個平方數 `x^2` 會變成 n-x^2，所以相同的 `n - x^2` 可能會重複多次計算，這個是可以建表的。而題目是問最少可以組成正整數 n 的平方數組合，dp[i][j] 可以用最直覺的方法，代表數字 i 利用前 j 個平方數組成的最小數量是多少，這其實就是 Unbounded Knapsack Problem，數字 j 可以放無限多次，但是不可以放超過 i，比較不一樣的只是我們要紀錄最小的 i 的數量。

根據 Unbounded Knapsack Problem，我們可以寫出以下的 Transition Function：

```cpp
dp[i][j] = min(dp[i-1][j], dp[i][j-i*i]+1);
```

如果 i 不選，就是沿用「前 `i-1` 個平方數填數字 `j` 的結果」，也就是 `dp[i-1][j]`，但如果選，表示我們需要用「前 `i` 個平方數填數字 `j-i*i` 的結果」+ 1，因為這樣加上來才會是 j，要注意的是這裡的 Transition Function 跟 0/1 Knapsack Problem 很像但是不一樣，不能搞混了。

第一個 row 因為數字 j 只能用 1^2 填的話，一定是 j 個，所以先初始化成這樣：

```cpp
for(int j=1; j<dp[0].size(); j++){
    dp[1][j] = j;
}
```

後面就是按照 Transition Function 寫，右下角那格就是答案。

**Time Complexity** - `O(n*sqrt(n))`<br>
**Space Complexity** - `O(n*sqrt(n))`

#### **Implementation**

```cpp
int numSquares(int n) {
    vector<vector<int>>dp(sqrt(n)+1, vector<int>(n+1, 0));
    for(int j=1; j<dp[0].size(); j++){
        dp[1][j] = j;
    }

    for(int i=2; i<dp.size(); i++){
        for(int j=1; j<dp[0].size(); j++){
            if(j-i*i<0) dp[i][j] = dp[i-1][j];
            else dp[i][j] = min(dp[i-1][j], dp[i][j-i*i]+1);
        }
    }

    return dp[sqrt(n)][n];
}
```

### **空間優化 - 1D DP**

我們可以看到 Unbounded Knapsack Problem 一次只用到兩個 rows 而已，所以我們可以用 1D Array 就紀錄完 dp，只是這邊要注意的是 Unbounded Knapsack Problem 因為同一個 item 可以放無限多次，所以更新 1D Array 的時候要正著更新，不能像 0/1 Knapsack Problem 一樣反著更新。

**Time Complexity** - `O(n*sqrt(n))`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int numSquares(int n) {

    vector<int>dp(n+1, INT_MAX);

    dp[0] = 0;
    for(int i=1; i<=sqrt(n); i++){
        for(int j=0; j<dp.size(); j++){
            if(j-i*i>=0) dp[j] = min(dp[j], dp[j-i*i]+1);
        }
    }

    return dp[dp.size()-1];

}
```

### **另一種思路 - 數學解**

很遺憾這題有數學解，就是一個沒有學過就完全不知道的解法，這邊就打起來供參考。

這題用到兩個定理：
1. **Lagrange's Four Square Theorem** - 任何正整數都可以表示為最多 4 個平方數之和
2. **Legendre's Three Square Theorem** - 唯有 n = (4^a)*(8b+7) 時，n 需要 4 個平方數才能表示

也就是說，不管任何數字 n，我們的答案僅有可能是 1, 2, 3, 4，分析起來就是這樣：
1. 只有完全平方數答案才會是 1
2. 可以跑一個單層 loop 看有沒有數字 `i` 可以讓 `n-i*i` 也是完全平方數，如果是的話那答案就是 2
3. 當 `n = (4^a)*(8b+7)` 時，答案才會是 4
4. 剩下的全部都是 3

**Time Complexity** - `O(sqrt(n))`，只有在找 2 的時候跑了一個 loop <br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
bool isPerfectSquare(int n) {
    int sqrt_n = sqrt(n);
    return sqrt_n * sqrt_n == n;
}

int numSquares(int n) {

    if (isPerfectSquare(n)) return 1;

    for (int i = 1; i * i <= n; ++i) {
        if (isPerfectSquare(n - i * i)) return 2;
    }

    while (n % 4 == 0) n /= 4;
    if (n % 8 == 7) return 4;

    return 3;

}
```
不過等到我看懂了我再回頭補上證明，總有一些地方看不懂。