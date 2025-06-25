---
title: "[ Leetcode 150 ] Evaluate Reverse Polish Notation | 解題思路分享"
date: "2025-06-24"
author: James
tags: Stack
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一組 string 的陣列 `tokens`，這是一個 Reverse Polish Notation，要回傳對應的整數，例如：

```python
tokens = ["2", "1", "+", "3", "*"]
2 + 1 = 3
3 * 3 = 9

result = 9
```

題目連結 🔗：[https://leetcode.com/problems/evaluate-reverse-polish-notation/](https://leetcode.com/problems/evaluate-reverse-polish-notation/)

### **問題分析**

看到這種四則運算的題目，基本上可以先往 stack 去想，因為越靠近 operator 的會越先做，符合 First In Last Out 的特性。

### **解題思路 - Stack**

思路不會太複雜，如果遇到數字，就直接推進去 stack，如果遇到 operator，表示需要被計算了，就把 stack 中最外面的兩個數字拿出來計算，算完再塞回去 stack。

首先我們要先判斷 `tokens` 裡的 string 是不是數字，c++ 中可以用 `isdigit` 判斷 char 是不是數字，但是 token 可能會有負數的情況，所以我們可以寫

```cpp
for(string token : tokens) {
    if(isdigit(token[0]) || isdigit(token[1])) {
        // token is digit
    } else {
        // token is not digit
    }
}
```

我們也可以直接用 operator 判斷就好

```cpp
bool isOperator(string token) {
    return (token == "+") || (token == "-") || (token == "*") || (token == "/");
}

int evalRPN(vector<string>& tokens) {
    for(string token : tokens) {
        if(isOperator(token)) {
            // token is not digit
        } else {
            // token is digit
        }
    }
}
```

如果 `token` 不是數字，表示要把 stack 中最外面的兩個數字拿出來計算，算完再塞回去 stack

```cpp
int calculate(int num1, int num2, char op){
    if(op == '+') return num1 + num2;
    else if(op == '-') return num2 - num1;
    else if(op == '*') return num1 * num2;
    else return num2 / num1;
}

bool isOperator(string token) {
    return token == '+' || token == '-' || token == '*' || token == '/';
}

int evalRPN(vector<string>& tokens) {
    for(string token : tokens) {
        if(isOperator(token)) {
            int num1 = st.top(); st.pop();
            int num2 = st.top(); st.pop();
            st.push(calculate(num1, num2, token[0]));
        } else {
            // token is digit
        }
    }
}
```

如果 `token` 是數字，我們要把 `token` 轉成數字之後塞回去 stack 中，這邊有兩種做法，c++ 其實有內建的 function 可以用，就是 `stoi`，所以簡單寫就是這樣：

```cpp
int calculate(int num1, int num2, char op){
    if(op == '+') return num1 + num2;
    else if(op == '-') return num2 - num1;
    else if(op == '*') return num1 * num2;
    else return num2 / num1;
}

bool isOperator(string token) {
    return (token == "+") || (token == "-") || (token == "*") || (token == "/");
}

int evalRPN(vector<string>& tokens) {
    stack<int>st;
    for(string token : tokens) {
        if(isOperator(token)) {
            int num1 = st.top(); st.pop();
            int num2 = st.top(); st.pop();
            st.push(calculate(num1, num2, token[0]));
        } else {
            st.push(stoi(token));
        }
    }
    return st.top();
}
```

那如果 `stoi` function 不能用或是沒有想到這個 function，自己實作一下也不會很複雜，只要知道這個轉換式就行了，每看一個位數就先計算起來儲存著，然後每一次都 * 10，也就是往左邊移一位，然後再把新的位數放進來

```cpp
for(int i = 0; i < n; i++) {
    num = num * 10 + (s[i] - '0');
}
```

最後把整個 function 補齊：

```cpp
int stringToInt(const string& s) {
    int i = 0, n = s.size();
    int sign = (s[0] == '-') ? -1 : 1;

    int num = 0;
    for(int i = 0; i < n; i++) {
        if(sign == -1 && i == 0) continue;
        num = num * 10 + (s[i] - '0');
    }

    return sign * num;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**
```cpp
int calculate(int num1, int num2, char op){
    if(op == '+') return num1 + num2;
    else if(op == '-') return num2 - num1;
    else if(op == '*') return num1 * num2;
    else return num2 / num1;
}

bool isOperator(string token) {
    return (token == "+") || (token == "-") || (token == "*") || (token == "/");
}

int evalRPN(vector<string>& tokens) {
    stack<int>st;
    for(string token : tokens) {
        if(isOperator(token)) {
            int num1 = st.top(); st.pop();
            int num2 = st.top(); st.pop();
            st.push(calculate(num1, num2, token[0]));
        } else {
            st.push(stoi(token));
        }
    }
    return st.top();
}
```