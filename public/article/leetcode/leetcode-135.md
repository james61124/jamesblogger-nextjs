---
title: "[ Leetcode 135 ] Candy | 解題思路分享"
date: "2025-08-31"
author: James
tags: Array,Greedy,Top Interview
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 2
---

有一排小孩，每個小孩都有一個分數（ratings）。要幫他們分配糖果，每個小孩至少要有一顆糖，如果一個小孩的分數比他的鄰居高，那麼他的糖果數必須比鄰居多，問在滿足規則的情況下，最少需要多少糖果？

題目連結 🔗：[https://leetcode.com/problems/candy/description/](https://leetcode.com/problems/candy/description/)

### **解題思路 - Greedy**

先從左到右來解題，從左到右 iterate `ratings`，如果右邊的 rating 比左邊的 rating 大，那右邊的糖果數量一定會比左邊的多，所以所有人糖果數量先初始化為 1，如果右邊比左邊大，右邊的糖果數就設為左邊加一，舉個例子，`ratings = [1, 0, 2, 4, 3, 2]`，那糖果數量可以先計算為 `candies = [1, 1, 2, 3, 1, 1]`。

```cpp
int n = ratings.size();
vector<int>candies(n, 1);

for(int i = 1; i < n; i++){
    if(ratings[i] > ratings[i - 1]) {
        candies[i] = candies[i - 1] + 1;
    }
}
```

由於右邊 rating 比左邊大的情況糖果數量至少右邊要多左邊一顆，所以目前的糖果數量是所有小孩「至少」會拿到的數量，這部分沒有過度分配的問題，所以可以繼續往下想。

再來要處理左邊 rating 比右邊大的情況，也就是從右到左，這邊不能單純「如果左邊 rating 比較大就把左邊就設為右邊加一」，因為有可能在剛剛的步驟中，左邊就已經比右邊大很多了，舉剛剛的例子

```
ratings = [1, 0, 2, 4, 3, 2]
candies = [1, 1, 2, 3, 1, 1]
```

candies[3] 數量要比 candies[4] 多，但是他不能設置成 candies[4] + 1，因為他已經比 candies[4] 多了，原本就已經滿足的狀況就不用動了，也因此這邊應該要寫成

```cpp
candies[i] = max(candies[i], candies[i + 1] + 1);
```

完整寫起來就是這樣

```cpp
for(int i = n - 2; i >= 0; i--) {
    if(ratings[i] > ratings[i + 1]) {
        candies[i] = max(candies[i], candies[i + 1] + 1);
    }
}
```

最後把 candies[i] 所有糖果數量加起來即可

```cpp
int total = 0;
for(int i = 0; i < n; i++){
    total += candies[i];
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int candy(vector<int>& ratings) {
    int n = ratings.size();
    vector<int>candies(n, 1);

    for(int i = 1; i < n; i++){
        if(ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1;
        }
    }

    for(int i = n - 2; i >= 0; i--) {
        if(ratings[i] > ratings[i + 1]) {
            candies[i] = max(candies[i], candies[i + 1] + 1);
        }
    }

    int total = 0;
    for(int i = 0; i < n; i++){
        total += candies[i];
    }

    return total;
}
```
