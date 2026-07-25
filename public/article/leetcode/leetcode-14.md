---
title: "[ Leetcode 14 ] Longest Common Prefix | 解題思路分享"
date: "2025-09-01"
author: James
tags: Array,String,Top Interview,Google,Meta
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 2
id: 28fe1c78-19c0-4977-bb4a-1be316dc5b41
---

給一個 string 的 array `strs`，輸出最長的 common prefix。

題目連結 🔗：[https://leetcode.com/problems/longest-common-prefix/](https://leetcode.com/problems/longest-common-prefix/)

### **解題思路**

這題最直覺的做法應該是 i 從 0 開始，比較每一個字串的第 i 個字，直到有字串不一樣就輸出答案，不過這樣做的時間複雜度是 `O(n * m)`，其中 n 是 `strs` 的長度，m 是最短字串的長度，理論上會有更快的做法。

所以我們其實不用一個一個比較每一個字是不是一樣，如果 string 是「有序的」排列，那比較最前面跟最後面的字就可以了，因為他們的字典序距離最遠，實作不難，就直接進實作。

**Time Complexity** - `O(n log n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
string longestCommonPrefix(vector<string>& strs) {
    sort(strs.begin(), strs.end());
    int i = 0, n = strs.size();
    while(i < strs[0].size() && i < strs[n - 1].size() && strs[0][i] == strs[n - 1][i])
        i++;
    
    return strs[0].substr(0, i);
}
```
