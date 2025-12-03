---
title: "[ Leetcode 8 ] String to Integer (atoi) | 解題思路分享"
date: "2025-11-24"
author: James
tags: String,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 string，要去掉 leading whitespace，判斷正負號，去掉 leading zeros，最後回傳這個 string 轉成 integer 的結果，如果這個數字超過 [-2^31, 2^31 - 1]，就回傳 -2^31 或 2^31 - 1

題目連結 🔗：[https://leetcode.com/problems/string-to-integer-atoi/](https://leetcode.com/problems/string-to-integer-atoi/)

### **解題思路**

這題前面的 leading whitespace, 正負號, leading zeros 都可以很直覺得直接判斷，比較麻煩的是 round up 的部分，由於會有 overflow 的問題，所以沒有辦法寫 condition 讓數字超過 2^31 - 1 或是小於 -2^31 就 round up 回來，所以我們必須在他可能會超過的時候就判斷出來

我們先把其他部分寫完，首先判斷 leading whitespace

```cpp
int myAtoi(string s) {
    int n = s.size();
    int i = 0;
    bool sign = true;
    int result = 0;

    while(i < n && s[i] == ' ') i++;
}
```

判斷正負號

```cpp
if(s[i] == '-'){
    sign = false;
    i++;
} else if(s[i] == '+'){
    i++;
}
```

判斷 leading zero

```cpp
while(s[i] == '0') i++;
```

最後計算 result

```cpp
while(i < n && isdigit(s[i])){

    // TODO

    result = 10 * result + (s[i] - '0');
    i++;
}
```

TODO 的地方就是要來解決 overflow 的問題，我們對於 result 的範圍限制如下 :

> result <= INT_MAX<br>
> result >= INT_MIN

因為 s[i] >= 0，也就是說，在原本的 result 乘 10 後不能超過這個範圍

> result * 10 <= INT_MAX<br>
> result * 10 >= INT_MIN

那怎麼判斷 result 會不會 overflow 就很清楚了

> result <= INT_MAX / 10<br>
> result >= INT_MIN / 10

如果寫成程式碼就是這樣

```cpp
if(sign && (result >= INT_MAX / 10)) {
    return INT_MAX;
}
if(!sign && (-result <= INT_MIN / 10)) {
    return INT_MIN;
}
```

但問題來了，先舉其中一邊為例子，INT_MAX = 2^31 - 1 = 2147483647，所以 INT_MAX / 10 = 214748364，當 result 比這個數字大的時候 round up 沒有問題，但如果現在 result = 214748364，他乘以 10 之後會是 2147483640，還遠遠不到 overflow 的範圍，所以我們需要加個條件，當 result == INT_MAX / 10 的時候，s[i] 要 > 7 才需要 round up，負數也是一樣的計算方式，完整程式碼就是這樣

```cpp
if(sign && (result > INT_MAX / 10 || (result == INT_MAX / 10 && (s[i] - '0') >= 7))) {
    return INT_MAX;
}
if(!sign && (-result < INT_MIN / 10 || (-result == INT_MIN / 10 && (s[i] - '0') >= 8))) {
    return INT_MIN;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
class Solution {
public:
    int myAtoi(string s) {
        int n = s.size();
        int i = 0;
        bool sign = true;
        int result = 0;

        while(i < n && s[i] == ' ') i++;
        if(s[i] == '-'){
            sign = false;
            i++;
        } else if(s[i] == '+'){
            i++;
        }

        while(s[i] == '0') i++;

        while(i < n && isdigit(s[i])){
            if(sign && (result > INT_MAX / 10 || (result == INT_MAX / 10 && (s[i] - '0') >= 7))) {
                return INT_MAX;
            }
            if(!sign && (-result < INT_MIN / 10 || (-result == INT_MIN / 10 && (s[i] - '0') >= 8))) {
                return INT_MIN;
            }

            result = 10 * result + (s[i] - '0');
            i++;
        }

        return sign ? result : -result;
    }
};
```
