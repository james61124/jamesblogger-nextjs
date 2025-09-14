---
title: "[ Leetcode 289 ] Set Matrix Zeros | 解題思路分享"
date: "2025-09-10"
author: James
tags: Array,Matrix,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
---

給一個 board[i][j]，每個 cell 如果是 1 代表 live cell，如果是 0 代表 dead cell，根據以下規則更新 board

> live cell 若鄰居 live cell 數量少於 2 就變成 dead cell<br>
> live cell 若鄰居 live cell 數量多於 3 也變成 dead cell<br>
> live cell 若鄰居 live cell 數量是 2 或 3 就維持 live cell<br>
> dead cell 若鄰居 live cell 數量剛好 3 就變成 live cell

題目連結 🔗：[https://leetcode.com/problems/game-of-life/](https://leetcode.com/problems/game-of-life/)

### **問題分析**

這題唯一要注意的只有不要一開始就把 board[i][j] 的值改掉，因為後續可能其他人在查看 neighbor 的時候還是會看到這塊，所以我們可以簡單幫幾個不同的 status 分組

> 1. `dead -> dead` : 就維持 `0`<br>
> 2. `live -> live` : 就維持 `1`<br>
> 3. `dead -> live` : 可以設成 `2`<br>
> 4. `live -> dead` : 可以設成 `3`

這樣檢查 neighbor 中原先有幾個 `1`，就可以直接檢查 `1` 跟 `3` 的數量，最後再把 `3` 換回 `0`，`2` 換回 `1` 就好

**Time Complexity** - `O(m x n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
void gameOfLife(vector<vector<int>>& board) {
    int m = board.size(), n = board[0].size();
    vector<vector<int>>directions = {{-1, -1}, {0, -1}, {1, -1}, {-1, 0}, {1, 0}
                , {-1, 1}, {0, 1}, {1, 1}};

    for(int i = 0; i < m; i++) {
        for(int j = 0; j < n; j++){
            int count = 0;
            for(auto &d : directions){
                int nx = i + d[0];
                int ny = j + d[1];
                if(nx >= 0 && nx < m && ny >= 0 && ny < n && (board[nx][ny] == 1 || board[nx][ny] == 3))
                    count++;
            }
            if(board[i][j] == 1 && (count < 2 || count > 3)) board[i][j] = 3;
            else if(board[i][j] == 0 && count == 3) board[i][j] = 2;
        }
    }

    for(int i = 0; i < m; i++){
        for(int j = 0; j < n; j++){
            if(board[i][j] == 2) board[i][j] = 1;
            else if(board[i][j] == 3) board[i][j] = 0;
        }
    }
}
```

### **進階思考**

如果 board[i][j] 是一個無限大的板子，或是這個板子 live 數量很稀疏，我們可以選擇不要用 2D vector 來存板子，可以用 Hash Table 存座標跟鄰居中 live cell 的數量就好。