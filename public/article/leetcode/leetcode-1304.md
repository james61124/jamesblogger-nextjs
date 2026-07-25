---
title: "[ Leetcode 1304 ] Find N Unique Integers Sum up to Zero | 解題思路分享"
date: "2025-09-20"
author: James
tags: Array,Math,Google,Meta
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: 617f4e2b-8780-4b4c-bbd9-1d6b9e136fff
---

給一個 integer `n`，找到 unique 的 ｎ 個數字總和是 0

題目連結 🔗：[https://leetcode.com/problems/find-n-unique-integers-sum-up-to-zero/](https://leetcode.com/problems/find-n-unique-integers-sum-up-to-zero/)

### **問題分析**

(+i, -i) 這樣算一組，組合會是 0，總共會出現 n / 2 次，最後多出來的次數補 0 就好。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
vector<int> sumZero(int n) {
    vector<int>result;
    int amount = n / 2 + 1;
    for(int i = 1; i < amount; i++) {
        result.push_back(i);
        result.push_back(-i);
    }
    if(n % 2 == 1) result.push_back(0);

    return result;
}
```