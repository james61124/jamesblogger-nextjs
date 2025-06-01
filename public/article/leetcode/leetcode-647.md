---
title: "[ Leetcode 647 ] Palindromic Substrings | 解題思路分享"
date: "2025-05-20"
author: James
tags: String,Two Pointers,Manacher,EAC
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個 string `s`，計算 `s` 中有多少回文。

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

這樣就完美跑過所有奇數偶數中心的狀況了。

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

### **時間優化 - Manacher**

Manacher Algorithm 是一個 based on EAC 的演算法，他可以把時間複雜度從 O(n^2) 降到 O(n)，我另外寫了一篇文章專門講 Manacher's Algorithm，先看完再來解這題。

文章連結🔗：[[ Algorithm ] Manacher's Algorithm | 核心概念與 Leetcode 題型解析](https://jamesblogger.com/program/articles/manacher)

所以我們會利用 Manacher 維護一個 p[i] 代表「以 i 為中心的最長回文半徑」，再來我們要利用 p[i] 計算以每一個 i 為中心的回文數量。

先看奇數回文中心，回文中心點 c 的 p[i] 跟「以 c 為中心的回文數量」關係如下，可以發現 p[i] 每增加兩個，回文數量就會加一。

| s | c 的 p[i] | # of 回文 |
|-------------|----------------|---------------------|
| # c # | 1 | 1 |
| # a # c # a # | 3 | 2 |
| # a # a # c # a # a # | 5 | 3 |

再來看偶數回文中心，所以 p[i] 會在 `#` 上，而中心點 `#` 的 p[i] 跟「以 `#` 為中心的回文數量」關係如下，一樣可以發現 p[i] 每增加兩個，回文數量就會加一。

| s | 中心的 p[i] | # of 回文 |
|-------------|----------------|---------------------|
| # a # a # | 2 | 1 |
| # a # a # a # a # | 4 | 2 |
| # a # a # a # a # a # a # | 6 | 3 |

那根據這兩張表我們就可以知道，回文數量 `count` 就是 (p[i] + 1) / 2;

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
string preprocess(const string& s) {
    string t = "^";
    for (char c : s) {
        t += "#" + string(1, c);
    }
    t += "#$";
    return t;
}

int countSubstrings(string s) {
    string t = preprocess(s);
    int n = t.size();
    vector<int> p(n, 0); 

    int center = 0, right = 0;
    for (int i = 1; i < n - 1; i++) {

        int mirror = 2 * center - i;
        if (i < right) p[i] = min(right - i, p[mirror]);

        while (t[i + p[i] + 1] == t[i - p[i] - 1]) p[i]++;

        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }
    }

    int count = 0;
    for (int i = 1; i < n - 1; ++i) {
        count += (p[i] + 1) / 2; 
    }
    return count;
}
```