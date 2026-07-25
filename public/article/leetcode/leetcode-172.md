---
title: "[ Leetcode 172 ] Factorial Trailing Zeroes | 解題思路分享"
date: "2025-09-16"
author: James
tags: Math,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
id: 8cccabb0-17ae-4bb0-9762-e45523fc0a14
---

給一個數字 `n`，輸出 n 階乘的數字中結尾會出現幾個 0

題目連結 🔗：[https://leetcode.com/problems/factorial-trailing-zeroes/](https://leetcode.com/problems/factorial-trailing-zeroes/)

### **問題分析**

這題關鍵只有一個

> 質因數分解出現一組 `2 * 5`，就會出現一個 trailing zero

而在階乘的質因數分解中，2 的數量遠遠大於 5，所以基本上只要管在質因數分解中出現了幾次 5 即可。

再來就是有點數學的部分，階乘中，5 的倍數會出現一個 5，25 的倍數會出現 2 個 5，125 的倍數會出現 3 個 5 以此類推，那想通了之後 code 就很好寫了

```cpp
int fives = 5;
int result = 0;
while(fives <= n){
    result += n / fives;
    fives *= 5;
}
```

**Time Complexity** - `O(logn)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int trailingZeroes(int n) {
    if(n == 0) return 0;

    int fives = 5;
    int result = 0;
    while(fives <= n){
        result += n / fives;
        fives *= 5;
    }

    return result;
}
```