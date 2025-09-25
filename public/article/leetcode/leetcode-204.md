---
title: "[ Leetcode 204 ] Count Primes | 解題思路分享"
date: "2025-09-20"
author: James
tags: Array,Math,Google,Meta
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 2
---

給 `n`，輸出小於 `n` 的所有質數數量

題目連結 🔗：[https://leetcode.com/problems/count-primes/](https://leetcode.com/problems/count-primes/)

### **問題分析**

這妥妥的數學題，找質數最直覺的方法就是從目前的質數出發，一路往上找他的倍數，全部標成非質數，再一直往上找下一個質數直到 `sqrt(n)`，簡單來說，第一個質數是 2，所以把 2, 4, 6, ... 都標起來，再來下一個是 3，所以把 3, 5, 9, ... 也都標起來以此類推，這樣就會過了

### **解題思路**

概念上是這樣，不過實作其實可以優化很多地方，首先依照上面思路我們必須建一個長度為 n 的 isPrime[i]，但問題是所有偶數除了 2 都不會是質數，那我們乾脆偶數就都不考慮進來了，直接見一個長度為 `n / 2 + 1` 的 isPrime[i]，省掉一半的空間，而這個 array 只存奇數，所以 index 跟真實數字的對應關係如下

```
index i -> value p
1       -> 1
2       -> 3
3       -> 5
4       -> 7
5       -> 9
```

所以 `p = 2 * i - 1`，我們先把框架寫出來

```cpp
int len = n / 2 + 1;
vector<bool>isPrime(len, true);

int bound = (sqrt(n) + 1) / 2;
for(int i = 2; i <= bound; i++) {
    if(!isPrime[i]) continue;

    // ...
}
```

再來有幾個很重要的觀念，事實上我們不用把質數 `p` 的所有倍數都標起來，我們只要從 `p * p` 開始標就好，因為倍數比較小的我們前面都一定已經標過了，所以以 5 來說，我們只需要標 25, 30, 35, ...

```cpp
int len = n / 2 + 1;
vector<bool>isPrime(len, true);

int bound = (sqrt(n) + 1) / 2;
for(int i = 2; i <= bound; i++) {
    if(!isPrime[i]) continue;

    int p = 2 * i - 1;
    int start = (p * p + 1) / 2;
    for(int j = start; j < len; /* ... */ ) {
        isPrime[j] = false;
    }
}
```

重點來了，每一個質數的倍數都是 [odd, even, odd, even] 交錯，我們只需要關注 odd 的內容，而 odd 彼此相差兩個 p 的距離，換算成 i 就是一個 p 的距離，所以每次更新 j 只需要加一個 p 就好，舉例來說，如果更新的是 `p = 3`，我們需要更新的數字是 3, 9, 15, 21, ...，換算成 index 就是 2, 5, 8, 11, ...，彼此都只差一個 3，所以我們可以把程式碼補齊

```cpp
int len = n / 2 + 1;
vector<bool>isPrime(len, true);

int bound = (sqrt(n) + 1) / 2;
for(int i = 2; i <= bound; i++) {
    if(!isPrime[i]) continue;

    int p = 2 * i - 1;
    int start = (p * p + 1) / 2;
    for(int j = start; j < len; j += p) {
        isPrime[j] = false;
    }
}
```

最後 iterate 過整個 isPrime[i]，看看有多少質數即可，如果 n >= 2 記得加上一開始的 2

**Time Complexity** - `O(n logn logn)`，因為劃掉的次數大約是 n/2 + n/3 + n/5 ...<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int countPrimes(int n) {

    if (n <= 2) return 0;
    int len = n / 2 + 1;
    vector<bool>isPrime(len, true);

    int bound = (sqrt(n) + 1) / 2;
    for(int i = 2; i <= bound; i++) {
        if(!isPrime[i]) continue;

        int p = 2 * i - 1;
        int start = (p * p + 1) / 2;
        for(int j = start; j < len; j += p) {
            isPrime[j] = false;
        }
    }

    int result = 1;
    for(int i = 2; i < len; i++) {
        if(isPrime[i]) result++;
    }

    return result;
}
```