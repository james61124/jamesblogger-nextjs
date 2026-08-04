---
title: "[ Leetcode 125 ] Valid Palindrome | 解題思路分享"
date: "2025-02-15"
author: James
tags: Two Pointers,String
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: f85109d8-5431-4e99-8c36-db21abb8048a
---

這題要求判斷給定的字串是否是「回文」（Palindrome），忽略大小寫和非字母數字字符。

題目連結🔗：[https://leetcode.com/problems/valid-palindrome/](https://leetcode.com/problems/valid-palindrome/)

## 解題思路 - Opposite Direction Two Pointers

這題可以用 opposite direction 的 two pointers 來解，判斷 left 跟 right 有沒有一樣就可以了，一樣的話 pointer 一起往內收縮。比較需要注意的只有 left 跟 right 不能超出 index 的範圍，然後 isalnum() 可以拿來判斷 char 是不是數字。

**Time Complexity** - `O(n)`，每個元素最多被 right 或 left 掃過。<br>
**Space Complexity** - `O(1)`，只使用了兩個指針

### Implementation

```cpp
bool isPalindrome(string s) {
    int left = 0;
    int right = s.size()-1;
    while(left < right) {
        while(left < right && !isalnum(s[left])) left++;
        while(left < right && !isalnum(s[right])) right--;
        if(tolower(s[left])!=tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}
```