---
title: "[ Leetcode 2939 ] Maximum Xor Product | 解題思路分享"
date: "2025-10-13"
author: James
tags: Math,Greedy,Bit Manipulation
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: c76b040b-a497-4b0f-a8a0-08ba6382bb3f
---

給 a, b, n，要找到一個數字 x，使得 (a ^ x) * (b ^ x) 最大，其中 0 <= x <= 2^n

題目連結 🔗：[https://leetcode.com/problems/maximum-xor-product/](https://leetcode.com/problems/maximum-xor-product/)

### **問題分析**

我們的目標是找到一個 x，使得 (a ^ x) 跟 (b ^ x) 每個 bits 可以保留最多的 1，最好的情況就是把兩邊的所有 bits 都變成 1 對吧？所以如果 a 跟 b 的第 i 位都是 1，那 x 第 i 位設成 0 就可以讓 (a ^ x) 跟 (b ^ x) 的第 i 位都是 1，反過來說也是，如果 a 跟 b 的第 i 位都是 0，那 x 第 i 位設成 1 就可以讓 (a ^ x) 跟 (b ^ x) 的第 i 位都是 1

```python
a = b1100
b = b1100
x = b0011

a ^ x = b1111
b ^ x = b1111
```

所以這題最關鍵的問題在於，如果第 i 位一個是 0 一個是 1，我們該保留哪一邊的 1 呢？

答案是「保留高位已經確定的數字中較小的那邊」，聽起來有點繞，這邊舉個例子，假設 a, b 都有 5 個 bits，其中第 2 跟第 4 個 bits 是一樣的，所以 (a ^ x) * (b ^ x) 可能會像下面這樣

```python
(a ^ x) * (b ^ x) = (16 + 8 + 4 + 2 + 1) * (8 + 2)
```

簡單來說，16, 4, 1 只會出現在其中一邊，8, 2 兩邊都會出現，那我們要判斷 16, 4, 1 要出現在哪一邊乘積才會最大，對於高位的第一個 16 來說沒有差別，放哪邊都可以，但是對於下一個 4 來說，高位已經決定的數字一邊是 (16 + 8) 另一邊是 (8)，那 4 一定要放比較小的那邊成績才會最大，1 也是一樣概念，所以這題應該會像這樣

```python
(a ^ x) * (b ^ x) = (16 + 8 + 2) * (8 + 4 + 2 + 1)
```

所以總結一句話就是，1 要

> 保留高位已經確定的數字中較小的那邊

### **解題思路 - Bit Manipulation**

所以我們要來計算 x 的大小，先跑一個迴圈從高位跑到低位，然後要取出 a, b 各自的第 i 個 bit

```cpp
unsigned long long x = 0;

for(int i = n - 1; i >= 0; i--){
    long long tmp_a = a;
    long long tmp_b = b;
    int ith_a = tmp_a >> i & 1;
    int ith_b = tmp_b >> i & 1;
}
```

當兩個 bits 一樣的時候，把兩邊都變 1

```cpp
unsigned long long x = 0;

for(int i = n - 1; i >= 0; i--){
    long long tmp_a = a;
    long long tmp_b = b;
    int ith_a = tmp_a >> i & 1;
    int ith_b = tmp_b >> i & 1;

    if(ith_a == 1 && ith_b == 1){
        x = x << 1;
    } else if(ith_a == 0 && ith_b == 0){
        x = x << 1 | 1;
    } 
}
```

兩邊不一樣時，保留高位已經確定的數字中較小的那邊

```cpp
unsigned long long x = 0;

for(int i = n - 1; i >= 0; i--){
    long long tmp_a = a;
    long long tmp_b = b;
    int ith_a = tmp_a >> i & 1;
    int ith_b = tmp_b >> i & 1;
    
    if(ith_a == 1 && ith_b == 1){
        x = x << 1;
    } else if(ith_a == 0 && ith_b == 0){
        x = x << 1 | 1;
    } else if(((tmp_a >> (i + 1)) ^ x) > ((tmp_b >> (i + 1)) ^ x)){
        x = x << 1 | ith_a;
    } else {
        x = x << 1 | ith_b;
    }
}
```

最後輸出答案即可

```cpp
return (((a ^ x) % MOD) * ((b ^ x) % MOD)) % MOD;
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
#define MOD 1000000007

int maximumXorProduct(long long a, long long b, int n) {
    unsigned long long x = 0;

    for(int i = n - 1; i >= 0; i--){
        long long tmp_a = a;
        long long tmp_b = b;
        int ith_a = tmp_a >> i & 1;
        int ith_b = tmp_b >> i & 1;
        
        if(ith_a == 1 && ith_b == 1){
            x = x << 1;
        } else if(ith_a == 0 && ith_b == 0){
            x = x << 1 | 1;
        } else if(((tmp_a >> (i + 1)) ^ x) > ((tmp_b >> (i + 1)) ^ x)){
            x = x << 1 | ith_a;
        } else {
            x = x << 1 | ith_b;
        }
    }

    return (((a ^ x) % MOD) * ((b ^ x) % MOD)) % MOD;
}
```
 