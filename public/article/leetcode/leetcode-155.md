---
title: "[ Leetcode 155 ] Min Stack | 解題思路分享"
date: "2025-06-24"
author: James
tags: Stack,Design
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 2
id: e4f067c2-f86f-4821-902c-b9fd3858e145
---

實作 min stack，除了要可以實現一般 stack 的功能，還要多實現 `getMin`，在 O(1) 的時間要找到 stack 中的最小值。

題目連結 🔗：[https://leetcode.com/problems/min-stack/](https://leetcode.com/problems/min-stack/)

## 問題分析

我們如果直接用一般的 stack 做，會遇到的問題是我們沒有辦法找到最小值，會需要 iterate 整個 stack。所以我們可以往下思考，能不能同步紀錄每個狀態下的最小值，這樣在 pop 的時候，就一起把該狀態下的最小值一起 pop 掉就好。

## 解題思路 - Stack

簡單來說，我們需要另一個 stack，在 push 的時候同時紀錄當下的最小值就行了，所以我們先定義兩個 stack

```cpp
stack<int>st;
stack<int>stMin;
```

`push` 時除了要 push 進去主要的 stack，同時要計算目前最小值是什麼，而 `stMin` 的 top 是上一個狀態的最小值，直接拿目前的 `val` 跟上一個狀態的最小值比，就可以找到目前的最小值了

```cpp
void push(int val) {
    st.push(val);
    if(!stMin.empty()) stMin.push(min(val, stMin.top()));
    else stMin.push(val);
}
```

那剩下的 function 就非常簡單，填一填就好

```cpp
void pop() {
    st.pop();
    stMin.pop();
}

int top() {
    return st.top();
}

int getMin() {
    return stMin.top();
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

## Implementation
```cpp
class MinStack {
private:
    stack<int>st;
    stack<int>stMin;
public:
    MinStack() {}
    
    void push(int val) {
        st.push(val);
        if(!stMin.empty()) stMin.push(min(val, stMin.top()));
        else stMin.push(val);
    }
    
    void pop() {
        st.pop();
        stMin.pop();
    }
    
    int top() {
        return st.top();
    }
    
    int getMin() {
        return stMin.top();
    }
};
```