---
title: "[ Leetcode 122 ] Best Time to Buy and Sell Stock II | 解題思路分享"
date: "2025-08-31"
author: James
tags: Array,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: bbe1af34-0a15-40ef-bd28-8fb55dc68c00
---

給 prices[i] 代表每天股票的價格，一次只持有一張股票，但是隨時可以買隨時可以賣，問 max profit 是多少。

題目連結 🔗：[https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)

### **問題分析**

題目沒有限制買跟賣的次數，只有說一次只能持有一張股票，問最多可以賺多少錢，這其實就是一個非常簡單的邏輯，我們只要捕捉每一段上升，下降的都不要管，那自然就會是賺最多錢的方法了。

簡單舉例來看，假設一隻股票的波動是 [1, 5, 3, 7]，買低賣高我們可以賺 (7 - 1) = 6，但是如果每一段漲我們都有獲得他的利潤，那就會是賺 (5 - 1) + (7 - 3) = 8，中間重疊的部分也可以賺到，自然可以賺更多。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int maxProfit(vector<int>& prices) {
    int res = 0;
    for(int i = 1; i < prices.size(); i++){
        int profit = prices[i] - prices[i - 1];
        if(profit > 0) res += profit;
    }

    return res;
}
```