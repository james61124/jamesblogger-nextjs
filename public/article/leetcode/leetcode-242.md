---
title: "[ Leetcode 242 ] Valid Anagram | 解題思路分享"
date: "2025-04-25"
author: James
tags: Hash Table,String
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給兩個字串 `s` 和 `t`，請判斷 `t` 是否是 `s` 的 anagram。

題目連結 🔗：[https://leetcode.com/problems/valid-anagram/](https://leetcode.com/problems/valid-anagram/)

### **問題分析**

這題我們必須記錄其中一個 string 的 char，然後去另一個 string 判斷是否都在裡面，所以很明顯要用 Hash Table 來紀錄。

### **解題過程 - Hash Table**

這題第一感可以直接用 unordered_map 解，也確實可以用 unordered_map 解，但是如果是這種紀錄字母的題目，Hash Table 最多也只會有 26 個 key 而已，所以其實直接用 size 26 的 array 就可以了，這樣速度也會更快。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
bool isAnagram(string s, string t) {
    int count[26] = {0};
    for(char c : s) count[c - 'a']++;
    for(char c : t) count[c - 'a']--;
    for(int i = 0; i < 26; i++)
        if(count[i] != 0) return false;
    
    return true;
}
```
