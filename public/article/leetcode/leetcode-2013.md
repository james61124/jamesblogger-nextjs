---
title: "[ Leetcode 2013 ] Detect Squares | 解題思路分享"
date: "2025-08-25"
author: James
tags: Array,Hash Table
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: b828849d-3003-479d-92a4-b4a514acc74f
---

設計一個 class，其中

> `add(point)`：加入一個點 (x, y)，同一個點可以多次加入。<br>
> `count(point)`：計算以 `point` 為一個頂點的軸平行正方形的數量。

題目連結 🔗：[https://leetcode.com/problems/detect-squares/](https://leetcode.com/problems/detect-squares/)

## 解題思路 - Hash Table

這題最主要要計算以 `point` 為一個頂點的正方形數量，由於要計算的是正方形，所以每條邊長度會是一樣的，因此只要定位出 x 軸上的兩個頂點，剩下的兩個點位置就會是固定的，也就可以計算正方形數量。

簡單釐清一下思路，第一步是要快速找出跟 `point` x 座標一樣的點有哪些，因此我們需要一個 unordered_map 來儲存所有 points，然後 key 放 x 座標。利用這兩點可以計算出正方形的邊長，接著就可以計算出剩餘的兩個點，而我們要快速查找剩餘兩個點是不是也在 points 裏面，因此我們將 Hash Table 設計成這樣

```cpp
unordered_map<int, unordered_map<int, int>>points;
```

其中 key 是每個 points 的 x 座標，對應到的 value 也是一個 Hash Table，key 儲存那條 x 軸上所有點的 y 座標，value 儲存對應的數量。

首先先找出跟 `point` x 座標一樣的點有哪些

```cpp
int count(vector<int> point) {
    int x = point[0], y = point[1];

    for(auto& [ny, c] : points[x]){

    }

    return ans;
}
```

對於每個找到的點，可以計算跟 `point` 的距離，也就是邊長，而網上跟往下可能可以形成兩種正方形，把相對應數量算出來就可以了

```cpp
int count(vector<int> point) {
    int x = point[0], y = point[1];
    int ans = 0;

    for(auto& [ny, c] : points[x]){
        if(y == ny) continue;

        int len = abs(y - ny);
        ans += c * points[x + len][y] * points[x + len][ny];
        ans += c * points[x - len][y] * points[x - len][ny];
    }

    return ans;
}
```

**Time Complexity** - `O(k)`，k 為跟 `point` x 座標一樣的 points 數量<br>
**Space Complexity** - `O(n)`

## Implementation

```cpp
class DetectSquares {
private:
    unordered_map<int, unordered_map<int, int>>points;
public:
    DetectSquares() {
        
    }
    
    void add(vector<int> point) {
        points[point[0]][point[1]]++;
    }
    
    int count(vector<int> point) {
        int x = point[0], y = point[1];
        int ans = 0;

        for(auto& [ny, c] : points[x]){
            if(y == ny) continue;

            int len = abs(y - ny);
            ans += c * points[x + len][y] * points[x + len][ny];
            ans += c * points[x - len][y] * points[x - len][ny];
        }

        return ans;
    }
};
```