---
title: "[ Leetcode 50 ] Pow(x, n) | 解題思路分享"
date: "2025-06-12"
author: James
tags: Math,Base Conversion
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: a550fbf7-a92b-44db-9750-1b297e8b44e6
---

實作出 pow(x, n) 這個次方的 function。

題目連結 🔗：[https://leetcode.com/problems/powx-n/](https://leetcode.com/problems/powx-n/)

## 問題分析

指數的世界中，可以很粗略的分成三類，指數 `n` 大於 0, 等於 0, 小於 0 三種情況，如果 n > 0，就是最簡單的自己乘自己 n 次，假設叫做 function `cal(x, n)`，那分類起來會長這樣：

> if `n > 0` : cal(x, n)<br>
> if `n == 0` : 1<br>
> if `n < 0` : 1 / cal(x, -n)

也就是說，我們只要有效率的處理「自己乘自己 n 次」，也就是 function `cal` 就行了

```cpp
double myPow(double x, int n) {
    if(n == 0) return 1;
    else if(n > 0) return cal(x, n);
    else return 1 / cal(x, -n);
}
```

## 解題思路 - Base Conversion

最簡單的方式當然就是照字面上的意思，自己乘自己 n 次，也就是 O(n) 的時間複雜度。

```cpp
double cal(double x, int n) {
    double result = 1;
    for(int i = 0; i < n; i++) {
        result *= x;
    }
    return result;
}
```

但事實上，我們可以利用 O(logn) 來解決這件事情。

我們做一次 `x *= x` 可以得到 x 的 2 次方，那再做一次就可以得到 4 次方，再做一次就可以得到 8 次方，簡單來說，我們可以利用 O(logn) 的時間就拿到 2, 4, 8, 16 這些二的冪次方指數的結果，所以我們如果將指數用這些二的冪次方組合，就可以大幅縮短計算時間，舉例來說：

```
x^13 = (x^1) * (x^4) * (x^8)
```

那像剛剛講的 1 次方, 4 次方, 8 次方都很好取得，直接相乘就可以了，所以再來的問題就是，如何將指數分解成二的冪次方組合呢？

這其實就是 Base Conversion 的問題，我們只要將指數 n 拆解成二進位制就行了，舉 13 為例子，轉成二進位後會發現 1, 4, 8 的位置都是 1，所以 13 就是拆成 1 次方, 4 次方, 8 次方。

<figure>
  <img src="/images/leetcode/leetcode-50/base-conversion.png" alt="base-conversion" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">

  </figcaption>
</figure>

那首先先介紹一下程式碼怎麼將數字轉換成二進位制，一樣舉 13 為例，一直將商除以 2，而餘數從低位數開始填，寫起來像這樣：

```
13 / 2 = 6 ... 1
6 / 2 = 3 ... 0
3 / 2 = 1 ... 1
1 / 2 = 0 ... 1

13 = 1101
```

如果要將這個過程寫成程式碼的話，會像這樣，讓餘數一直接到 `binary` 後面，然後讓商數除以 2。

```cpp
string binary = "";
while(n > 0) {
    binary = (n % 2 == 0 ? "0" : "1") + binary;
    n /= 2;
}
```

同樣的概念可以套到這題，我們的目標是當「餘數為 1」時，就要將當下的次方數乘進去 `result` 中，「餘數為 0」就表示這個次方不在二的冪次方組合中就不用管，寫成程式碼就是這樣：

```cpp
double cal(double x, int n) {
    double result = 1;
    while(n > 0) {
        if(n % 2 == 1) result *= x;
        x *= x;
        n /= 2;
    }
    return result;
}
```

最後有個地方需要特別小心，int 的範圍是 -2^31 到 2^31 - 1，因為我們在 n < 0 的情況是回傳 `1 / cal(x, -n)`，也就是說我們會直接呼叫 -n，但如果我們把 -2^31 直接取負數會變成 2^31 會超出 int 的範圍，因此這裡的 n 要轉 long long 比較保險。

```cpp
double cal(double x, long long n) {
    double result = 1;
    while(n > 0) {
        if(n % 2 == 1) result *= x;
        x *= x;
        n /= 2;
    }
    return result;
}
```

function `cal` 寫出來這題也就結束了，直接看下面的 implementation。

**Time Complexity** - `O(logn)`<br>
**Space Complexity** - `O(1)`

## Implementation

```cpp
double cal(double x, long long n) {
    double result = 1;
    while(n > 0) {
        if(n % 2 == 1) result *= x;
        x *= x;
        n /= 2;
    }
    return result;
}

double myPow(double x, int n) {
    long long N = n;
    if(n == 0) return 1;
    else if(n > 0) return cal(x, N);
    else return 1 / cal(x, -N);
}
```