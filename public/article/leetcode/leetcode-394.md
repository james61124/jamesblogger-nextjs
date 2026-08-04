---
title: "[ Leetcode 394 ] Decode String | 解題思路分享"
date: "2025-11-18"
author: James
tags: String,Stack,Recursion,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 75cc2324-93e0-4111-9892-2f1b8f588d34
---

給一個 string 例如 `2[a]3[ab4[c]]`，給出 decode 後的結果，數字代表括號內的東西要重複的次數

題目連結 🔗：[https://leetcode.com/problems/decode-string/](https://leetcode.com/problems/decode-string/)

## 問題分析

遇到這種括號的題目直覺是用 stack 解，這題其實也可以但是不太好想，最直覺的 stack 解是計算完括號裡面的內容後推回去 stack，最後把 stack 裡面的所有東西再重新 pop 出來組合就可以了，但是這樣如果有 nested 的括號就要一直重複 push, pop

所以這題我換個思路用 recursion 做，當遇到數字表示有後面的東西需要重複好幾次，就進到下一層 recursion 裡去處理，處理完回傳回來再繼續往下即可

## 解題思路 - Recursion

我們建立一個 recursion 的 function 來協助我們，i 代表目前 visit 到的 index，而這個 function 會回傳當下這個括號 repeat n 次之後的結果

```cpp
string buildString(string& s, int n, int& i) {
    string curr = "";
    while(i < s.size()){
        // calculate curr
    }
    return curr;
}
```

當遇到數字，表示需要進行下一層的 recursion，就把它需要 repeat 多少次算出來一起給下一層

```cpp
int convertStrToNum(string& s, int& i){
    int num = 0;
    while(i < s.size() && isdigit(s[i])){
        num *= 10;
        num += s[i] - '0';
        i++;
    }
    return num;
}

string buildString(string& s, int n, int& i) {
    string curr = "";
    while(i < s.size()){
        
        if(isdigit(s[i])){
            int times = convertStrToNum(s, i);
            i++;
            curr += buildString(s, times, i);
        }

        i++;
    }

    return curr;
}
```

再來遇到 `]` 表示這層 recursion 應該要結束了，就直接 repeat n 次回傳，剩下的部分就直接推進去 `curr`

```cpp
int convertStrToNum(string& s, int& i){
    int num = 0;
    while(i < s.size() && isdigit(s[i])){
        num *= 10;
        num += s[i] - '0';
        i++;
    }
    return num;
}

string buildString(string& s, int n, int& i) {
    string curr = "";
    while(i < s.size()){
        
        if(isdigit(s[i])){
            int times = convertStrToNum(s, i);
            i++;
            curr += buildString(s, times, i);
        }
        else if(s[i] == ']'){
            string tmp = "";
            for(int j = 0; j < n; j++) tmp += curr;
            return tmp;
        } else curr += s[i];

        i++;
    }

    return curr;
}
```

最後全部組合起來就是答案

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### Implementation

```cpp
int convertStrToNum(string& s, int& i){
    int num = 0;
    while(i < s.size() && isdigit(s[i])){
        num *= 10;
        num += s[i] - '0';
        i++;
    }
    return num;
}

string buildString(string& s, int n, int& i) {
    string curr = "";
    while(i < s.size()){
        
        if(isdigit(s[i])){
            int times = convertStrToNum(s, i);
            i++;
            curr += buildString(s, times, i);
        }
        else if(s[i] == ']'){
            string tmp = "";
            for(int j = 0; j < n; j++) tmp += curr;
            return tmp;
        } else curr += s[i];

        i++;
    }

    return curr;
}

string decodeString(string s) {
    int i = 0;
    return buildString(s, 1, i);
}
```

## Optimization

這題其實有可能的小優化可以做，用 stack 版本比較不好想但是寫起來比較優雅，另外 repeat n 次的部分如果 n 大一點，可以用 2 的冪次方做優化，不過這邊就先省略這部分。
