---
title: "[ Leetcode 647 ] Palindromic Substrings | 解題思路分享"
date: "2025-05-20"
author: James
tags: String,Two Pointers,Manacher,EAC
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---



題目連結 🔗：[https://leetcode.com/problems/palindromic-substrings/](https://leetcode.com/problems/palindromic-substrings/)

### **問題分析**

遇到 Palindromic 最直覺的就是 Expand Around Center (EAC)，只要處理好奇數中心跟偶數中心即可。

### **解題思路 - Expand Around Center (EAC)**

非常直覺，對於每一組奇數跟偶數中心，用 Two Pointers 從中心擴展看看是不是回文，找到一組就更新 `count`，基本上就結束了。

```cpp
int countSubstrings(string s) {
    int count = 0;
    for(int i = 0; i < s.size(); i++){
        int left = i, right = i;
        while(left >= 0 && right < s.size() && s[left] == s[right]){
            count++;
            left--;
            right++;
        }

        left = i;
        right = i + 1;
        while(left >= 0 && right < s.size() && s[left] == s[right]){
            count++;
            left--;
            right++;
        }
    }

    return count;
}
```

這樣寫其實沒什麼大問題，沒什麼思考過應該就會直接寫出這個版本，奇數中心做一次偶數中心做一次，不過如果想要解決中間重複的兩個 while loop，除了拉一個 function 出來，也可以這樣寫：

```cpp
int countSubstrings(string s) {
    int count = 0;
    for (int center = 0; center < 2 * s.size() - 1; center++) {
        int left = center / 2;
        int right = left + center % 2;
        while (left >= 0 && right < s.size() && s[left] == s[right]) {
            count++;
            left--;
            right++;
        }
    }
    return count;
}
```

把 center 拉到兩倍大，所以 center 跟 left, right 的關係如下：

```
center = 0 -> left = 0, right = 0
center = 1 -> left = 0, right = 1
center = 2 -> left = 1, right = 1
center = 3 -> left = 1, right = 2
...
```

這樣就完美跑過所有基數偶數中心的狀況了。

**Time Complexity** - `O(n^2)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int countSubstrings(string s) {
    int count = 0;
    for (int center = 0; center < 2 * s.size() - 1; center++) {
        int left = center / 2;
        int right = left + center % 2;
        while (left >= 0 && right < s.size() && s[left] == s[right]) {
            count++;
            left--;
            right++;
        }
    }
    return count;
}
```

### **另解 - Manacher**



**Time Complexity** - `O(m+n)`<br>
**Space Complexity** - `O(m+n)`

#### **Implementation**

```cpp

```