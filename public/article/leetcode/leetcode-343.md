---
title: "[ Leetcode 343 ] Integer Break | 解題思路分享"
date: "2025-03-23"
author: James
tags: DP,Math
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給定一個正整數 n，將其拆分為至少兩個正整數的和，並 return 這些數的最大乘積。

題目連結 🔗：[https://leetcode.com/problems/integer-break/](https://leetcode.com/problems/integer-break/)

### **解題思路 - DP (Non-sequential Linear DP Problems)**

這題的 dp 並不難想，我們用最正常的邏輯來慢慢拆解這題，假如今天 n=4，我們判斷 maximum product 的流程就是 `1*3`、`2*2`、`3*1`，但是 3 可能還可以被拆分，如果今天 n=5，流程就是 `1*4`、`2*3`、`3*2`、`4*1`，但是 4, 3, 2 都可能可以被拆分，這個「被拆分」所需要花的重複時間就可以用 dp 解決。

dp[i] 代表 i 的 maximum product，以 n=5 為例，`1*4` 要判斷 4 還需不需要被拆分，不用一路把他從 1, 2, 3 再拆一次，可以直接判斷 `1*4` 跟 `1*dp[4]` 哪一個大就可以了，再來 loop 跑過 `2*3`、`3*2`、`4*1` 也是一樣概念，所以 dp[i] 就是一路記錄，後面需要用到的時候再直接調出來就可以，寫成 dp 轉換式就是

```cpp
for(int i=2; i<=n; i++){
    for(int j=1; j<i; j++){
        dp[i] = max(dp[i], max(j*(i-j), j*dp[i-j]));
    }
}
```

不過我們就會發現，以 n=5 為例，`1*4`、`2*3`、`3*2`、`4*1` 其中後半段根本就不用再看一次，因為意思是一樣的，所以就可以再縮短 loop 的時間，變成這樣

```cpp
for(int i=2; i<=n; i++){
    for(int j=1; j<=i/2+1; j++){
        dp[i] = max(dp[i], max(j*(i-j), j*dp[i-j]));
    }
}
```

**Time Complexity** - `O( n^2 )`<br>
**Space Complexity** - `O( n )`

#### **Implementation**

```cpp
int integerBreak(int n) {
    vector<int>dp(n+1, 0);
    dp[1] = 1;
    for(int i=2; i<=n; i++){
        for(int j=1; j<=i/2+1; j++){
            dp[i] = max(dp[i], max(j*(i-j), j*dp[i-j]));
        }
    }
    return dp[n];
}
```

### **解法二 - 數學解**

標準解應該是 DP 沒有錯，但是這題可以用數學角度切入，時間複雜度直接變成 O(1)，也不用開 dp 的空間。這題的核心思想就是我們要將 `n` 拆分成最多的 `3`，下面我來證明這件事情。

#### **為什麼拆分後不會出現大於 4 的數字**

假設今天有一個 x >= 4，他在拆分成 `2 * (x-2)` 時一定會比 x 本身還要大，因為 `2(x-2)>=4` 這條不等式在 x>=4 時是恆等式，所以拆分之後只會出現很多的 2 跟 3。

#### **要如何選擇 2 還是 3**

在所有的拆分中，`2` 的數量絕對不會 >= 3，因為 `2*2*2 < 3*3`，所以遇到可以拆分成三個 2 的情況，還不如直接選擇拆成兩個 3。

利用這兩個思路，我們可以制定出以下的規則：

```
1. 當 n % 3 == 0，那就全部都拆成 3
2. 當 n % 3 == 1，拆成 2 * 2，後面全部都是 3
3. 當 n % 3 == 2，拆成一個 2，其他全部都放 3
```

**Time Complexity** - `O( 1 )`<br>
**Space Complexity** - `O( 1 )`

#### **Implementation**

```cpp
int integerBreak(int n) {

    if(n == 2) return 1;
    if(n == 3) return 2;

    if(n % 3 == 0) return pow(3, n/3);
    else if(n % 3 == 1) return 2*2*pow(3, n/3-1);
    else return 2*pow(3, n/3);

}
```