---
title: "[ Leetcode 3228 ] Maximum Number of Operations to Move Ones to the End | 解題思路分享"
date: "2025-11-19"
author: James
tags: String,Greedy,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 string `s`，裡面只會出現 0 跟 1，遇到 1 可以把它往右推到下一個 1 之前，這樣算是一次 operation，直到不能再推為止，求最大可以做幾次 operation

題目連結 🔗：[https://leetcode.com/problems/maximum-number-of-operations-to-move-ones-to-the-end/](https://leetcode.com/problems/maximum-number-of-operations-to-move-ones-to-the-end/)

### **問題分析**

這題可以將整個字串分組，相鄰的 `1` 就屬於同一組，以組為單位去做計算。

看下面的過程，如果 s = `101100111`，第一組只有一個 1，他會先被推到第二組的前面，變成 `011100111`，此時第二組就會變成有三個 1，再整組往後推變成 `000111111`，也就是說「每一組的數量會累加」，而且每一次往後推都會整組一起往後推，這是一個 Greedy 的過程

### **解題思路 - Greedy**

所以我們利用 `curr` 紀錄目前的組裡面有多少 `1`，當遇到 `1` 就更新 `curr`，要往後推時就把 `curr` 的數量更新到 result 就可以了

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int maxOperations(string s) {
    int curr = 0;
    int op = 0;
    for(int i = 0; i < s.size() - 1; i++){
        if(s[i] == '1'){
            curr++;
            if(s[i + 1] == '0') op += curr;
        }
    }

    return op;
}
```
