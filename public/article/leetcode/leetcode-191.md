---
title: "[ Leetcode 191 ] Number of 1 Bits | 解題思路分享"
date: "2025-04-15"
author: James
tags: Bit Manipulation,Divide and Conquer
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 32 bits unsigned integer，return 他有幾個 １。

題目連結 🔗：[https://leetcode.com/problems/number-of-1-bits/](https://leetcode.com/problems/number-of-1-bits/)

### **問題分析**

如果是最直覺的解法，就是一個一個看他是不是 1，這樣走完 32 個 bits 就可以了。

### **解題思路 - Bit Manipulation**

所以要一個一個看 bits 是不是 1，可以直接用 bitmask 過濾出最後一個 bit，判斷一下是不是 1 再 right shift 即可。

**Time Complexity** - `O(32) = O(1)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int hammingWeight(int n) {
    int result = 0;
    for(int i=0; i<32; i++){
        if(n & 1) result++;
        n >>= 1;
    }
    return result;
}
```

### **時間優化 - Brian Kernighan’s Algorithm**

這裡有一個很好用的技巧，他可以把 n 的最後一個 1 變成 0，方法如下

```cpp
n = n & (n - 1)
```

看下面的例子

```
n     = 0b1011000
n - 1 = 0b1010111
```

所以 `n & (n - 1)` 就是 `0b1010000`，簡單來說 n - 1 可以把最後一個 1 變 0 後面的 0 全部變 1，所以 and 起來最後一個 1 就不見了。

應用在這題，只要把所有 1 都變不見，數一下做了幾次就可以算出 n 總共有多少個 1 了，這樣就不用做 32 次，只會做 k 次，而 k 是 1 的數量。

**Time Complexity** - `O(k)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int hammingWeight(int n) {
    int result = 0;
    while(n) {
        n = n & (n - 1);
        result++;
    }
    return result;
}
```

### **Follow up**

這題題目給了另一個延伸思考，如果這題必須做無限多次的話，那一定會遇到重複的情況，但是我們如果要把 2^32 種組合全部都放到 Hash Table 會太多，所以可以放 2^8 次方個就好，然後把 32 bits unsigned integer 分成四組來查表，這樣就可以了。

**Time Complexity** - `O(1)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int hammingWeight(int n) {

    unordered_map<int, int>count;
    for(int i=0; i<256; i++){
        count[i] = (i & 1) + count[i >> 1];
    }

    return count[n & 0xff]
            + count[(n >> 8) & 0xff]
            + count[(n >> 16) & 0xff]
            + count[(n >> 24) & 0xff];
}
```