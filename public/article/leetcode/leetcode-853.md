---
title: "[ Leetcode 853 ] Car Fleet | 解題思路分享"
date: "2025-05-15"
author: James
tags: Array,Sorting,Greedy
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個終點 target，有 n 輛車，每輛車有初始位置 position[i] 和行駛速度 speed[i]，每台車會持續往終點方向移動。車子不能超車，但如果一輛車追上前面的車，就會與前車以相同速度前進，形成一個「車隊（fleet）」，要回傳最後會有幾個車隊到達終點。

題目連結 🔗：[https://leetcode.com/problems/car-fleet/](https://leetcode.com/problems/car-fleet/)

### **問題分析**

先搞清楚問題，這題的關鍵是「不能超車」，例如說現在有四台車，position 分別是 a, b, c, d，如果 c 追不上 d 的話，那 fleet 就是 2 起跳，因為 d 會自己到 target，a, b, c 不管怎麼樣都不會跟 d 一起到 target，反觀如果 c 可以追上 d，那 fleet 就是從 1 開始算，因為不管 a, b 有沒有追上 d，c, d 都會一起到終點。

那有些人就會想，如果 a 可以追上 d 那表示什麼？a 如果可以追上 d，很明顯表示 fleet 就是 1，因為不能超車，所以 a, b, c, d 都結一塊一起到 target 了，換句話說，fleet 要增加的條件就是當發現「後車追不上前車時」，fleet 就要加一。

### **解題思路 - Greedy**

所以這題很簡單，要判斷後車能不能追上前車，維護一個 `time` 表示前面的車現在多久會到 target，我們對 position 進行排序，從最接近 target 的車開始看，如果後車追得上前車就不用管了，因為 `time` 也不會變，但當後面的車追不上前面的車的時候，fleet 就加一，然後更新 `time`。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
int carFleet(int target, vector<int>& position, vector<int>& speed) {
    int n = position.size();
    int fleet = 0;
    double time = 0;
    vector<pair<int, int>>cars;

    for(int i = 0; i < n; i++){
        cars.push_back(make_pair(position[i], speed[i]));
    }
    sort(cars.begin(), cars.end());

    for(int i = n - 1; i >= 0; i--){
        double curTime = (double)(target - cars[i].first) / cars[i].second;
        if(curTime > time){
            time = curTime;
            fleet++;
        }
    }

    return fleet;
}
```
