---
title: "[ Leetcode 981 ] Time Based Key-Value Store | 解題思路分享"
date: "2025-07-17"
author: James
tags: String,Hash Table,Binary Search,Design
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/time-based-key-value-store/](https://leetcode.com/problems/time-based-key-value-store/)

### **問題分析**

簡單來說，這題想要一個 data structure，可以快速找到「小於等於 `timestamp` 的最大值」，但 `timestamp` 的儲存順序是遞增的。

也就是說，他給的實際上就是 increasing array 了，不用再進行 sorting，那要在 sorted array 中找到 target，直接用 Binary Search 就行了。

[[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/binary-search)

### **解題思路 - Binary Search**

先來看 `set`，我們要儲存 `key` 對應到的 `value` list，所以開一個 Hash Table 就可以了，非常單純

```cpp
unordered_map<string, vector<pair<string, int>>>umap;

void set(string key, string value, int timestamp) {
    umap[key].push_back({value, timestamp});
}
```

而如果有看上面的文章，Binary Search 遇到什麼變體都是同一個處理方式，只要寫出 `is_valid` function 就可以了，而這題目標是找到

> 小於等於 `timestamp` 的最大值

主要要處理的是兩種 edge case，一種是 `timestamp` 小於 list 的所有數字，另一種是 `timestamp` 大於 list 的所有數字。

如果 `timestamp` 大於 list 的所有數字，我們就要回傳最後一位數，理論上 `is_valid` 會長這樣

```
timestamp = 7
list     = [2, 3, 4, 5, 6]
is_valid = [0, 0, 0, 0, 1]
```

如果 `timestamp` 小於 list 的所有數字，表示 list 上沒有任何符合的答案，理論上 `is_valid` 會長這樣

```
timestamp = 1
list     = [2, 3, 4, 5, 6]
is_valid = [0, 0, 0, 0, 0]
```

但這樣設計實在是太複雜了，完全沒有解決到問題，所以仔細想想，小於等於 `timestamp` 的最大值，似乎就是大於 `timestamp` 的左邊一位數，這樣想起來就完全 make sense。

```
timestamp = 7
list     = [2, 3, 4, 5, 6]
is_valid = [0, 0, 0, 0, 0]

timestamp = 1
list     = [2, 3, 4, 5, 6]
is_valid = [1, 1, 1, 1, 1]
```





**Time Complexity** - `O(n x log k)`<br>
**Space Complexity** - `O(k)`
