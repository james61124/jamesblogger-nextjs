---
title: "[ Leetcode 28 ] Find the Index of the First Occurrence in a String | 解題思路分享"
date: "2025-09-05"
author: James
tags: String,KMP Algorithm,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 2
---

給兩個 string `haystack` 跟 `needle`，找出 `haystack` 中第一次出現 `needle` 的 index。

題目連結 🔗：[https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)

### **解題思路**

這題直接暴力解需要花 O(n * m) 的時間，所以必須用到鼎鼎大名的 KMP Algorithm，但這真的有點複雜，我寫在另一篇文章裡面，基本上看完就解完了，程式碼一模一樣。

[[ Algorithm ] KMP Algorithm | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/kmp)

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(m)`

### **Implementation**

```cpp
int strStr(string haystack, string needle) {
    int n = haystack.size(), m = needle.size();
    vector<int>lps(m, 0);
    for(int i = 1, len = 0; i < m;){
        if(needle[i] == needle[len]){
            lps[i] = len + 1;
            len++;
            i++;
        } else if(len > 0) {
            len = lps[len - 1];
        } else {
            lps[i] = 0;
            i++;
        }
    }

    for(int i = 0, j = 0; i < n;){
        if(haystack[i] == needle[j]){
            i++;
            j++;
        } else if(j > 0) {
            j = lps[j - 1];
        } else {
            i++;
        }
        if(j == m) return i - j;
    }

    return -1;
}
```
