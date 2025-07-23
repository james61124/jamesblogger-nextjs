---
title: "[ Leetcode 994 ] Rotting Oranges | 解題思路分享"
date: "2025-07-23"
author: James
tags: BFS
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 grid[i][j]，其中 `0` 代表 empty，`1` 代表 fresh orange，`2` 代表 rotten orange，每隔一分鐘 rotten orange 可以將相鄰的 fresh orange 變成 rotten orange，問經過幾分鐘所有 orange 都會變 rotten orange，如果沒有辦法所有橘子都變 rotten orange，就回傳 `-1`。 

題目連結 🔗：[https://leetcode.com/problems/rotting-oranges/](https://leetcode.com/problems/rotting-oranges/)

### **問題分析**

這種擴散式的題目用 DFS 會很不好做，所以我們選擇用 BFS 來解，但是 rotten orange 可能會有很多顆要怎麼辦呢？只要利用 multiple source 的 BFS 技巧就可以了，把 rotten orange 一開始就全部塞到 queue 裡面，非常簡單。

### **解題思路 - BFS**

我們先寫出 bfs 框架，並將 multiple source 先推進去，在 bfs 探訪的時候只走 fresh orange

```cpp
int m = grid.size(), n = grid[0].size();
int d[5] = {0, 1, 0, -1, 0};
queue<pair<int, int>>q;

for(int i = 0; i < m; i++){
    for(int j = 0; j < n; j++){
        if(grid[i][j] == 2) q.push({i, j});
    }
}

while(!q.empty()){
    auto [x, y] = q.front();
    q.pop();
    
    for(int i = 0; i < 4; i++){
        int newX = x + d[i];
        int newY = y + d[i+1];
        if(newX < 0 || newX >= m || newY < 0 || newY >= n) continue;
        if(grid[newX][newY] != 1) continue;
        q.push({newX, newY});
    }
}
```

因為一開始就已經先放 rotten orange 了，因此放在 queue 裡的 orange 代表「已經變成 rotten orange」，所以 {x, y} 在推入 queue 後要將 grid[x][y] 改成 2。

```cpp
int m = grid.size(), n = grid[0].size();
int d[5] = {0, 1, 0, -1, 0};
queue<pair<int, int>>q;

for(int i = 0; i < m; i++){
    for(int j = 0; j < n; j++){
        if(grid[i][j] == 2) q.push({i, j});
    }
}

while(!q.empty()){
    auto [x, y] = q.front();
    q.pop();
    
    for(int i = 0; i < 4; i++){
        int newX = x + d[i];
        int newY = y + d[i+1];
        if(newX < 0 || newX >= m || newY < 0 || newY >= n) continue;
        if(grid[newX][newY] != 1) continue;
        q.push({newX, newY});
        grid[newX][newY] = 2; // fresh orange -> rotten orange
    }
}
```

題目要求計算把所有 fresh orange 變成 rotten orange 的最小時間，也就是說，我們一層一層的 bfs，並計算看幾層後可以把所有 fresh orange 都看完，將 orange 推入 queue 只會確保比較近的 orange 可以先被 visit，但他沒有辦法紀錄現在到第幾層了，所以我們需要手動記錄當前的 queue size，來判斷是不是進入下一層了

```cpp
int m = grid.size(), n = grid[0].size();
int level = -1;
int d[5] = {0, 1, 0, -1, 0};
queue<pair<int, int>>q;

for(int i = 0; i < m; i++){
    for(int j = 0; j < n; j++){
        if(grid[i][j] == 2) q.push({i, j});
    }
}

while(!q.empty()){
    int levelSize = q.size(); // 計算該層的數量
    level++;
    for(int size = 0; size < levelSize; size++){ // 該層計算完後再更新 level
        auto [x, y] = q.front();
        q.pop();
        
        for(int i = 0; i < 4; i++){
            int newX = x + d[i];
            int newY = y + d[i+1];
            if(newX < 0 || newX >= m || newY < 0 || newY >= n) continue;
            if(grid[newX][newY] != 1) continue;
            q.push({newX, newY});
            grid[newX][newY] = 2;
            fresh--;
        }
    }
}
```

最後要判斷是不是所有 fresh orange 都變成 rotten orange 了，只要一開始在找 rotten orange 的時候順便計算 fresh orange 的數量，當 fresh orange 變成 rotten orange 時就更新數量，最後判斷這個數量是不是 0 即可

```cpp
int orangesRotting(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    int fresh = 0; // fresh orange 數量
    int d[5] = {0, 1, 0, -1, 0};
    int level = -1;
    queue<pair<int, int>>q;

    for(int i = 0; i < m; i++){
        for(int j = 0; j < n; j++){
            if(grid[i][j] == 1) fresh++; // 先計算一開始 fresh orange 數量
            else if(grid[i][j] == 2) q.push({i, j});
        }
    }

    if(fresh == 0) return 0;
    
    while(!q.empty()){
        int levelSize = q.size();
        level++;
        for(int size = 0; size < levelSize; size++){
            auto [x, y] = q.front();
            q.pop();
            
            for(int i = 0; i < 4; i++){
                int newX = x + d[i];
                int newY = y + d[i+1];
                if(newX < 0 || newX >= m || newY < 0 || newY >= n) continue;
                if(grid[newX][newY] != 1) continue;
                q.push({newX, newY});
                grid[newX][newY] = 2;
                fresh--; // 更新 fresh orange 數量
            }
        }
    }

    return fresh > 0 ? -1 : level;
}
```

**Time Complexity** - `O(m x n)`<br>
**Space Complexity** - `O(m x n)`
