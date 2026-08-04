---
title: "[ Leetcode 496 ] Next Greater Element I | 解題思路分享"
date: "2025-03-06"
author: James
tags: Array,Hash Table,Stack,Monotonic Stack
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
id: 9b8c4945-c6dd-40dc-82d8-221cced7c297
---

給定兩個 array `nums1` 和 `nums2`，其中 `nums1` 是 `nums2` 的 subset，我們需要在 `nums2` 中為 `nums1` 中的每個數字找到下一個較大元素。

題目連結 🔗：[https://leetcode.com/problems/next-greater-element-i/](https://leetcode.com/problems/next-greater-element-i/)

## 問題分析

關鍵在於我們要怎麼找到下一個大於自己的 element，如果重新跑一次迴圈肯定太費時。

## 解題思路 - Monotonic Stack

Monotonic Stack 的設計完美符合這種題目，因為可以設計讓 stack 中的數字一定是 decreasing，這樣 iterate 到下一個數如果比 stack.top() 還要大，就表示這個就是 stack.top() 的 next greater element，這裡有兩個問題需要解決：

### Hash Map 的建立

我們不可能 nums1 要什麼數字我們就重新 iterate 一次 nums2 來找 next greater element，所以我們必須建立一個 hash map 來存所有 nums2 element 的 next greater element，也就是 unordered_map

### 找 Next Greater Element 的過程

iterate 到下一個數如果比 stack.top() 還要大，就表示這個就是 stack.top() 的 next greater element，再來就將這組存進去 hash map 中然後 pop 出來，再來繼續看這樣還是不是比 stack.top()，直到現在這個數比 stack.top() 小為止，就 push 進去 stack 中。

### 收尾

收尾就很簡單了，stack 最後剩下的都是沒有 next greater element 的，就都在 hash map 填 -1，然後就可以去查 hash map 了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

## Implementation
```cpp
vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        
    unordered_map<int, int>mp;
    stack<int>st;
    vector<int> ans;

    for( int num : nums2 ){
        while( !st.empty() && num > st.top() ) {
            mp[st.top()] = num;
            st.pop();
        }
        st.push(num);
    }

    while( !st.empty() ) {
        mp[st.top()] = -1;
        st.pop();
    }

    for( int num : nums1 ) {
        ans.push_back(mp[num]);
    }

    return ans;
}
```