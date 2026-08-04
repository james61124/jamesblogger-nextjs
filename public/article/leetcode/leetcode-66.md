---
title: "[ Leetcode 66 ] Plus One | 解題思路分享"
date: "2025-06-13"
author: James
tags: Array,Math,Google,Meta
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
id: 75622268-7b2a-47b2-9b95-debff0f92fcc
---

給一個 array `digits`，代表一個大整數（ 高位在前 ），請回傳加一後的結果（ 同樣以陣列形式回傳 ）。

題目連結 🔗：[https://leetcode.com/problems/plus-one/](https://leetcode.com/problems/plus-one/)

## 問題分析

這題不用把 array 轉成數字加完之後再轉回 array，直接利用普通進位的觀念更新 array 就好。

## 解題思路 - 

對於個位數來說，會變成 (digits[i] + 1) / 10，然後進位 `c` 往後丟，而後面的每個都是 (digits[i] + c) / 10 然後進位再往後丟，因此我們可以把 c 初始化為 1，對每個位數進行更新。

```cpp
int n = digits.size();
int c = 1;
for(int i = n - 1; c > 0 && i >= 0; i--){
    int sum = digits[i] + c;
    digits[i] = sum % 10;
    c = sum / 10;
}
```

這題需要處理溢位的情況，例如原本的 `digits` = 9，加 1 之後會變 10，多了一個位數，因此最後算完如果還有需要進位的，就要在 `digits` 最前面插入。

```cpp
if(c > 0) digits.insert(digits.begin(), 1);
```

全部合起來就是答案。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

## Implementation

```cpp
vector<int> plusOne(vector<int>& digits) {
    int n = digits.size();
    int c = 1;
    for(int i = n - 1; c > 0 && i >= 0; i--){
        int sum = digits[i] + c;
        digits[i] = sum % 10;
        c = sum / 10;
    }
    if(c > 0) digits.insert(digits.begin(), 1);

    return digits;
}
```