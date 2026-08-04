---
title: "[ Leetcode 383 ] Ransom Note | 解題思路分享"
date: "2025-09-10"
author: James
tags: Hash Table,String,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: 52c06c74-7b3c-46e3-a5e1-36709ff3fdb0
---

給兩個 string `ransomNote` 跟 `magazine`，判斷 `ransomNote` 是不是可以用 `magazine` 的字母組合出來

題目連結 🔗：[https://leetcode.com/problems/ransom-note/](https://leetcode.com/problems/ransom-note/)

## 問題分析

沒啥特別的，就建個 Hash Table 儲存每個字母出現過的次數就好

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

## Implementation

```cpp
bool canConstruct(string ransomNote, string magazine) {
    int dict[26] = {0};
    for(char &c : magazine) dict[c - 'a']++;
    for(char &c : ransomNote) {
        if(dict[c - 'a'] > 0) dict[c - 'a']--;
        else return false;
    }

    return true;
}
```