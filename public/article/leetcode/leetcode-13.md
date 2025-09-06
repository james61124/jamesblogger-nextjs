---
title: "[ Leetcode 13 ] Roman to Integer | 解題思路分享"
date: "2025-09-01"
author: James
tags: Hash Table,String,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
---

給你一個字串，表示一個 羅馬數字，請將它轉換成對應的整數。

羅馬數字的符號與數值對應如下：

> `I` = 1<br>
> `V` = 5<br>
> `X` = 10<br>
> `L` = 50<br>
> `C` = 100<br>
> `D` = 500<br>
> `M` = 1000

一般情況下，數字由大到小排列並加總，例如 `VI` = 6。若小數字在大數字前，則表示要減去該數字，例如 IV = 4 (5-1)

題目連結 🔗：[https://leetcode.com/problems/roman-to-integer/](https://leetcode.com/problems/roman-to-integer/)

### **解題思路**

首先各個英文字母跟對應的 value 可以直接建一個 Hash Table 對照

```cpp
unordered_map<char, int> values = {
    {'I', 1}, {'V', 5}, {'X', 10},
    {'L', 50}, {'C', 100}, {'D', 500}, {'M', 1000}
};
```

再來一般情況我們直接將字母轉成 value 相加即可，遇到前面 value 比後面小的情況再用減的

```cpp
int total = 0;
for (int i = 0; i < s.size(); i++) {
    if (i + 1 < s.size() && values[s[i]] < values[s[i + 1]]) 
        total -= values[s[i]];
    else
        total += values[s[i]];
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int romanToInt(string s) {
    unordered_map<char, int> values = {
        {'I', 1}, {'V', 5}, {'X', 10},
        {'L', 50}, {'C', 100}, {'D', 500}, {'M', 1000}
    };

    int total = 0;
    for (int i = 0; i < s.size(); i++) {
        if (i + 1 < s.size() && values[s[i]] < values[s[i + 1]]) 
            total -= values[s[i]];
        else
            total += values[s[i]];
    }
    
    return total;
}
```
