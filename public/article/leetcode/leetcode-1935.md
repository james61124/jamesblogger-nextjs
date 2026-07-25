---
title: "[ Leetcode 1935 ] Maximum Number of Words You Can Type | 解題思路分享"
date: "2025-09-20"
author: James
tags: Hash Table,String,Google,Meta
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: fa803a54-ebde-4c6b-b3a1-b4265f72c7c3
---

給一個 string `text`，裡面有不同的 words 彼此用空格隔開，再給一個 `brokenLetters` 表示有哪些字母我們打不出來，要輸出 `text` 中我們可以成功打出多少 words。

題目連結 🔗：[https://leetcode.com/problems/maximum-number-of-words-you-can-type/](https://leetcode.com/problems/maximum-number-of-words-you-can-type/)

### **問題分析**

這題就簡單照著題目走即可，因為要快速判斷 broken letter 有哪些，所以全部丟進去 hash table，再來一個一個字元比，如果發現遇到 broken letter，就跳去下一個字，如果發現都沒事然後就遇到下一個空格了，`result` 就可以加一表示我們可以打出這個字

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int canBeTypedWords(string text, string brokenLetters) {
    vector<bool>isBroken(26, false);
    int result = 0;

    for(char& c : brokenLetters) isBroken[c - 'a'] = true;
    for(int i = 0; i <= text.size(); i++) {
        if(i == text.size() || text[i] == ' ') {
            result++;
            continue;
        }
        if(isBroken[text[i] - 'a']) {
            while(i < text.size() && text[i] != ' ') i++;
        }
    }

    return result;
}
```