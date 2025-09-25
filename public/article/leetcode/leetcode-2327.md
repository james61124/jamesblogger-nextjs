---
title: "[ Leetcode 2327 ] Number of People Aware of a Secret | 解題思路分享"
date: "2025-09-21"
author: James
tags: DP,Google,Meta
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

一個人第 1 天知道一個秘密，從知道後滿 `delay` 天開始，他每天可以把秘密告訴 1 個新的人，但在知道後滿 `forget` 天就會忘記，忘記後就不再傳播。給整數 `n`, `delay`, `forget`，問到第 `n` 天結束時，還有多少人知道這個秘密（沒忘記的人數），答案要 mod 10^9 + 7。

題目連結 🔗：[https://leetcode.com/problems/number-of-people-aware-of-a-secret/](https://leetcode.com/problems/number-of-people-aware-of-a-secret/)

### **問題分析**

這題一開始看的時候覺得是 Greedy，我就先順著題目走，設一個 nums[i] 代表已經知道 secret i 天的人數有多少，例如 A, B 已經知道 secret 3 天了，那 nums[3] 就是 2，再來就是 iterate `n` 次更新這個表格，所以一開始 nums[1] = 1，對每一天來說有三件事情要做

> 1. 整個 array 往右 shift，因為假設原本知道 secret i 天，那隔天就已經知道這個 secret i + 1 天了<br>
> 2. 如果知道 secret 已經 `delay` 天 ~ `forget` 天有 x 人，那 nums[1] = x，表示有 x 人新知道 secret<br>
> 3. 最後大於 `forget` 的人數就全部 drop 掉

一直重複這個流程，最後把所有數字加起來就好。

這看起來滿合理的，只是整個 array 往右 shift 時間複雜度太差了，這題利用前面天數的狀態來取得後面天數的狀態，事實上就是一種 DP 的思維，雖然這題真的藏得很深。

### **解題思路 - DP**

這題難在 dp[i] 不是第 i 天總共有多少人知道 secret，而是第 i 天有多少新的人知道這個 secret，而所有新知道的人，都是從 `delay` 天前 ~ `forget` 天前這段時間內新知道的人傳過來的，所以 Transition Function 就很清楚了

```cpp
dp[i] = sum(dp[i-forget+1 ... i-delay])
```

而最後答案就是 `sum(dp[n-forget+1 ... n])`

理論很清楚，但是每一次都要跑 loop 計算 `i-forget+1` ~ `i-delay` 中間的總和好像不是很有效率，這邊可以使用一個類似 sliding window 的技巧，我們每一次 iterate 到下一天的時候，只要把原本的總和 - dp[i - forget] 再加 dp[i - delay] 就可以了，簡單寫起來像這樣

```cpp
vector<long long>dp(n + 1, 0);
long long sumDelay = 0;

dp[1] = 1;
for(int i = 2; i <= n; i++){
    if(i > delay) {
        sumDelay += dp[i - delay];
    }
    if(i > forget) {
        sumDelay -= dp[i - forget];
    }
    dp[i] = sumDelay;
}
```

但這題說要解決數字太大的問題，所以要取 modulo，而由於 `sumDelay` 有可能會是負數，這邊到特別處理

> 如果 `n` 有可能是 negative，那取 mod 的時候要先把它加成 positive 才可以取

像是下面這樣

```cpp
#define MOD 1000000007

vector<long long>dp(n + 1, 0);
long long sumDelay = 0;
long long result = 0;

dp[1] = 1;
for(int i = 2; i <= n; i++){
    if(i > delay) {
        sumDelay += dp[i - delay];
        sumDelay %= MOD;
    }
    if(i > forget) {
        sumDelay -= dp[i - forget];
        if(sumDelay < 0) sumDelay += MOD;
        sumDelay %= MOD;
    }
    dp[i] = sumDelay;
}
```

最後答案就是 `sum(dp[n-forget+1 ... n])`，跑個回圈算出來就好

```cpp
for(int i = n; i > n - forget && i > 0; i--) {
        result += dp[i];
        result %= MOD;
    }
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**

```cpp
#define MOD 1000000007

class Solution {
public:
    int peopleAwareOfSecret(int n, int delay, int forget) {
        vector<long long>dp(n + 1, 0);
        long long sumDelay = 0;
        long long result = 0;

        dp[1] = 1;
        for(int i = 2; i <= n; i++){
            if(i > delay) {
                sumDelay += dp[i - delay];
                sumDelay %= MOD;
            }
            if(i > forget) {
                sumDelay -= dp[i - forget];
                if(sumDelay < 0) sumDelay += MOD;
                sumDelay %= MOD;
            }
            dp[i] = sumDelay;
        }

        for(int i = n; i > n - forget && i > 0; i--) {
            result += dp[i];
            result %= MOD;
        }

        return result;

    }
};
```