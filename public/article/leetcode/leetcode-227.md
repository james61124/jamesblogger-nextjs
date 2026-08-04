---
title: "[ Leetcode 227 ] Basic Calculator II | 解題思路分享"
date: "2025-03-06"
author: James
tags: String,Stack,Math
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 217afd10-4a2a-4245-9fcd-4a5170f124c9
---

給一個只包含非負整數、+、-、*、/ 和空格的 string，計算它的 value。運算順序需符合標準的數學運算規則（ 先乘除，後加減 ），但不允許使用 eval()。

題目連結🔗：[https://leetcode.com/problems/basic-calculator-ii/](https://leetcode.com/problems/basic-calculator-ii/)

## 問題分析

這題要想辦法解決先乘除後加減的問題，所以可能會有 last in first out 發生，所以選擇用 stack 去思考。

## 解題思路 - Stack

直覺就是利用 stack，然後當遇到 '*', '/' 的時候就把數字 pop 出來計算，再塞回去。這裡會先需要處理一些問題：

### 數字的判讀

由於會出現非個位數的情況，這邊可以用一個很聰明的解法，這樣就可以計算出目前 iterate 到的整數 `num`。

```cpp
for(char c : s){
    if( isdigit(c) ) {
        num = num * 10 + ( c - '0' );
    }
}
```

### Operator 的判讀

再來我們必須處理 operator 的問題，這裡分四種情況討論，遇到 operator 後：

1. 如果上一個 operator 是 '+'，那直接把 `num` 推進去 stack
2. 如果上一個 operator 是 '-'，把 `-num` 推進去 stack，這樣後面在做加總就可以直接加
3. 如果上一個 operator 是 '*'，表示現在這個 num 必須先跟 stack.top() 做乘法，就先把他 pop 出來計算再推回去
4. 如果上一個 operator 是 '/'，跟 '*' 同理，只是換成除法

最後再把整個 stack 的數字加總起來，就是答案。

⚠️ string `s` iterate 結束的時候，因為最後一位不是 operator，所以跳出迴圈的時候要再處理一下最後一個 `num` 然後更新 stack。

**Time Complexity** - `O(n)`，因為 iterate 一個 string<br>
**Space Complexity** - `O(n)`，因為開了一個 stack

## Implementation

```cpp
void updateParam( char& op, int& num, stack<int>& st) {
    switch( op ){
        case '+':
            st.push(num);
            break;
        case '-':
            st.push(-num);
            break;
        case '*':
            num *= st.top();
            st.pop();
            st.push(num);
            break;
        case '/':
            num = st.top() / num;
            st.pop();
            st.push(num);
            break;
    }
}

int calculate(string s) {
    int num = 0;
    char op = '+';
    int sum = 0;
    stack<int>st;

    for(char c : s){
        if( isdigit(c) ) {
            num = num * 10 + (c - '0');
        } else if( c != ' ' ) {
            updateParam(op, num, st);
            op = c;
            num = 0;
        } 
    }
    updateParam(op, num, st);

    while( !st.empty() ) {
        sum += st.top();
        st.pop();
    }

    return sum;
}
```

## 空間優化

但其實仔細觀察會發現，我們從頭到尾都只需要用到 stack 的 top() 而已，前面的數字我們可以提前先加起來，就不用一直 store 在 stack 中，這樣就可以節省掉 stack 的空間，因此這邊做一個優化，拿掉 stack 後新增兩個變數：

- **topNum**：就是原本 stack 的 top()
- **result**：就是 stack 中早就可以加總的部分

**Time Complexity** - `O(n)`，因為 iterate 一個 string<br>
**Space Complexity** - `O(1)`，不用開 stack 了

## Implementation

```cpp
void updateParam( char& op, int& result, int& num, int& topNum ) {
    switch( op ){
        case '+':
            result += topNum;
            topNum = num;
            break;
        case '-':
            result += topNum;
            topNum = -num;
            break;
        case '*':
            topNum *= num;
            break;
        case '/':
            topNum /= num;
            break;
    }
}

int calculate(string s) {
    int result = 0;
    int num = 0;
    int topNum = 0;
    char op = '+';

    for(char c : s){
        if( isdigit(c) ) {
            num = num * 10 + (c - '0');
        } else if( c != ' ' ) {
            updateParam(op, result, num, topNum);
            op = c;
            num = 0;
        } 
    }

    updateParam(op, result, num, topNum);
    return result + topNum;
}
```