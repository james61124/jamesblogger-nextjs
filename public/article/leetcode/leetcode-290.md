---
title: "[ Leetcode 290 ] Word Pattern | 解題思路分享"
date: "2025-10-06"
author: James
tags: Hash Table,String,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 3
readTime: 3
---

給一個 string `pattern`（例如 "abba"），給一個由空白分隔的 string `s`（例如 "dog cat cat dog"），判斷 `s` 的結構跟 `pattern` 有沒有一樣

題目連結🔗：[https://leetcode.com/problems/word-pattern/](https://leetcode.com/problems/word-pattern/)

### **問題分析**

這題我覺得跟 [ Leetcode 205 ] Isomorphic Strings 有點像，同樣都要判斷兩邊的對應是不是一對一，所以核心觀念就是

> 紀錄每種 pattern 出現的最後一個 index 就可以了

我們可以用兩個 Hash Table，一邊紀錄字母出現的最後一個 index，一邊紀錄單字出現的最後一個 index，如果檢查到出現過的兩邊最後一個 index 不一樣，就表示要直接 return false

### **解題思路**

簡單舉幾個例子，如果相同的字母對應到不同的字，例如

```
0 : a -> cat
1 : a -> dog
```

a 上一次在 0 的位置出現，dog 根本沒出現過，所以要 return false

如果相同的字對應到不同的字母，例如

```
0 : a -> cat
1 : b -> cat
```

cat 上一次出現在 0，但是 b 根本沒出現過，所以也要 return false

再來進實作，先寫出兩個 Hash Table

```cpp
unordered_map<string, int>mp1;
unordered_map<char, int>mp2;
```

`s` 要用空白格分開每個單字，這裡可以用 istringstream + getline 做

```cpp
istringstream iss(s);
string token;
while(getline(iss, token, ' ')){
    // ...
}
```

把出現的 index 填進去，注意這裡我用 1-index，為了避免 Hash Table 在沒有找到 key 的情況會 default value 是 0，我不想處理這類的 edge case

```cpp
int index = 0;
istringstream iss(s);
string token;
while(getline(iss, token, ' ')){
    mp1[token] = index + 1;
    mp2[pattern[index]] = index + 1;
    index++;
}
```

「最後出現的 index」如果不一樣就要直接 return false

```cpp
int index = 0;
istringstream iss(s);
string token;
while(getline(iss, token, ' ')){
    if(mp1[token] != mp2[pattern[index]]) return false;
    mp1[token] = index + 1;
    mp2[pattern[index]] = index + 1;
    index++;
}
```

最後如果 pattern 字數太多，s 裡面根本就沒有這麼多單字的話，也要 return false

```cpp
return index == pattern.size();
```

**Time Complexity** - `O(n)`，s 的長度<br>
**Space Complexity** - `O(k)`，s 中不同的單字數 + pattern 中不同的字元數

#### **Implementation**

```cpp
bool wordPattern(string pattern, string s) {
    unordered_map<string, int>mp1;
    unordered_map<char, int>mp2;

    int index = 0;
    istringstream iss(s);
    string token;
    while(getline(iss, token, ' ')){
        if(mp1[token] != mp2[pattern[index]]) return false;
        mp1[token] = index + 1;
        mp2[pattern[index]] = index + 1;
        index++;
    }

    return index == pattern.size();
}
```

