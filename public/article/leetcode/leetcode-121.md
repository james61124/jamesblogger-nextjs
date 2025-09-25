---
title: "[ Leetcode 121 ] Best Time to Buy and Sell Stock | 解題思路分享"
date: "2025-04-07"
author: James
tags: Array,Greedy,Top Interview,Google,Meta
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
---

給一個價格 array `prices`，其中 prices[i] 表示第 i 天的股票價格，請找出如果只能交易一次的最大 profit。

題目連結 🔗：[https://leetcode.com/problems/maximum-depth-of-binary-tree/](https://leetcode.com/problems/maximum-depth-of-binary-tree/)

### **問題分析**

對於每一個 prices[i] 來說，他的最大的 profit 就是 prices[i] 減掉前面看過的所有 price 中最小的，所以我們就一直維護目前最小的 price，然後持續更新 maxProfit 就可以了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int maxProfit(vector<int>& prices) {
    int curMin = INT_MAX;
    int result = 0;
    for(int price : prices){
        result = max(price - curMin, result);
        curMin = min(curMin, price);
    }

    return result;
}
```