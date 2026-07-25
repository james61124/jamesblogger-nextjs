---
title: "[ Leetcode 274 ] H-Index | 解題思路分享"
date: "2025-08-31"
author: James
tags: Array,Counting Sort,Greedy,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 2
id: ea32f508-b55a-4579-b642-5a5ec44f676f
---

給一個 citations[i] 代表每一篇論文獲得的引用次數，找到最大的數 h，讓至少有 h 篇論文的引用次數 ≥ h。

題目連結 🔗：[https://leetcode.com/problems/h-index/](https://leetcode.com/problems/h-index/)

### **問題分析**

最直覺的做法就是 sorting，再來由尾巴開始慢慢比較，但是 sorting 需要耗費 O(nlogn)，有沒有方法可以只用 O(n) 就解決這個問題呢？

### **解題思路 - Counting Sort**

舉個例子，`citations = [3, 0, 6, 1, 5]`，sorting 後的結果是 [0, 1, 3, 5, 6]，再來我們開始由後面比較，citations >= 6 有一篇論文，citations >= 5 有兩篇論文，citations >= 3 有三篇論文，所以答案就是 3，我們如果只是要計算 citations >= `x` 有幾篇論文，我們不需要先將 array sort 過才能實現這件事情，完全可以先計算起來放著。

我們可以新開空間，利用 count[i] 紀錄 citations `i` 次總共有幾篇論文，像是這樣

```cpp
int n = citations.size();
vector<int>count(n + 1, 0);

for(int c : citations){
    if(c > n) count[n]++;
    else count[c]++;
}
```

再來從後面加回來，就可以算出 citations >= `i` 次共有幾篇論文，就可以找到最大的 `h` 了。

```cpp
int curr = 0;

for(int i = count.size() - 1; i >= 0; i--){
    curr += count[i];
    if(curr >= i) return i;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**

```cpp
int hIndex(vector<int>& citations) {
    int n = citations.size();
    int curr = 0;
    vector<int>count(n + 1, 0);

    for(int c : citations){
        if(c > n) count[n]++;
        else count[c]++;
    }

    for(int i = count.size() - 1; i >= 0; i--){
        curr += count[i];
        if(curr >= i) return i;
    }

    return 0;
}
```