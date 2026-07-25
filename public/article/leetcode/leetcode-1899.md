---
title: "[ Leetcode 1899 ] Merge Triplets to Form Target Triplet | 解題思路分享"
date: "2025-08-25"
author: James
tags: Array,Greedy
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: f9b8fd2d-e681-4a7f-b2f6-c29b6c06b027
---

給一個 triplets array，而 triplets[i] = [ai, bi, ci]，再來給一個 target = [x, y, z]，任選兩個 triplets i 跟 j，可以將其中一個 triplet 改成 [max(ai, aj), max(bi, bj), max(ci, cj)]，如果可以成功合併出 target 就回傳 `true`，否則回傳 `false`。

題目連結 🔗：[https://leetcode.com/problems/merge-triplets-to-form-target-triplet/](https://leetcode.com/problems/merge-triplets-to-form-target-triplet/)

### **解題思路 - Greedy**

如果三個位置分開來看，我們要找的是所有 Triplets 中不大於 target 的最大值，但假設 index 0 確實是目前 不大於 target 的最大值，很有可能 index 1 或是 index 2 是大於 target 的，這樣這個 Triplets 就不能用了。

所以這題簡單來說，只能使用 Triplets 中每個 elements 不大於對應 target 的值的 Triplets，而合併時，對應位置取最大值，如果合併出來的結果跟 target 一樣，就表示這題可以回傳 `true`。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
bool mergeTriplets(vector<vector<int>>& triplets, vector<int>& target) {
    int c0 = 0, c1 = 0, c2 = 0;

    for(auto &t : triplets){
        if(t[0] <= target[0] && t[1] <= target[1] && t[2] <= target[2]){
            c0 = max(c0, t[0]);
            c1 = max(c1, t[1]);
            c2 = max(c2, t[2]);
        }
    }

    return (c0 == target[0]) && (c1 == target[1]) && (c2 == target[2]);
}
```