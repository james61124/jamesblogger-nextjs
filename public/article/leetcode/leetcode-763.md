---
title: "[ Leetcode 763 ] Partition Labels | 解題思路分享"
date: "2025-07-14"
author: James
tags: Two Pointers,String,Greedy,Hash Table
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 string `s`，同一個字母不可以出現在兩個 block 裡，要將 `s` 盡可能分成最多的 block 並回傳每個 block 的長度。

題目連結 🔗：[https://leetcode.com/problems/partition-labels/](https://leetcode.com/problems/partition-labels/)

### **問題分析**

一開始可以先慢慢想，iterate 整個 string，如果看到 `a`，表示我需要知道從後面數過來最後一個 `a` 在哪裏，決定了這個 block 最小會落在哪，繼續往後 iterate 也是一樣的，所以可以先簡單用一個 data structure 紀錄 [start, end]:

```python
s = "ababcc"

a : [0, 2]
b : [1, 3]
c : [4, 5]
```

結果就變成 Interval Merge 的題目，要把所有重疊的 Interval 合併起來，並回傳每一個 Interval，所以這題是一個 Greedy。

以時間複雜度來說這樣確實是最優解，但是我們會想要往下探討，如果單純只是 Interval Merge，我們需要先紀錄所有 Interval，sorting 過後再合併 Interval，我們有辦法在 iterate 的時候直接就 merge 嗎？

Interval Merge 最重要的其實只是每一段區間的 end，我們只要知道這個 block 最遠的 end 會落在哪裡就好，其實每一段 interval 的 start 並不重要，所以我們完全可以只紀錄每一個字母的 end，往外推這個 block 最遠會落在哪，就可以分離出每一個 block 了。

### **解題思路 - Greedy**

直接來實作，首先先紀錄每一個字母 end 的位置

```cpp
vector<int>last(26);

for(int i = 0; i < n; i++){
    last[s[i] - 'a'] = i;
}
```

再來每 iterate 一個 char，就要算當前這個 block 最遠會到哪裡，有點像是這樣

```cpp
int end = 0;
for(int i = 0; i < n; i++){
    end = max(end, last[s[i] - 'a']);

    // ...
}
```

所以當 `i == end` 時，表示我們已經走到完整的 block 的尾端了，就可以把 block size 推進去 `result` 中。

block size 當然隨便計算都可以，可以取 result 最後一個 element，用 end 去減，如果 result 中還沒有東西就直接推入 end 諸如此類，但是最簡潔的方法還是直接維護一個 `start`，代表每一個 block 開始的位置，這樣直接拿 `end` 跟他相減即可

```cpp
for(int i = 0; i < n; i++){
    end = max(end, last[s[i] - 'a']);
    if(i == end){
        result.push_back(end - start + 1);
        start = end + 1;
    }
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
vector<int> partitionLabels(string s) {
    vector<int>last(26);
    vector<int>result;
    int n = s.size();
    int start = 0;
    int end = 0;

    for(int i = 0; i < n; i++){
        last[s[i] - 'a'] = i;
    }

    for(int i = 0; i < n; i++){
        end = max(end, last[s[i] - 'a']);
        if(i == end){
            result.push_back(end - start + 1);
            start = end + 1;
        }
    }

    return result;
}
```