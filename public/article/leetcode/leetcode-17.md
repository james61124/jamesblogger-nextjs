---
title: "[ Leetcode 17 ] Letter Combinations of a Phone Number | 解題思路分享"
date: "2025-05-27"
author: James
tags: Backtracking,Hash Table,String
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個只包含數字 `2-9` 的字串 `digits`，請回傳所有可能的字母組合。這些組合是根據電話鍵盤上的數字對應字母所轉換出來的。

| 數字 | 對應字母 |
|-------------|----------------|
| 2 | a, b, c |
| 3 | d, e, f |
| 4 | g, h, i |
| 5 | j, k, l |
| 6 | m, n, o |
| 7 | p, q, r, s |
| 8 | t, u, v |
| 9 | w, x, y, z |

題目連結 🔗：[https://leetcode.com/problems/letter-combinations-of-a-phone-number/](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

### **問題分析**

遇到需要列出所有情況的，就是利用 backtracking 走過所有路徑就可以了。

文章連結🔗：[[ Algorithm ] Backtracking | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/backtracking)

### **解題思路 - Backtracking**

針對每一個電話號碼建立 table，這樣就知道 backtracking 的每一層有哪些 action 可以走。

```cpp
vector<string>dict = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
```

每一個號碼都有 3 或 4 個字母可以選，相當於 backtracking 的 decision tree 每一層有 3 或 4 個 action，再來就是把每一個 trajectory 的 string 都推到 `result` 就結束了，非常標準沒甚麼變化的 backtracking。

**Time Complexity** - `O(4^n)`，假設有 n 層，每一層最多有 4 個 actions<br>
**Space Complexity** - `O(n * 4^n)`，最多有 4^n 個組合，每一個組合的長度是 n

#### **Implementation**

```cpp
vector<string>dict = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
vector<string>result;

void backTracking(string& s, string digits, int level){
    if(level >= digits.size()) {
        result.push_back(s);
        return;
    }

    int num = digits[level] - '0';
    for(char c : dict[num]){
        s += c;
        backTracking(s, digits, level + 1);
        s.pop_back();
    }
}

vector<string> letterCombinations(string digits) {
    if(digits == "") return result;

    string s = "";
    backTracking(s, digits, 0);
    return result;
}
```
