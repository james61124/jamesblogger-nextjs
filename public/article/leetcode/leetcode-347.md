---
title: "[ Leetcode 347 ] Top K Frequent Elements | 解題思路分享"
date: "2025-03-24"
author: James
tags: Array,Hash Table,Queue,Priority Queue,Partial Sorting
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給定一個正整數 n，將其拆分為至少兩個正整數的和，並 return 這些數的最大乘積。

題目連結 🔗：[https://leetcode.com/problems/top-k-frequent-elements/](https://leetcode.com/problems/top-k-frequent-elements/)

### **問題分析**

這題其實有很多方法可以解，最簡單的用一個 array 存 frequency 最後 sort，或是建個 map 把 frequency 存進去他就會自己排好了，不過這些方法都是 `O(n * logn)`，題目下面有說我們要找出比這個還要快的方法，所以下一個思路就是，我們真的需要一次 sort n 個 element 嗎？

### **解題思路 - Priority Queue**

這種題目是典型的前 k 大的問題，所以可以思考看看我們能不能局部排序就好，priority queue 就是一個很好用的工具，因為我們只需要關注前 k 個 element，我們就一直保持 priority queue 只有 k 個值，剩下的直接 pop 掉我們就也不用幫他們排序了，這樣就可以在 `O(n * logk)` 解完。

思路有了，所以我們可以先建一個 unordered_map，也就是 Hash Table 儲存所有的 frequency，然後把這些 frequency 一個一個推進去 priority queue（ Min Heap ），那當 priority queue 的 size 大於 k 的時候，就把 frequency 最小的 pop 出來就行了，最後剩下的就會是答案。

**Time Complexity** - `O(n * logk)`，因為我們做了局部排序<br>
**Space Complexity** - `O( n )`

#### **Implementation**

```cpp
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int>umap;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>>pq;
    vector<int>res;

    for(int num : nums){
        umap[num]++;
    }

    for(auto iter = umap.begin(); iter != umap.end(); iter++){
        pq.push(make_pair(iter->second, iter->first));
        if(pq.size()>k) pq.pop();
    }

    while(!pq.empty()){
        res.push_back(pq.top().second);
        pq.pop();
    }

    return res;
}
```