---
title: "[ Leetcode 205 ] Isomorphic Strings | 解題思路分享"
date: "2025-09-10"
author: James
tags: Hash Table,String,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 3
readTime: 3
---

給兩個 string `s`, `t`，判斷兩個 string 是否是 isomorphic，意思就是每種字元的對應必須要一對一的，多對一跟一對多都不行。

題目連結 🔗：[https://leetcode.com/problems/isomorphic-strings/](https://leetcode.com/problems/isomorphic-strings/)

### **問題分析**

最直覺的做法應該是建立 Hash Table 儲存哪個 `s` 的 char 對應到哪個 `t` 的 char，不過這樣就會需要浪費一個 Hash Table 的空間，甚至還需要另一個 unordered_set 來記錄哪些字母已經被用過了，但這題可以換個思路想

> 只要紀錄每種 char 出現的最後一個 index 就可以了

如果符合題目說的一種 char 只能對應到一種 char，那這種 char 最後一次出現的 index 在兩個 string 中一定是一樣的，反之只要發現不一樣，立馬就知道要 return false，這樣想實作就簡單很多了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
bool isIsomorphic(string s, string t) {
    if(s.size() != t.size()) return false;

    int lastS[256] = {0};
    int lastT[256] = {0};

    for(int i = 0; i < s.size(); i++){
        int sInt = static_cast<unsigned char>(s[i]); 
        int tInt = static_cast<unsigned char>(t[i]); 

        if(lastS[sInt] != lastT[tInt]) return false;
        lastS[sInt] = i + 1;
        lastT[tInt] = i + 1;
    }

    return true;
}
```