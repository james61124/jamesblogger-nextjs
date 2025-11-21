---
title: "[ Leetcode 2768 ] Number of Black Blocks | 解題思路分享"
date: "2025-11-17"
author: James
tags: Array,Hash Table
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給 `m`, `n` 代表有一張 m * n 的 matrix，給 coordinates[i][j] 代表顏色是黑色的 grid 的座標，最後要輸出一個 size 5 的 result[i]，其中 result[i] 代表「所有 2 * 2 的 block 中有 i 個黑色 grid 的 block 的數量」

題目連結 🔗：[https://leetcode.com/problems/number-of-black-blocks/](https://leetcode.com/problems/number-of-black-blocks/)

### **問題分析**

如果是暴力解，對於每一個「2 * 2」的 block 都要計算 block 裡的 grid 中有多少 black grid，這樣會重複計算到很多 grid，我們應該要想辦法讓這些重複的部分計算一次就好。

所以當 [x, y] 是黑色的，表示左上角是 (x, y), (x - 1, y), (x, y - 1), (x - 1, y - 1) 的 block 全部都有一個黑色的 grid，我們可以利用 Hash Map 來更新每一個 block 裡面有多少黑色的 grid

```cpp
unordered_map<long long, int>numOfBlackGrid;
vector<long long>result(5, 0);
long long totalCount = 0;

for(auto & grid : coordinates){
    for(auto & d : directions){
        int x = grid[0] + d[0];
        int y = grid[1] + d[1];
        if(x >= 0 && y >= 0 && x < m - 1 && y < n - 1) numOfBlackGrid[1LL * x * n + y]++;
    } 
}
```

再來 iterate 整張 Hash Table，只要有記錄到數量的就把它更新進去 result，最後整張圖的 block 數量減掉 Hash Table 裡面有記錄到的 block 數量，就是完全沒有黑色 grid 的 block 數量

```cpp
for(auto &[grid, count] : numOfBlackGrid){
    result[count]++;
    totalCount++;
}

result[0] = 1LL * (m - 1) * (n - 1) - totalCount;
return result;
```

**Time Complexity** - `O(n * m)`<br>
**Space Complexity** - `O(n * m)`

#### **Implementation**

```cpp
int directions[4][2] = {{0, 0}, {-1, 0}, {0, -1}, {-1, -1}};

vector<long long> countBlackBlocks(int m, int n, vector<vector<int>>& coordinates) {
    unordered_map<long long, int>numOfBlackGrid;
    vector<long long>result(5, 0);
    long long totalCount = 0;

    for(auto & grid : coordinates){
        for(auto & d : directions){
            int x = grid[0] + d[0];
            int y = grid[1] + d[1];
            if(x >= 0 && y >= 0 && x < m - 1 && y < n - 1) numOfBlackGrid[1LL * x * n + y]++;
        } 
    }

    for(auto &[grid, count] : numOfBlackGrid){
        result[count]++;
        totalCount++;
    }

    result[0] = 1LL * (m - 1) * (n - 1) - totalCount;
    return result;
}
```
