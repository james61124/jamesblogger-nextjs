---
title: "[ Leetcode 253 ] Meeting Rooms II | 解題思路分享"
date: "2025-11-18"
author: James
tags: Array,Priority Queue,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 20d21b05-1b4f-4966-b070-81cc19bc57b0
---

給一個 intervals[i] = [starti, endi]，求最多同時重疊的 intervals 有多少個？

題目連結 🔗：[https://leetcode.com/problems/meeting-rooms-ii/](https://leetcode.com/problems/meeting-rooms-ii/)

### **問題分析**

我們要找到方法紀錄同一個時間重疊的 intervals 有多少個，我們可以把所有重疊的 intervals 都記錄在一個 list 裡面，但關鍵是要怎麼判斷有新的 intervals 進來這個 list，誰跟新進來的沒有 overlap 要出去？

我們可以先將所有 intervals 用 start time 排序，所以當新的 interval 的 start time >= 舊的 interval 的 end time，代表這邊沒有 overlap，舊的 interval 要被移出去，所以儲存 interval 的 list 需要有排序的功能，才可以由小到大檢查舊的 interval 的 end。

這樣想就清楚很多，只要把所有重疊的 intervals 放到 priority queue 裡面就行了

### **解題思路 - Priority Queue**

我們先將 intervals sort 過

```cpp
sort(intervals.begin(), intervals.end());
```

再來看每一個 intervals，如果舊的 intervals 跟新的沒有重疊就把它 pop 出來

```cpp
for(auto& interval : intervals){
    int start = interval[0];
    int end = interval[1];

    while(!overlap.empty() && start >= overlap.top()) overlap.pop();
    overlap.push(end);
}
```

最後過程中 priority queue 最大的 size 就是答案

```cpp
for(auto& interval : intervals){
    int start = interval[0];
    int end = interval[1];

    while(!overlap.empty() && start >= overlap.top()) overlap.pop();
    overlap.push(end);
    result = max(result, (int)overlap.size());
}
```

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
