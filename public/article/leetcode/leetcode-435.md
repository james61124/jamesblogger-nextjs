---
title: "[ Leetcode 435 ] Non-overlapping Intervals | 解題思路分享"
date: "2025-05-20"
author: James
tags: Array,Greedy,Sorting
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給定一組 intervals，要從中刪除最少的區間，使得剩下的區間互不重疊。

題目連結 🔗：[https://leetcode.com/problems/non-overlapping-intervals/](https://leetcode.com/problems/non-overlapping-intervals/)

### **問題分析**

我們要刪除 intervals 讓 intervals 間不要有重疊，這題的重點其實只有一個

> 留下來的 intervals 要為後面的 intervals 留越多空間越好

這樣代表後面可以放越多 intervals，也就代表我們需要 remove 的 intervals 越少，那這種「局部最優解」，就是 Greedy 的範疇。

### **解題思路 - Greedy**

我們要為後面的 intervals - [start, end] 留空間，意味著我們要先將 intervals 按照 end 排序，如果我們按照 start 排序，可能會出現我們不小心把 [1, 2] 刪掉，但是留下 [1, 10] 這種超長的 interval，導致後面跟他重疊的全部都要被刪掉，那如果用 end 排序，就可以控制我們只會刪掉有重疊且比較短的 interval。

先講一下排序，c++ 要自訂 compare function 很簡單，像這樣就可以：

```cpp
static bool compare(const vector<int>& a, const vector<int>& b) {
    return a[1] < b[1];
}

sort(intervals.begin(), intervals.end(), compare);
```

compare function 如果 return `true`，表示 a 要在 b 前面，那這邊要注意如果 compare(a, a) 一定要 return `false`，因為 c++ 的 sorting 是 strict week sorting，所以如果今天寫成下面這樣可能就會報錯：

```cpp
static int compare(int a, int b) {
    return a <= b;
}
```

再來我想要聊一件事情

> compare function 按照 end 排序，為什麼 end 相同的情況下 start 不用排？

這是因為在 end 相同的情況下 start 不管怎麼排最後刪掉的 intervals 數量是一樣的，舉例來說：

```
[6, 10]
[7, 10] -> remove
[8, 10] -> remove

[8, 10]
[7, 10] -> remove
[6, 10] -> remove
```

像這樣交換順序，因為 end 一樣的關係，除了第一組，後面全部都會重疊所以都要 remove，即使是跟其他 interval 有重疊也是：

```
[3, 7]
[6, 10] -> remove
[7, 10] 
[8, 10] -> remove
[9, 10] -> remove

[3, 7]
[9, 10]
[8, 10] -> remove
[7, 10] -> remove
[6, 10] -> remove
```

除了第一組沒有跟前面重疊的會保留，其他也都得 remove，因此我們不需要管 start 的順序

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
static bool compare(const vector<int>& a, const vector<int>& b) {
    return a[1] < b[1];
}

int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), compare);

    int end = INT_MIN;
    int result = 0;
    for(int i = 0; i < intervals.size(); i++){
        if(intervals[i][0] < end) result++;
        else end = intervals[i][1];
    }

    return result;
}
```
