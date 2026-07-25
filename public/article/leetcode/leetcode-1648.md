---
title: "[ Leetcode 1648 ] Sell Diminishing-Valued Colored Balls | 解題思路分享"
date: "2025-03-11"
author: James
tags: Binary Search,Amazon
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: e3a7cfbd-9901-486e-b9b0-bd2f707fe5b1
---

給一個 inventory[i]，每一個 inventory[i] 代表一種球的 value，每當這種球被賣出去一顆，那他的 value 就會變成 inventory[i]，假設總共能賣出 `orders` 顆球，問最大的總 profit 會是多少。

題目連結 🔗：[https://leetcode.com/problems/sell-diminishing-valued-colored-balls/](https://leetcode.com/problems/sell-diminishing-valued-colored-balls/)

### **問題分析**

這題如果暴力解，可以用一個 max heap 找到「目前 value 最大的球」，每一次都購買 value 最大的球一個一個計算就好，但是這樣如果 value 是一個超級大的數字，我們需要計算 value, value - 1, value - 2, ... 的總和，但這其實是「等差級數」，也就是一個公式就可以解決的事

因此這題實際上應該是 Binary Search

### **解題思路 - Binary Search**

我們要找的是一個最大的 k，其中這個 k 是「所有 value >= k 的球的數量」必須要 <= `orders`，舉例來說 inventory = [10, 7, 5, 5]，如果 k = 7，「value >= k 的球的數量」就是 5，而這個數量要小於等於 `orders`，如果 k 調大，球的數量就會更少，k 調小，球的數量就會更多

而 k 會落在 1 ~ max(inventory) 之間，所以我們可以利用 Binary Search 找到 k，利用等差級數算出總 value 就好，來看怎麼實作的

首先對於每一次 Binary Search，都要跑一個 O(n) 來計算當下的 k 對應到球的數量是多少，最後的 `left` 就是我們要的 k

```cpp
long long countBalls(vector<int>& inventory, int k) {
        long long count = 0;
        for(int i = 0; i < inventory.size(); i++){
            count += max(0, (inventory[i] - k + 1));
        }
        return count;
    }

    int maxProfit(vector<int>& inventory, int orders) {
        
        int maxInventory = 0;
        for(int i = 0; i < inventory.size(); i++){
            maxInventory = max(maxInventory, inventory[i]);
        }

        int left = 1;
        int right = maxInventory;
        while(right >= left){
            int mid = left + (right - left) / 2;
            if(countBalls(inventory, mid) <= orders) right = mid - 1;
            else left = mid + 1;
        }
    }
```

再來利用等差級數把總 profit 計算出來

```cpp
long long profit = 0;
for(int i = 0; i < inventory.size(); i++){
    long long oneProfit = (long long)(inventory[i] + left) * (long long)(inventory[i] - left + 1) / 2;
    if(oneProfit > 0) {
        profit = (profit + oneProfit);
        orders -= (inventory[i] - left + 1);
    }
}
```

那剩餘的 `orders` 也要計算進來

```cpp
profit = (profit + ((long long)orders * (left - 1))) % mod;
```

這樣就結束了，最後記得把 mod 加進去

**Time Complexity** - `O(nlogn)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int mod = 1000000007;

long long countBalls(vector<int>& inventory, int k) {
    long long count = 0;
    for(int i = 0; i < inventory.size(); i++){
        count += max(0, (inventory[i] - k + 1));
    }
    return count;
}

int maxProfit(vector<int>& inventory, int orders) {
    
    int maxInventory = 0;
    for(int i = 0; i < inventory.size(); i++){
        maxInventory = max(maxInventory, inventory[i]);
    }

    int left = 1;
    int right = maxInventory;
    while(right >= left){
        int mid = left + (right - left) / 2;
        if(countBalls(inventory, mid) <= orders) right = mid - 1;
        else left = mid + 1;
    }

    // calculate profit
    long long profit = 0;
    for(int i = 0; i < inventory.size(); i++){
        long long oneProfit = (long long)(inventory[i] + left) * (long long)(inventory[i] - left + 1) / 2;
        if(oneProfit > 0) {
            profit = (profit + oneProfit) % mod;
            orders -= (inventory[i] - left + 1);
        }
    }
    profit %= mod;

    left--;
    profit = (profit + ((long long)orders * left)) % mod;

    return profit % mod;
}
```
