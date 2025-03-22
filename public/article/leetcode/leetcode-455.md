---
title: "[ Leetcode 455 ] Assign Cookies | 解題思路分享"
date: "2025-03-22"
author: James
tags: Array,Greedy,Two Pointers,Sorting
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

題目要求我們用餅乾來滿足孩子的需求。給兩個 array：

`g`：表示每個孩子的胃口大小，數字越大代表胃口越大。<br>
`s`：表示每塊餅乾的大小，數字越大代表餅乾越大。

我們的目標是將餅乾分配給孩子，並盡可能使最多的孩子得到他們需要的餅乾。每個孩子只能獲得一塊餅乾，且餅乾的大小必須大於等於孩子的胃口才能滿足該孩子。

題目連結 🔗：[https://leetcode.com/problems/assign-cookies/](https://leetcode.com/problems/assign-cookies/)

### **解題思路 - Greedy**

Greedy 簡單來說就是每一次選擇，都做出當下看起來最後的選擇，也就是說局部的最優解會導致全局的最優解，以這題來說，從胃口最小的小孩開始，每一個小孩都分給他滿足這個小孩最小的餅乾，分完了答案就出來了，細節沒甚麼好講的，直接看程式碼就行了。

**Time Complexity** - `O(n log n + m log m)`，因為這題需要 sorting<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int findContentChildren(vector<int>& g, vector<int>& s) {
    sort(g.begin(), g.end());
    sort(s.begin(), s.end());

    int g_index = 0;
    for(int i=0; i<s.size(); i++){
        if(g_index >= g.size()) break;
        if(g[g_index] <= s[i]) g_index++;
    }

    return g_index;
}
```