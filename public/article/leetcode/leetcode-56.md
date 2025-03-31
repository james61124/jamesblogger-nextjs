---
title: "[ Leetcode 56 ] Merge Intervals | 解題思路分享"
date: "2025-03-31"
author: James
tags: Array,Sorting,Greedy
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個區間列表 `intervals`，其中每個區間由一個 array 表示 [start, end]，請合併所有重疊的區間並返回合併後的區間。

題目連結 🔗：[https://leetcode.com/problems/merge-intervals/](https://leetcode.com/problems/merge-intervals/)

### **解題思路 - Greedy**

假設我們現在有 intervals[i], intervals[j]，如果這兩段有重疊的話，要嘛 `intervals[i][0] <= intervals[j][0] <= intervals[i][1]`，要嘛 `intervals[i][0] <= intervals[j][1] <= intervals[i][1]`，我們如果固定其中一個就只要判斷一種情況就好，所以我們可以選擇將 intervals 做 sorting，這樣在 iterate intervals 時，intervals[j][0] 一定會大於等於 intervals[i][0]，我們就只需要判斷 intervals[j] 的右端點是不是在 intervals[i] 之間就行了。

我們維護 2D Array `result`，目前發現的 intervals 都推進去，但我們只需要關注他的最後一段 interval，因為我們已經把 intervals[i] sort 過了，所以 result 內前面的 interval 都不重要，發現的新 interval 要嘛是跟最後一個重疊，要嘛就是新的。

所以我們可以 iterate intervals，如果 intervals[i] 跟 result 內的 interval 沒有重疊，那表示是新的 interval，就把他 push 進去 result，如果有重疊，就直接更新這個 interval 的右端點就可以了。

**Time Complexity** - `O(nlogn)`，因為我們有 sorting<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
vector<vector<int>> merge(vector<vector<int>>& intervals) {
    int curMax = -1;
    vector<vector<int>>result;

    sort(intervals.begin(), intervals.end());
    for(int i=0; i<intervals.size(); i++){
        if(intervals[i][0] <= curMax){
            curMax = max(curMax, intervals[i][1]);
            result[result.size()-1][1] = curMax;
        } else {
            curMax = intervals[i][1];
            result.push_back(intervals[i]);
        }
    }

    return result;
}
```