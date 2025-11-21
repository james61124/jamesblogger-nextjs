---
title: "[ Leetcode 7 ] Reverse Integer | 解題思路分享"
date: "2025-11-18"
author: James
tags: Math,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 integer，給出反轉後的結果，但反轉後的數字如果在 [-2^31, 2^31 - 1] 之外，就要回傳 0

題目連結 🔗：[https://leetcode.com/problems/reverse-integer/](https://leetcode.com/problems/reverse-integer/)

### **問題分析**

反轉數字只要照下面的步驟一個數字一個數字 parse 出來就好，大概像是這樣

```
x = 123 | result = 0
x = 12  | result = 3
x = 1   | result = 32
x = 0   | result = 321
```

簡單寫成程式碼

```cpp
int reverse(int x) {
    int result = 0;

    while(x != 0){
        result = 10 * result + x % 10;
        x /= 10;
    }

    return result;
}
```

這題麻煩的部分在於 result 超過 INT_MAX, INT_MIN 的話要回傳 0，INT_MAX 在 c++ 是 2^31 - 1 = 2147483647，INT_MIN 是 -2^31 = 2147483648

如果 result 超過這個區間就要回傳 0，但我們不能在 result 算出來之後才判斷，因為這樣會 overflow，在 `x % 10` 一定大於 0 的情況，我們必須保證 10 * result 大於 INT_MAX 或是小於 INT_MIN，也就是說 result 本身要大於 INT_MAX / 10 或是小於 INT_MIN / 10

但我們來看這些數字除以 10 的變化：

```
INT_MAX / 10 = 214748364
INT_MIN / 10 = -214748364
```

所以在 result 等於 INT_MAX / 10 的情況下，x % 10 只要沒有超過 7，加進去 result 就不會 overflow，負數那邊也是同樣道理，所以寫成程式碼整合起來

```cpp
int reverse(int x) {
    int result = 0;

    while(x != 0){
        if (result > INT_MAX / 10 || (result == INT_MAX / 10 && x > 7)) return 0;
        if (result < INT_MIN / 10 || (result == INT_MIN / 10 && x < -8)) return 0;

        result = 10 * result + x % 10;
        x /= 10;
    }

    return result;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int reverse(int x) {
    int result = 0;

    while(x != 0){
        if (result > INT_MAX / 10 || (result == INT_MAX / 10 && x > 7)) return 0;
        if (result < INT_MIN / 10 || (result == INT_MIN / 10 && x < -8)) return 0;

        result = 10 * result + x % 10;
        x /= 10;
    }

    return result;
}
```


