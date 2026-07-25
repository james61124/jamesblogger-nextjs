---
title: "[ Leetcode 58 ] Length of Last Word | 解題思路分享"
date: "2025-09-01"
author: James
tags: String,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 2
id: 6aae60af-1cce-42f6-a939-9baeec7a0622
---

給一個 string，裡面有 words 跟一些 space，問最後一個字的長度是多少。

題目連結 🔗：[https://leetcode.com/problems/length-of-last-word/](https://leetcode.com/problems/length-of-last-word/)

### **解題思路**

最直覺的做法是利用 `getline` 把每個字分離出來，直接計算最後一個字的長度就好。不過既然他是要看最後一個字的長度，前面根本就不用計算，所以其實可以從最後面 iterate 回來，跳過空格部分直接計算最後一個字的長度就好。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int lengthOfLastWord(string s) {
    int length = 0;
    int i = s.size() - 1;
    while(i >= 0 && s[i] == ' ') i--;

    while(i >= 0 && s[i] != ' ') {
        length++;
        i--;
    }

    return length;
}
```
