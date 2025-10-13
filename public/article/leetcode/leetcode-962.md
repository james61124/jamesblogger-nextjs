---
title: "[ Leetcode 962 ] Maximum Width Ramp | 解題思路分享"
date: "2025-09-25"
author: James
tags: Stack,Monotonic Stack,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
---

給一個 nums[i]，如果 j < i 且 nums[j] < nums[i] 就表示 (j, i) 是一個 ramp，一個 ramp 的 width = i - j，求整個 nums[i] 中 width 最大的 ramp 是多少

題目連結 🔗：[https://leetcode.com/problems/maximum-width-ramp/](https://leetcode.com/problems/maximum-width-ramp/)

### **問題分析**

這題需要掌握一個關鍵，對於一個數 nums[i] 來說，如果有一個 j，其中 j < i 且 nums[j] < nums[i]，那不管 nums[i] 的右邊是什麼東西，nums[j] 都可以跟右邊的東西組成 width 更大的 ramp，也就是說

> 我們不需要「左邊有比自己更小值」的值

舉例來說，nums = [9, 8, 3, 4, 5, 2]，我們只需要一個從最左邊開始 decreasing 的 array，也就是 [9, 8, 5, 2]，而這可以用 Monotonic Stack 來實作。

### **解題思路 - Monotonic Stack**

我們先把這個 Monotonic Stack 寫出來

```cpp
int n = nums.size();
stack<int>st;

st.push(0);
for(int i = 1; i < n; i++){
    if(!st.empty() && nums[st.top()] >= nums[i]) st.push(i);
}
```

再來我們如果從 nums[i] 右邊做反向 iterate，當遇到 nums[i] 比目前的 `st.top()` 還要大，表示這是對於 `st.top()` 來說 width 最大的一個 ramp，所以計算完 width 之後就可以把它 pop 出來，直到 nums[i] 比目前的 `st.top()` 還要小，一直持續這個過程直到 stack 裡面沒有東西就可以了，最後計算最大的 width

```cpp
for(int i = n - 1; i >= 0 && !st.empty(); i--){
    while(!st.empty() && nums[st.top()] <= nums[i]){
        maxW = max(maxW, i - st.top());
        st.pop();
    }
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int maxWidthRamp(vector<int>& nums) {
    int n = nums.size();
    int maxW = 0;
    stack<int>st;

    st.push(0);
    for(int i = 1; i < n; i++){
        if(!st.empty() && nums[st.top()] >= nums[i]) st.push(i);
    }

    for(int i = n - 1; i >= 0 && !st.empty(); i--){
        while(!st.empty() && nums[st.top()] <= nums[i]){
            maxW = max(maxW, i - st.top());
            st.pop();
        }
    }

    return maxW;
}
```
