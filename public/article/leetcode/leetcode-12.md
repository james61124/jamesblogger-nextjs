---
title: "[ Leetcode 12 ] Integer to Roman | 解題思路分享"
date: "2025-09-01"
author: James
tags: Hash Table,String,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 2
id: 149d429f-36b4-4103-9c0f-67bd3d5cb48f
---

給定一個整數 `num`，將它轉換成羅馬數字並回傳。

羅馬數字的符號與數值對應如下：

> `I` = 1<br>
> `V` = 5<br>
> `X` = 10<br>
> `L` = 50<br>
> `C` = 100<br>
> `D` = 500<br>
> `M` = 1000

轉換的方式是重複加法，例如：`III` = 3, `XX` = 20, `MM` = 2000，減法記號只出現在特定情況：

> `IV` = 4<br>
> `IX` = 9<br>
> `XL` = 40<br>
> `XC` = 90<br>
> `CD` = 400<br>
> `CM` = 900

題目連結 🔗：[https://leetcode.com/problems/integer-to-roman/](https://leetcode.com/problems/integer-to-roman/)

### **解題思路**

這題原本想法是先建立一個 Hash Table 儲存 symbol 跟 value 的對應關係，再來一個一個看要放哪些 symbol，當遇到 symbol 要連續放四次的就用減法解決。

這個方法確實可行，但是還要多判斷一些情況有點麻煩，這題有說只有 `4`, `9`, `40`, `90`, `400`, `900` 需要用到減法，那其實乾脆全部都放到 Hash Table 裡面就可以了。

```cpp
vector<pair<int,string>> v = {{1000, "M"}, {900, "CM"}, {500, "D"}, {400, "CD"}
        , {100, "C"}, {90, "XC"}, {50, "L"}, {40, "XL"}, {10, "X"}, {9, "IX"}
        , {5, "V"}, {4, "IV"}, {1, "I"}};
```

後面就很簡單了，利用除法分析出每一個 symbol 要放幾個，推進去答案就可以了。

```cpp
string res = "";
    
for(auto &[value, symbol] : v) {
    if(value > num) continue;
    int count = num / value;
    for(int i = 0; i < count; i++) res += symbol;
    num %= value;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
string intToRoman(int num) {
    vector<pair<int,string>> v = {{1000, "M"}, {900, "CM"}, {500, "D"}, {400, "CD"}
        , {100, "C"}, {90, "XC"}, {50, "L"}, {40, "XL"}, {10, "X"}, {9, "IX"}
        , {5, "V"}, {4, "IV"}, {1, "I"}};
    string res = "";
    
    for(auto &[value, symbol] : v) {
        if(value > num) continue;
        int count = num / value;
        for(int i = 0; i < count; i++) res += symbol;
        num %= value;
    }

    return res;
}
```
