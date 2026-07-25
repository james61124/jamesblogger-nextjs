---
title: "[ Leetcode 130 ] Surrounded Regions | 解題思路分享"
date: "2025-06-17"
author: James
tags: Array,Matrix,DFS
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
id: 5b373957-7363-4684-bc95-ff17c6624dce
---

給一個 `m x n` 的 2D Matrix `board`，每個格子是 `X` 或 `O`，目標是將所有被 `X` 完全包圍的 `O` 改為 `X`。

題目連結 🔗：[https://leetcode.com/problems/surrounded-regions/](https://leetcode.com/problems/surrounded-regions/)

### **問題分析**

這題看起來很單純，如果按照順序每一格都進行 dfs，如果那一組 dfs 有碰到邊界，就回傳狀態整組都標記起來，而這樣時間複雜度是 O(m*n)，因為碰到 `X` 就不會繼續走了，寫起來有點像這樣。

```cpp
bool dfs() {
    bool surrounded = true;
    board[i][j] = 'X';

    for 4 directions:
        if(!dfs(d)) surrounded = false;
    
    if(surrounded) board[i][j] = 'O';
    return surrounded;
}
```

這是我第一個想法，乍聽之下很合理，但這樣做會有一個問題，四個 directions 如果先走到其中沒有碰到邊邊的那個方向，他就會暫時判斷成 surrounded，那回來再看另一個方向發現碰到邊邊了，這時就沒有辦法回頭去更新剛剛第一個方向的 board 了，這是這個方法最大的 bug。

所以這題其實要反著做 dfs，從邊邊的 `O` 開始，把 not surrounded 的 grid 都先標成另一個字母，例如說 `N`，最後更新完剩下的 `O` 就是 surrounded，`N` 就是 not surrounded，`X` 就一樣是牆壁，所以最後把全部的 `O` 改成 `X`，`N` 改成 `O` 就行了。

### **解題思路 - DFS**

所以首先我們要先用 dfs 把所有 not surrounded 都改成 `N`，dfs 朝四個方向走

```cpp
void dfs(vector<vector<char>>& board, int i, int j){
    if(i < 0 || i >= board.size() || j < 0 || j >= board[0].size() || board[i][j] != 'O') return;
    board[i][j] = 'N';

    dfs(board, i - 1, j);
    dfs(board, i + 1, j);
    dfs(board, i, j - 1);
    dfs(board, i, j + 1);
}
```

not surrounded 只會出現在邊邊，所以要跑過所有邊邊的 grid 來做 dfs

```cpp
int m = board.size(), n = board[0].size();

for(int i = 0; i < m; i++){
    dfs(board, i, 0);
    dfs(board, i, n-1);
}

for(int j = 0; j < n; j++){
    dfs(board, 0, j);
    dfs(board, m-1, j);
}
```

最後把全部的 `O` 改成 `X`，`N` 改成 `O` 就行了。

```cpp
for(int i = 0; i < m; i++){
    for(int j = 0; j < n; j++){
        if(board[i][j] == 'O') board[i][j] = 'X';
        if(board[i][j] == 'N') board[i][j] = 'O';
    }
}
```

**Time Complexity** - `O(m*n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
void dfs(vector<vector<char>>& board, int i, int j){
    if(i < 0 || i >= board.size() || j < 0 || j >= board[0].size() || board[i][j] != 'O') return;
    board[i][j] = 'N';

    dfs(board, i - 1, j);
    dfs(board, i + 1, j);
    dfs(board, i, j - 1);
    dfs(board, i, j + 1);
}

void solve(vector<vector<char>>& board) {
    int m = board.size(), n = board[0].size();

    for(int i = 0; i < m; i++){
        dfs(board, i, 0);
        dfs(board, i, n-1);
    }

    for(int j = 0; j < n; j++){
        dfs(board, 0, j);
        dfs(board, m-1, j);
    }

    for(int i = 0; i < m; i++){
        for(int j = 0; j < n; j++){
            if(board[i][j] == 'O') board[i][j] = 'X';
            if(board[i][j] == 'N') board[i][j] = 'O';
        }
    }
}
```

