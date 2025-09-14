---
title: "[ Leetcode 205 ] Isomorphic Strings | 解題思路分享"
date: "2025-09-10"
author: James
tags: Hash Table,String,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/isomorphic-strings/](https://leetcode.com/problems/isomorphic-strings/)

### **問題分析**



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