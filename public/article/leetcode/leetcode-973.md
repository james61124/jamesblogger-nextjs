---
title: "[ Leetcode 973 ] K Closest Points to Origin | 解題思路分享"
date: "2025-07-17"
author: James
tags: Priority Queue, Quick Select
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 02a78a8b-e4f7-4610-bf95-e9532c0ccf68
---

points[i] 代表不同點的點座標，找出離原點最近的 `k` 個點。

題目連結 🔗：[https://leetcode.com/problems/k-closest-points-to-origin/](https://leetcode.com/problems/k-closest-points-to-origin/)

## 問題分析

這題簡單來說就是找前 k 小的，最直覺就是 Priority Queue

## 解題思路 - Priority Queue

計算每個點跟原點的距離，直接推入 minHeap 中取出前 n 個即可，而因為可能會有小數點被捨棄的問題，這邊的計算都不用加 `sqrt()`

```cpp
vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>>pq;
    vector<vector<int>>res;

    for(auto &p : points){
        pq.push({pow(p[0], 2) + pow(p[1], 2), p[0], p[1]});
    }

    for(int i = 0; i < k; i++){
        auto[dist, x, y] = pq.top();
        pq.pop();
        res.push_back({x, y});
    }

    return res;
}
```

但實際上這不是最快的，因為 priority queue 在 push 時的複雜度是 `O(log n)`，這樣如果測資有很多 points，log n 就會變很大，事實上我們可以維護一個 size 為 k 的 priority queue 就好，而用不到的部分直接 pop 出去，這樣 push 的複雜度就是 `O(log k)`，用 maxHeap 就可以把用不到的 points 直接 pop 出去了，像這樣 :

```cpp
vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    priority_queue<tuple<int, int, int>>pq;
    vector<vector<int>>res;

    for(auto &p : points){
        pq.push({pow(p[0], 2) + pow(p[1], 2), p[0], p[1]});
        if(pq.size() > k) pq.pop();
    }

    while(!pq.empty()){
        auto [dist, x, y] = pq.top();
        pq.pop();
        res.push_back({x, y});
    }

    return res;
}
```

**Time Complexity** - `O(n x log k)`<br>
**Space Complexity** - `O(k)`

## 時間優化 - Quick Select

要找前 k 小的數，事實上有一個演算法可以在 O(n) 完成，那就是 Quick Select，詳細細節可以參考下面的文章

[[ Algorithm ] Quick Select | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/quick-select)

Quick Select 其實不用自己寫，C++ 的 `nth_elements` 可以直接用，寫起來就是這樣，非常方便

```cpp
vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    auto compare = [](const vector<int>& a, const vector<int>& b){
        return pow(a[0], 2) + pow(a[1], 2) < pow(b[0], 2) + pow(b[1], 2);
    };

    nth_element(points.begin(), points.begin() + k, points.end(), compare);
    return vector<vector<int>>(points.begin(), points.begin() + k);
}
```

用 Quick Select，因為 partition 的關係，找出第 k 小的數字後，左側的數字都會比比較小，自然也就找出前 k 小的數字了，不用整條 vector 都重新 sort

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`