---
title: "[ Leetcode 392 ] Is Subsequence | 解題思路分享"
date: "2025-09-01"
author: James
tags: String,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
---

給兩個 string `s`, `t`，判斷 `s` 是不是 `t` 的 subsequence。

題目連結🔗：[https://leetcode.com/problems/is-subsequence/](https://leetcode.com/problems/is-subsequence/)

### **解題思路**

這題超簡單，按照順序比一下 `s` 的每個字母是不是都有按照順序出現在 `t` 裡就好。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
bool isSubsequence(string s, string t) {
    int i = 0;
    for(char c : t){
        if(i < s.size() && s[i] == c) i++;
    }

    return i == s.size();
}
```