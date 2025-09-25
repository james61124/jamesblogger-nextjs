---
title: "[ Leetcode 20 ] Valid Parentheses | 解題思路分享"
date: "2025-03-06"
author: James
tags: String,Stack
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
---

給一個只包含 `'('`, `')'`, `'{'`, `'}'`, `'['`, `']'` 的 string `s`，檢查這個 string 是否是 valid 的括號組合。

題目連結 🔗：[https://leetcode.com/problems/valid-parentheses/](https://leetcode.com/problems/valid-parentheses/)

### **問題分析**

判斷括號就是最經典的 First In, Last Out (FILO) 的問題，所以直接開 Stack 就可以解了，所以這邊稍微思考一下 edge case。

### **解題思路 - Stack**

這題需要一個 stack，在 iterate string 的時候，如果碰到左括號，就把 char 塞進去 stack 裡，那如果碰到右括號 :
- 如果 stack 最上面的那個 element 不是相對應的左括號 -> invalid
- 如果是，就直接把這個 element pop 出來然後繼續 iterate

#### **如何判斷是不是相對應的 Parenthese?**

判斷是否是相對應的 parentheses，if-else 也可以，但是會比較慢也比較醜，這邊直接開 hash map 應該是最優雅的解。

#### **避免 Stack Empty Access**

如果碰到右括號時 stack 是空的，直接 call stack.top() 會報錯，所以就直接 return false 就可以了。

#### **收尾**

因為 iterate 結束的時候就會跳出回圈，如果最後一個 char 是左括號，那他在 push 進去 stack 之後就會跳出 loop 了，所以判斷是不是 valid 的 parentheses 直接看 stack 是不是空的就可以了。

**Time Complexity** - `O(n)`，因為 iterate 一個 string <br>
**Space Complexity** - `O(n)`，因為開了一個 stack

#### **Implementation**

```cpp
bool isValid(string s) {
    stack<char>st;
    unordered_map<char, char>mp = {{')', '('}, {'}', '{'}, {']', '['}};

    for(char c : s){
        if(mp.count(c)){
            if(st.empty() || mp[c] != st.top()) return false;
            else st.pop();
        } else st.push(c);
    }

    return st.empty();
}
```