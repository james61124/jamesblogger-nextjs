---
title: "[ Leetcode 69 ] Sqrt(x) | 解題思路分享"
date: "2025-09-10"
author: James
tags: Math,Binary Search,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
---

給一個數字 `x`，找出他的平方根，但是不可以使用內建的 math function。

題目連結 🔗：[https://leetcode.com/problems/sqrtx/](https://leetcode.com/problems/sqrtx/)

### **問題分析**

如果暴力解就是從 1 ~ n 把所有數字都看過，這樣是 `O(n)`，那肯定有更好的解法，這題可以想成是從 1 ~ n 的 list 中找到平方後小於 n 的最大值，相當於在一個 sorted array 中找到一個 target，那一切線索都指向 Binary Search

[[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/binary-search)

### **解題思路 - Binary Search**

看完文章後我們可以得到一個觀念

> Binary Search 不只是用來「找 sorted array 中的 target」，而是如果這個 array 可以找到一個 function 讓他左邊都是 false，右邊都是 true，就可以用 Binary Search 來解。

這題我們要來思考 is_valid 的分界線在哪，我們先就最直覺的方法寫，給個範例

```
x = 9
n        = 1 2 3 4 5 6 7 8 9
is_valid = 0 0 1 1 1 1 1 1 1

x = 10
n        = 1 2 3 4 5 6 7 8 9 10
is_valid = 0 0 1 1 1 1 1 1 1 1
```

一般來說會這樣設計，但我們就會發現說，`x = 10` 的情況我們沒有辦法寫 `is_valid` function，因為 `true` 的部分同時包含了 `mid` 小於等於跟大於 `x` 的情況，所以這題真正應該要這樣設計

```
x = 9
n        = 1 2 3 4 5 6 7 8 9
is_valid = 0 0 0 1 1 1 1 1 1

x = 10
n        = 1 2 3 4 5 6 7 8 9 10
is_valid = 0 0 0 1 1 1 1 1 1 1
```

因為 `right` 指標跟 `left` 指標最後會落在 0, 1 的交界處，所以我們 return `left - 1` 或是 `right` 都可以過。

**Time Complexity** - `O(nlogn)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int mySqrt(int x) {
    int left = 0;
    int right = x;

    while(left <= right) {
        long long mid = left + (right - left) / 2;
        if(mid * mid > x) right = mid - 1;
        else left = mid + 1;
    }

    return right;
}
```