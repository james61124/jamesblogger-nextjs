---
title: "[ Leetcode 137 ] Single Number II | 解題思路分享"
date: "2025-12-01"
author: James
tags: Array,Bit Manipulation,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: 5b5a154d-dc1e-40c8-8827-6c6da0464088
---

給 nums[i]，每種數字都會出現剛好三次，只有一種數字只出現一次，找出這個數字

題目連結 🔗：[https://leetcode.com/problems/single-number-ii/](https://leetcode.com/problems/single-number-ii/)

## 問題分析

這種找 unique number 在 Bit Manipulation 中有一個很常用的觀念

> a ^ a = 0<br>
> a ^ 0 = a

換句話說，如果整個 array 只有一種數字只出現一次，把所有數字都 XOR 起來，就會留下他，因為其他數字都會變成 0，但這題的每種數字都會出現三次，如果全部都 XOR 起來是行不通的，所以我們要想其他方法

## 解題思路 - Bit Manipulation

如果一種數字最多出現兩次，用剛剛 XOR 的方法可以把數字記錄成 state

```
num = a
appear 0 times -> 0
appear 1 times -> a
appear 2 times -> 0
```

當數字出現超過兩次，一個 bit 的 state 顯然不夠用，那如果是兩個 bit 的 state 呢？像是這樣

```
num = a
appear 0 times -> 0 0
appear 1 times -> a 0
appear 2 times -> 0 a
appear 3 times -> 0 0
```

每三次一個 cycle，這樣不就解決了？所以當所有數字都 XOR 起來，第一個 bit 留下的數字就會是答案

思路清晰，再來要看公式本身要怎麼寫，首先我們讓兩個 bit 的下一個 state 都先接上 XOR

```cpp
first  = first ^ num
second = second ^ num
```

但當 `num` 出現第一次時，`second` 應該要維持是 0，當 `num` 出現第三次時 `first` 應該要維持是 0，所以簡單來說，`second` = a 的時候，表示 `num` 已經出現 2 次，那 `one` 就不該動要維持是 0，所以這邊要加個 condition

```cpp
first  = first ^ num & (~second)
second = second ^ num
```

這個時候 `first` 已經更新了，更新過後的 `first` 如果是 a，表示這個數字剛出現第一次，那 `second` 就要維持 0，所以這邊也要加一個 condition

```cpp
first = (first ^ num) & (~second);
second = (second ^ num) & (~first);
```

這樣這題就解完了

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

## Implementation

```cpp
int singleNumber(vector<int>& nums) {
    int first = 0;
    int second = 0;

    for(int& num : nums){
        first = (first ^ num) & (~second);
        second = (second ^ num) & (~first);
    }

    return first;
}
```
