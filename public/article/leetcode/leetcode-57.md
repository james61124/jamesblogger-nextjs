---
title: "[ Leetcode 57 ] Insert Interval | 解題思路分享"
date: "2025-04-01"
author: James
tags: Array,Interval
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 3
---

給一個不重疊且按起點排序的 intervals[i]，以及一個新的區間 newInterval，將 newInterval 插入到 intervals 中，並確保最終的區間仍然有序且無重疊。

題目連結 🔗：[https://leetcode.com/problems/insert-interval/](https://leetcode.com/problems/insert-interval/)

### **問題分析**

題目要求把 interval insert 進去，所以我們需要處理三種狀態，newInterval 前的 interval 都不需要動，newInterval 後的 interval 也不用動，只要判斷哪裡會 overlap，把中間所有會 overlap 的 interval 合併成一個就可以了。

### **解題思路**

所以我們需要判斷什麼樣的條件下 newInterval 會跟 intervals[i] overlap，第一個階段中，只要 `intervals[i][1] < newInterval[0]`，那就表示他們不會重疊，所以可以直接先寫出來：

```cpp
while(i<intervals.size() && intervals[i][1] < newInterval[0]){
    result.push_back(intervals[i]);
    i++;
}
```

第二階段當 `newInterval[1] >= intervals[i][0]` 的時候表示兩段 interval 是有重疊的，那因為 overlap 的部分最後只會合併成一個 interval，所以我們只要找出 max 跟 min 兩個點就是這個 interval 的範圍了。

```cpp
int start = newInterval[0];
int end = newInterval[1];
while(i<intervals.size() && newInterval[1] >= intervals[i][0]){
    start = min(start, intervals[i][0]);
    end = max(end, intervals[i][1]);
    i++;
}
result.push_back({start, end});
```

最後把剩下的部分補回去就行了

```cpp
while(i<intervals.size()){
    result.push_back(intervals[i]);
    i++;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    vector<vector<int>>result;
    int i=0;

    while(i<intervals.size() && intervals[i][1] < newInterval[0]){
        result.push_back(intervals[i]);
        i++;
    }

    int start = newInterval[0];
    int end = newInterval[1];
    while(i<intervals.size() && newInterval[1] >= intervals[i][0]){
        start = min(start, intervals[i][0]);
        end = max(end, intervals[i][1]);
        i++;
    }
    result.push_back({start, end});

    while(i<intervals.size()){
        result.push_back(intervals[i]);
        i++;
    }

    return result;
}
```
