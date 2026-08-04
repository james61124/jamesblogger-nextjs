---
title: "[ Leetcode 1046 ] Last Stone Weight | 解題思路分享"
date: "2025-07-23"
author: James
tags: Priority Queue
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 90e96ba8-0d4b-4594-98cb-180a5b038e08
---

給一堆石頭，stones[i] 代表每顆石頭的重量，每次選出兩個最重的石頭 `x`, `y` 進行碰撞，如果 `x == y`，那兩者消失，如果 `x != y`，則留下 `abs(x - y)`，重複上述過程直到只剩一顆或沒有石頭，回傳最後石頭的重量（或 0）

題目連結 🔗：[https://leetcode.com/problems/last-stone-weight/](https://leetcode.com/problems/last-stone-weight/)

## 問題分析

這題要找到當下最大的兩個數字，拿出來計算完差值後推回去再繼續找下兩個，直到整個陣列剩下一個數字，這種「找最大 / 小的前 k 個數字」用 Priority Queue 就可以了，沒什麼特別的地方

## 解題思路 - Priority Queue

先將所有 stones 放入 priority queue

```cpp
priority_queue<int>pq;
for(int stone : stones) pq.push(stone);
```

把前兩大的數字拿出來，如果不一樣，就計算差值放回去

```cpp
while(pq.size() > 1){
    int first = pq.top(); pq.pop();
    int second = pq.top(); pq.pop();
    if(first != second) pq.push(first - second);
}
```

當最後剩下兩個石頭都一樣的時候，就會發現裡面不會剩下任何石頭，這時就 return `0`，不然就回傳剩下的最後一顆石頭

```cpp
return pq.empty() ? 0 : pq.top();
```

**Time Complexity** - `O(n log n)`<br>
**Space Complexity** - `O(n)`

## Implementation

```cpp
int lastStoneWeight(vector<int>& stones) {
    priority_queue<int>pq;

    for(int stone : stones) pq.push(stone);
    while(pq.size() > 1){
        int first = pq.top(); pq.pop();
        int second = pq.top(); pq.pop();
        if(first != second) pq.push(first - second);
    }

    return pq.empty() ? 0 : pq.top();
}
```