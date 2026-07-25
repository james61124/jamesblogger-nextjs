---
title: "[ Leetcode 338 ] Counting Bits | 解題思路分享"
date: "2025-05-12"
author: James
tags: DP,Bit Manipulation
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: 71ce1eae-4666-47c0-81c7-3f49e06ac5c9
---

給一個數字 n，計算 0 ~ n 每個數字的 binary 各有多少 1。

題目連結 🔗：[https://leetcode.com/problems/counting-bits/](https://leetcode.com/problems/counting-bits/)

### **問題分析**

這題一開始如果沒有什麼想法，先從找規律開始。

```
0 =    0
1 =    1
2 =   10
3 =   11
4 =  100
5 =  101
6 =  110
7 =  111
8 = 1000
```

把這些數字向右對齊後會發現，`2~3` 的結果是 `0~1` 的結果 + 1，`4~7` 的結果是 `0~3` 的結果 + 1，所以以此類堆 `8~15` 的結果也會是 `0~7` 的結果 + 1，如果用這個方法算的話我們就不用每遇到一個數字就計算一次。

### **解題思路 - Bit Manipulation**

利用上面的分析，我們可以寫出第一種實作方法，`offset` 在遇到 2 的冪次方時就自動乘 2，而最終結果 res[i] 就用 res[i - offset] + 1 更新即可。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
vector<int> countBits(int n) {
    vector<int>res(n+1, 0);
    int offset = 1;
    for(int i=1; i<=n; i++){
        if(i == offset * 2) offset *= 2;
        res[i] = res[i - offset] + 1;
    }
    return res;
}
```

### **解題思路二 - Bit Manipulation**

第二個思路是這樣，當一個數字 `n` 除以 2，相當於他的 binary 右移了一位，舉個例子：

```
9   = 1001
9/2 =  100
```

所以對於每個 res[i] 來說，我們需要兩部分，一個是 res[i/2] 的結果，另一個是最後一位的數字，而最後一位數就是 i % 2，所以寫起來就是這樣：

```cpp
res[i] = res[i/2] + i%2;
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
vector<int> countBits(int n) {
    vector<int>res(n+1, 0);
    for(int i=1; i<=n; i++){
        res[i] = res[i/2] + i%2;
    }
    return res;
}
```