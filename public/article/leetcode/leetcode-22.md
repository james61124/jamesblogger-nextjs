---
title: "[ Leetcode 22 ] Generate Parentheses | 解題思路分享"
date: "2025-06-05"
author: James
tags: String,Backtracking
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 n，生成所有有效的 n 對括號組合。

題目連結 🔗：[https://leetcode.com/problems/generate-parentheses/](https://leetcode.com/problems/generate-parentheses/)

### **問題分析**

這題看到「列出所有解」，第一個想法就是朝 backtracking 想了。但這裡比較不像一般的 backtracking 一樣這麼好想 decision tree，我們需要一層一層剖析。

### **解題思路 - Backtracking**

對於每一個位置來說，我們都要可以放 `(` 還有 `)`，所以我們要思考的是甚麼情況下不能放 `(`，甚麼情況下不能放 `)`。

可以放 `)` 的前提就是前面有足夠的 `(` 需要解決，仔細想一下就會發現，只要前面的 `(` 數量大於 `)`，那這個 string 就不會是 invalid。而 `(` 就比較簡單了，數量只要不要放超過 `n` 就行。

那我們設一個變數 `dict`，`dict[0]` 表示 `(` 的數量，`dict[1]` 表示 `)` 的數量。

```cpp
void backTracking(vector<string>& result, int dict[], string& s, int n){
    if(dict[0] < n){
        s += "(";
        dict[0]++;
        backTracking(result, dict, s, n);
        s.pop_back();
        dict[0]--;
    }

    if(dict[1] < dict[0]){
        s += ")";
        dict[1]++;
        backTracking(result, dict, s, n);
        s.pop_back();
        dict[1]--;
    }
}
```

如果 string `s` 的長度是 `n` 的兩倍，表示 backtracking 到最後一層了，要把答案推進去 result 中，所以完整的程式碼是這樣：

```cpp
void backTracking(vector<string>& result, int dict[], string& s, int n){
    if(s.size() == n * 2) {
        result.push_back(s);
        return;
    }

    if(dict[0] < n){
        s += "(";
        dict[0]++;
        backTracking(result, dict, s, n);
        s.pop_back();
        dict[0]--;
    }

    if(dict[1] < dict[0]){
        s += ")";
        dict[1]++;
        backTracking(result, dict, s, n);
        s.pop_back();
        dict[1]--;
    }
}

vector<string> generateParenthesis(int n) {
    vector<string>result;
    int dict[2] = {0, 0};
    string s = "";
    backTracking(result, dict, s, n);

    return result;
}
```

這應該是最直覺的寫法，但我們其實寫法可以稍微優化一下，既然我們只是要傳遞 string `s` 再外加一個 char，我們不用大費周章再建立一個 string 接上去再拔掉，就當成參數一路傳遞就好。紀錄個數其實也不用開一個 Hash Map，都利用參數傳遞就可以了，這樣 function 就會變得很簡潔。

```cpp
void backTracking(vector<string>& result, string s, int n, int open, int close){
    if(s.size() == n * 2) {
        result.push_back(s);
        return;
    }

    if(open < n) backTracking(result, s + '(', n, open + 1, close);
    if(close < open) backTracking(result, s + ')', n, open, close + 1);
}

vector<string> generateParenthesis(int n) {
    vector<string>result;
    backTracking(result, "", n, 0, 0);
    return result;
}
```

**Time Complexity** - `O(Catalan(n) * 2n)` = `O(4^n / sqrt(n))`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
void backTracking(vector<string>& result, string s, int n, int open, int close){
    if(s.size() == n * 2) {
        result.push_back(s);
        return;
    }

    if(open < n) backTracking(result, s + '(', n, open + 1, close);
    if(close < open) backTracking(result, s + ')', n, open, close + 1);
}

vector<string> generateParenthesis(int n) {
    vector<string>result;
    backTracking(result, "", n, 0, 0);
    return result;
}
```