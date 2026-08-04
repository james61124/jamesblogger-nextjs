---
title: "[ Leetcode 1792 ] Maximum Average Pass Ratio | 解題思路分享"
date: "2025-09-21"
author: James
tags: Greedy,Priority Queue,Google,Meta
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: e48ce33b-b8ce-421a-a1cd-777dfd1620bb
---

給定多門課的成績資料 `classes` = [`pass_i`, `total_i`]，以及 `extraStudents` 個一定會通過的額外學生；把這些學生分配到各課後，每門課會變成 [`pass_i`+1, `total_i`+1]。目標是分配完後，使所有課的平均通過率（各課 `pass_i`/`total_i` 的平均）最大，並回傳這個最大平均值。

題目連結 🔗：[https://leetcode.com/problems/maximum-average-pass-ratio/](https://leetcode.com/problems/maximum-average-pass-ratio/)

## 問題分析

這題基本上只有一個關鍵，`extraStudents` 要加在哪個 class 才會讓整體的 ratio 提升最多，我們只需要比較加 student 前跟加 student 後的 ratio 差就可以了，簡單來說，我們要找到的是在所有 classes 中

> 邊際提升 (`pass` + 1 ) / (`total` + 1 ) - `pass` / `total` 最大的

然後把一個 student 丟過去這個班，但因為丟一次 student，這個值就會變，所以我們要一個一個學生丟然後去找到每一輪的最大值是哪一個，那用 Priority Queue 就可以解決了

## 解題思路 - Greedy

這就是一種 Greedy，思路很簡單，首先我們要找到最大值，所以就建個 Max Heap，把所有東西都丟進去

```cpp
static inline double gain(double x, double y) {
    return (double)(x + 1) / (double)(y + 1) - (double)x / (double)y;
}

struct Compare {
    bool operator()(pair<int, int> a, pair<int, int> b) {
        return gain(a.first, a.second) < gain(b.first, b.second);
    }
};

double maxAverageRatio(vector<vector<int>>& classes, int extraStudents) {
    int n = classes.size();
    priority_queue<pair<int, int>, vector<pair<int, int>>, Compare> pq;

    for(int i = 0; i < n; i++) pq.push({classes[i][0], classes[i][1]});
}
```

接著執行 `extraStudents` 輪，每一次都挑 priority queue 中最大的出來，並把 student 加上去，然後再推回 prirotiy queue 中

```cpp
while(extraStudents > 0) {
    pair<int, int>c = pq.top();
    pq.pop();
    pq.push({c.first + 1, c.second + 1});
    extraStudents--;
}
```

最後在計算最終的 average pass ratio 即可

```cpp
double sum = 0.0;
while(!pq.empty()) {
    pair<int, int>c = pq.top();
    pq.pop();

    sum += (double)c.first / (double)c.second;
}
```

**Time Complexity** - `O(n + klogn)`<br>
**Space Complexity** - `O(n)`

## Implementation

```cpp
static inline double gain(double x, double y) {
    return (double)(x + 1) / (double)(y + 1) - (double)x / (double)y;
}

struct Compare {
    bool operator()(pair<int, int> a, pair<int, int> b) {
        return gain(a.first, a.second) < gain(b.first, b.second);
    }
};

double maxAverageRatio(vector<vector<int>>& classes, int extraStudents) {
    int n = classes.size();
    priority_queue<pair<int, int>, vector<pair<int, int>>, Compare> pq;

    for(int i = 0; i < n; i++) pq.push({classes[i][0], classes[i][1]});

    while(extraStudents > 0) {
        pair<int, int>c = pq.top();
        pq.pop();
        pq.push({c.first + 1, c.second + 1});
        extraStudents--;
    }

    double sum = 0.0;
    while(!pq.empty()) {
        pair<int, int>c = pq.top();
        pq.pop();

        sum += (double)c.first / (double)c.second;
    }

    return sum / (double)n;
}
```