---
title: "[ Leetcode 739 ] Daily Temperatures | 解題思路分享"
date: "2025-03-06"
author: James
tags: Array,Stack,Monotonic Stack
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
id: 446fb038-6338-40bd-8764-bca83e244aa3
---

給一個整數 array `temperatures`，表示每天的溫度，對於每一天，我們需要找到離當天最近的一個更高的日子，並返回該天跟當前天的天數，如果沒有更高的溫度，就返回 0。

題目連結 🔗：[https://leetcode.com/problems/daily-temperatures/](https://leetcode.com/problems/daily-temperatures/)

## 問題分析

這題的關鍵在於找到下一個比自己大的數字，所以直接就想到 Monotone Stack。

## 解題思路 - Monotone Stack

Monotone Stack 的設計完美符合這種題目，因為可以設計讓 stack 中的數字一定是 decreasing，這樣 iterate 到下一個數如果比 stack.top() 還要大，就表示這個就是 stack.top() 的 next greater element，利用這個思路我們繼續往下想：

### Stack 儲存數字的選擇

建立一個 Monotone Stack 儲存 temperatures，iterate temperatures 的時候就可以找到 next greater element，問題是題目要存的是兩者的 index 差，所以只存 next greater element 在 hash map 的話，我也不知道他們的 index 差，所以這裡換個思維，我們可以直接存 index 就好。

如果需要 push element 進去 stack，我們直接 push index 進去，所以在比較 st.top() 跟目前的 element 就只需要比 temperatures[st.top()] 就可以了，這樣就可以完美解決這個問題。

### Result 的呈現

最後我們要將跟 next greater element 的 index 差存到 vector 中，我們可以直接宣告一個 vector 然後初始化為 0，找到 index 差之後就填進去，沒有填到的部分就是本來就沒有 next greater element，所以就維持 0。

**Time Complexity** - `O(n)`，只跑過一次迴圈 iterate `temperatures`<br>
**Space Complexity** - `O(n)`，只開了一個 stack 跟 1D vector

### Implementation
```cpp
vector<int> dailyTemperatures(vector<int>& temperatures) {
    stack<int>index;
    vector<int>result(temperatures.size(), 0);

    for(int i=0; i<temperatures.size(); i++){
        while( !index.empty() && temperatures[i] > temperatures[index.top()]) {
            result[index.top()] = i - index.top();
            index.pop();
        }
        index.push(i);
    }

    return result;
}
```


