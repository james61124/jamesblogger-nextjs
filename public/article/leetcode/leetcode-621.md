---
title: "[ Leetcode 621 ] Task Scheduler | 解題思路分享"
date: "2025-07-04"
author: James
tags: Hash Table,Greedy
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 76252cbe-79a9-46c7-9d62-fa4c61ab1698
---

給一堆任務 tasks[i]，每一個任務所需的時間為 1，但是同樣任務需要冷卻 `n` 才能再做一次，問最小需要多長時間可以做完所有 tasks。

題目連結 🔗：[https://leetcode.com/problems/task-scheduler/](https://leetcode.com/problems/task-scheduler/)

## 問題分析

分析一下這題題型，需要做最多次的 task 會影響整體的架構，因為要用最快的速度做完所有 tasks，需要冷卻一過就馬上做這個 task 效率才會最高，舉例來說，如果 `A` 要做四次，n = 2，而這是全場需要做最多次的 task，架構就是這樣

```
A _ _ A _ _ A _ _ A
```

所以這題不是 DP，也不是 Sorting，就是一個 Greedy

## 解題思路 - Greedy

事實上我們可以列出一條公式就解完這題，上面的框架我們要觀察的是，剩下的 tasks 有沒有辦法把這些 idle 的空隙填滿，我們先計算這個框架的大小，這是「最小可能需要的時間」

先找出出現次數最多的那個字母，假設次數是 `maxFreq`，公式如下：

```cpp
minTime = (maxFreq - 1) * (n + 1) + 1
```

但如果需要做 `maxFreq` 的 tasks 不只一個，minTime 就會更大，像是下面的例子

```
A = 4 times
B = 4 times
n = 2

A B _ A B _ A B _ A B
```

所以常數項不是加一，而是要加上 `maxFreq` 出現的 tasks 數量，姑且叫做 `maxCount`，所以正確的公式如下：

```cpp
minTime = (maxFreq - 1) * (n + 1) + maxCount
```

那這是最小需要的時間，也就是說，如果 `tasks.size()` > `minTime`，表示剩下的 tasks 可以把 idle 的時間都塞滿，所以就需要花，tasks.size() 的時間

```cpp
return max(tasks.size(), minTime)
```

實作就很簡單就不細講了，唯一就是因為 `tasks` 限制在 26 字母內，所以 Hash Table 不用開到 `unordered_map`，利用 vector 開 size 26 即可。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
int leastInterval(vector<char>& tasks, int n) {
    vector<int>freq(26, 0);
    int maxFreq = 0, maxCount = 0;

    for(char c : tasks) freq[c - 'A']++;
    for(int i = 0; i < 26; i++) maxFreq = max(maxFreq, freq[i]);
    for(int i = 0; i < 26; i++) {
        if(freq[i] == maxFreq) maxCount++;
    }

    return max((int)tasks.size(), (maxFreq - 1) * (n + 1) + maxCount);
}
```
