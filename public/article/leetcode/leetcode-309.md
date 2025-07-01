---
title: "[ Leetcode 309 ] Best Time to Buy and Sell Stock with Cooldown | 解題思路分享"
date: "2025-06-27"
author: James
tags: Array,DP
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

你有一支股票的價格清單 `prices`，prices[i] 是第 i 天的價格，你可以在任意天買入或賣出股票，但賣出後你必須冷卻（ cooldown ）一天，才能再買入下一支股票，請找出可以獲得的最大利潤是多少。

題目連結 🔗：[https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

### **問題分析**

這題因為沒有辦法賣完隔天馬上再買，所以沒有辦法碰到最低點就買最高點就賣，因為如果遇到最高點跟最低點相隔只有一天，這樣做就會出錯，所以這題滿清楚就是要往 DP 想。

### **解題思路 - DP**

Transition Function 會根據每天不同的狀態來做轉移，而這題一天當中會有三種狀態

> 1. 今天持有股票
> 2. 今天賣出股票，所以明天需要 cooldown
> 3. 今天不持有股票，不做任何事

我們需要三個 dp 來處理三種 state，分別是 dp[i][0], dp[i][1], dp[i][2]，分別代表三種狀態下 profit 的最大值，我們一個一個來看

先看「今天持有股票」，甚麼情況下我會持有股票呢？就是前一天持有股票或是前一天不持有股票但我在今天買入，我們要在這兩種情況中找到最大值，因此 Transition Function 長這樣：

```cpp
dp[i][0] = max(dp[i-1][0], dp[i-1][2] - prices[i]);
```

再來今天賣出股票，所以明天需要 cooldown，表示昨天持有股票，但今天賣出去了，Transition Function 如下：

```cpp
dp[i][1] = dp[i-1][0] + prices[i];
```

而今天不持有股票，不做任何事，表示昨天有可能賣出股票，也有可能昨天也沒做任何事情，Transition Function 如下：

```cpp
dp[i][2] = max(dp[i-1][1], dp[i-1][2])
```

再來我們來看初始化的狀況，第一天不持股票的情況自然都是 0，但是有持股票，表示第一天有買股票，所以 dp[0][0] 要初始化為 -prices[0]。

這些都寫出來之後，實作就很簡單了。

```cpp
int n = prices.size();
vector<vector<int>>dp(n, vector<int>(3, 0));
dp[0][0] = -prices[0];

for(int i = 1; i < n; i++){
    dp[i][0] = max(dp[i-1][0], dp[i-1][2] - prices[i]);
    dp[i][1] = dp[i-1][0] + prices[i];
    dp[i][2] = max(dp[i-1][2], dp[i-1][1]);
}

return max(dp[n-1][1], dp[n-1][2]);
```

注意最後的情況只需要看不持有股票的情況就好，因為不會有到最後一天持有股票還保有最大利潤，如果是這樣那這張股票不買一定利潤會最高，所以只要比較後面兩個 state 即可。

我覺得這題難想是要想為什麼這樣更新就可以解決問題，最大的癥結點在於狀態的設計，三種狀態其實就對應於一天之中可以做的三件事情，買入 / 賣出 / 休息，我覺得會卡住的地方是對於買入來說，因為買入會減少 profit，所以這格如果都不買入不是就都不會減少了嗎？但是這樣就沒有辦法有效更新 states。這邊要想的是買入的狀態會從兩個地方來，一個是前一天本身就持有股票，另一個是昨天休息過了今天買入股票，沒有拿昨天的 profit 跟今天買入後的 profit 做比較，等於只是找到過去最低價格的股票而已，因此這樣的 dp 解是沒有問題的。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**
```cpp
int maxProfit(vector<int>& prices) {
    int n = prices.size();
    vector<vector<int>>dp(n, vector<int>(3, 0));
    dp[0][0] = -prices[0];

    for(int i = 1; i < n; i++){
        dp[i][0] = max(dp[i-1][0], dp[i-1][2] - prices[i]);
        dp[i][1] = dp[i-1][0] + prices[i];
        dp[i][2] = max(dp[i-1][2], dp[i-1][1]);
    }

    return max(dp[n-1][1], dp[n-1][2]);
}
```

### **空間優化**

再來我們發現每一個 state 基本上只關注上一格的資訊，所以我們不用宣告一整條陣列的大小，只需要一個 int 就可以了。

```cpp
int n = prices.size();
int hold = -prices[0];
int sold = 0;
int rest = 0;

for(int i = 1; i < n; i++){
    int oldHold = hold;
    int oldSold = sold;
    int oldRest = rest;
    hold = max(oldHold, oldRest - prices[i]);
    sold = oldHold + prices[i];
    rest = max(oldRest, oldSold);
}

return max(sold, rest);
```

只是因為這次的 Transition Function 是交叉更新，所以要先把舊的值複製出來再更新。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**
```cpp
int maxProfit(vector<int>& prices) {
    int n = prices.size();
    int hold = -prices[0];
    int sold = 0;
    int rest = 0;

    for(int i = 1; i < n; i++){
        int oldHold = hold;
        int oldSold = sold;
        int oldRest = rest;
        hold = max(oldHold, oldRest - prices[i]);
        sold = oldHold + prices[i];
        rest = max(oldRest, oldSold);
    }

    return max(sold, rest);
}
```