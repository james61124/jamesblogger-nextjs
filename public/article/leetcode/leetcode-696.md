---
title: "[ Leetcode 696 ] Count Binary Substrings | 解題思路分享"
date: "2026-03-13"
author: James
tags: String,Amazon
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 3
---

給一個 string `s`，裡面只有 `0`, `1`，算出所有 `0`, `1` 數量一樣且 `0`, `1` 彼此相連的 substring 的數量

題目連結 🔗：[https://leetcode.com/problems/count-binary-substrings/](https://leetcode.com/problems/count-binary-substrings/)

### **問題分析**

我們可以計算每一群 `0`, `1` 的數量，而 substring 的數量就是 min(前一群數量, 這一群數量)，把每相鄰兩群的 substring 數量都加起來就好

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int countBinarySubstrings(string s) {
    int result = 0;
    int prev = 0;
    int curr = 0;
    char currChar = s[0];
    for(char& c : s){
        if(c == currChar) curr++;
        else {
            result += min(prev, curr);
            prev = curr;
            curr = 1;
            currChar = c;
        }
    }
    result += min(prev, curr);
    return result;
}
```