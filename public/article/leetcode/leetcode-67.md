---
title: "[ Leetcode 67 ] Add Binary | 解題思路分享"
date: "2025-11-20"
author: James
tags: Math,String,Google
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
id: 82aa8401-f175-4311-879c-34690a7cf8b9
---

給兩個 string `a`, `b`，兩個 string 都是一個 binary 的形式，各代表一個數字，要回傳這兩個數字相加的 binary

題目連結 🔗：[https://leetcode.com/problems/add-binary/](https://leetcode.com/problems/add-binary/)

## 問題分析

這題沒什麼好講的，就用直式加法計算，從尾巴加到頭，記得處理進位就好。

**Time Complexity** - `O(n + m)`<br>
**Space Complexity** - `O(1)`


## Implementation

```cpp
string addBinary(string a, string b) {
    int carry = 0;
    int idxA = a.size() - 1;
    int idxB = b.size() - 1;
    string result = "";

    while(idxA >= 0 || idxB >= 0 || carry > 0){
        int bitA = idxA >= 0 ? a[idxA] - '0' : 0;
        int bitB = idxB >= 0 ? b[idxB] - '0' : 0;
        int sum = bitA + bitB + carry;
        result.push_back('0' + (sum % 2));
        carry = sum / 2;

        idxA--;
        idxB--;
    }
    reverse(result.begin(), result.end());

    return result;
}
```