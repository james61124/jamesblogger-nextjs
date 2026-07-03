---
title: "[ Leetcode 456 ] 132 Pattern | 解題思路分享"
date: "2026-03-13"
author: James
tags: Monotonic Stack,Amazon
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 3
---

給一個 nums[i]，如果能找到 i < j < k 其中 nums[i] < nums[k] < nums[j]，那就回傳 true

題目連結 🔗：[https://leetcode.com/problems/132-pattern/](https://leetcode.com/problems/132-pattern/)

### **問題分析**

這題如果暴力解把所有 subsequence 都列出來時間複雜度會太高，

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
bool find132pattern(vector<int>& nums) {
    int n = nums.size();
    int second = INT_MIN;
    stack<int>st;

    for(int i = n - 1; i >= 0; i--){
        if(nums[i] < second) return true;

        while(!st.empty() && st.top() < nums[i]){
            second = max(second, st.top());
            st.pop();
        }

        st.push(nums[i]);
    }

    return false;
}
```