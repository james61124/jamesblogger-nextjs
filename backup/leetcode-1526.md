---
title: "[ Leetcode 1526 ] Minimum Number of Increments on Subarrays to Form a Target Array | 解題思路分享"
date: "2025-12-08"
author: James
tags: Array,Greedy,Google
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/minimum-number-of-increments-on-subarrays-to-form-a-target-array/](https://leetcode.com/problems/minimum-number-of-increments-on-subarrays-to-form-a-target-array/)

### **問題分析**

這題會遇到的問題就是如果 array 中間的數字比較小，兩側的數字會被「切開」造成 operations 數量的增加，舉例來說，nums = [3, 2, 1, 2, 3]，經過第一步驟後 nums = [1, 1, 1, 1, 1]，但左右兩邊就要分別各自做 increment 了，我們要能計算到這些被「切開」的狀況



### **解題思路**



**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int minMeetingRooms(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    priority_queue<int, vector<int>, greater<>>overlap;
    int result = 0;

    for(auto& interval : intervals){
        int start = interval[0];
        int end = interval[1];

        while(!overlap.empty() && start >= overlap.top()) overlap.pop();
        overlap.push(end);
        result = max(result, (int)overlap.size());
    }

    return result;
}
```
