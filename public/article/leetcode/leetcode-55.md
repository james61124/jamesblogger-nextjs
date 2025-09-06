---
title: "[ Leetcode 55 ] Jump Game | 解題思路分享"
date: "2025-03-30"
author: James
tags: Array,Greedy
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
---

給一個 array `nums`，其中 nums[i] 表示在 index `i` 時 最多可以往前跳多少步，判斷是否能從 index 0 跳到最後一個位置，若可以則返回 true，否則返回 false。

題目連結 🔗：[https://leetcode.com/problems/jump-game/](https://leetcode.com/problems/jump-game/)

### **問題分析**

這題最直覺的解法應該是 BFS，可以走到的 node 都再繼續走，但這樣可能就會需要計算很多次一樣的 node，所以我後來發現，如果 node 是 k，表示 k 格以內的他都可以走到，也就是說我不用記錄每一個我可以走到的 node，我只要記錄最大的那個 node 就好，因為如果走得到 node `i`，這之內的所有 node 我其實都走得到。

### **解題思路 - Greedy**

這個想法應該比較像 Greedy 不是 DP，iterate `nums[i]` 並持續更新 `maxIndex` 紀錄目前可以走到的最大 index 是多少，如果 i 比 maxIndex 大了表示我們已經走不到後面的 node 了，就要 return `false`。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
bool canJump(vector<int>& nums) {
    int maxIndex = 0;
    for(int i=0; i<=maxIndex && i<nums.size(); i++){
        maxIndex = max(maxIndex, i+nums[i]);
        if(maxIndex >= nums.size()-1) return true;
    }
    return false;
}
```