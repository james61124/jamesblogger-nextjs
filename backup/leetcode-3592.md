---
title: "[ Leetcode 3592 ] Inverse Coin Change | 解題思路分享"
date: "2025-09-28"
author: James
tags: Array,DP,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/inverse-coin-change/](https://leetcode.com/problems/inverse-coin-change/)

### **問題分析**

首先這是反過來的 coin exchange，如果是正的大家都會做，就是 DP，但是給結果要求原本的 coins 有幾種要怎麼做呢？

我們直接來想這種題目的規律，給個範例 numWays = [0, 1, 0, 2, 0, 3, 0, 4, 0, 5]，仔細想一下就會發現最小面額的 coins 如果是 `x`，那可以組成 `x` 的方法不就是一種嗎？不會有其他答案了，所以以這題來說第一種 coins 就是 2，我們假設 coins = [2] 然後寫出目前的 numWays

```
ways = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
```

然後發現在總和為 4 的地方跟原本的 numWays[i] 長不一樣，代表單靠一個 2 沒有辦法變出更多方法來組成 4，那這是最小的不一樣的面額，也就是說 coins 裡面也一定有一個 4，不會有其他狀況了，這樣我們就找到這題的規律，簡單來說

> 用目前的 `coins` 建立方法數，找到第一個 ways[i] != numWays[i]，那就是缺少 i + 1，一直做下去直到 ways[i] 跟 numWays[i] 一樣

我們先來看要怎麼更新 ways[i]，實際上這就是一個 DP 問題，後面都用 dp[i] 表示，其中 dp[i] 代表目前的所有 coins 組成 i + 1 的方法數，你可以選擇「選 / 不選」目前這個 coin `c`，如果選擇目前的 coin `c`，那他的方法數就是 dp[i] = dp[i - c]，如果不選目前這個 coin，那 dp[i] 就維持原本的方法數，所以 Transition Function 長這樣

```cpp
dp[i] = dp[i] + dp[i - c]
```



### **解題思路**



#### **Implementation**

```cpp
vector<int> findCoins(vector<int>& numWays) {
    int n = numWays.size();

    vector<long long>dp(n);
    vector<int>result;

    // find non-zero index
    int curr = 0;
    for(int i = 0; i < n; i++){
        if(numWays[i] != 0) {
            curr = i;
            break;
        }
    }

    while(curr < n) {
        int val = curr + 1;
        result.push_back(val);

        dp[curr]++;
        for(int i = curr + 1; i < n; i++){
            if(i - val >= 0) dp[i] = dp[i - val] + dp[i];
        }

        curr++;
        while(curr < n){
            if(numWays[curr] > dp[curr]) break;
            if(numWays[curr] < dp[curr]) return {};
            curr++;
        }
    }

    for (int i = 0; i < n; ++i)
        if (dp[i] != numWays[i]) return {};

    return result;

}
```
