---
title: "[ Leetcode 79 ] Word Search | 解題思路分享"
date: "2025-04-07"
author: James
tags: Array,Backtracking,DFS,Matrix,String
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 2D 的 Matrix `board`，還有一個 string `word`，判斷這個 `word` 能不能在 `board` 中相鄰的被拼出來。 

題目連結 🔗：[https://leetcode.com/problems/word-search/](https://leetcode.com/problems/word-search/)

### **問題分析**

這題第一感就是 DFS，每一格都做 DFS，如果該格是 word[w] 那就繼續往下一層找，直到找到所有的 word 就 return true，滿直覺的。

### **解題思路 - DFS**

其實就是普通的 DFS，有上下左右四個 neighbors，唯一要注意的只有 visit[i][j] 在搜完所有 neighbors 後要復原，也就是 backtracking 的部分，因為 board[i][j] 在其中一條 trajectory 不是答案，但可能在另一條就是答案，舉例來說：

```
board = {
    {'C', 'A', 'A'},
    {'A', 'A', 'A'},
    {'B', 'C', 'D'}
};
word = "AAB";
```

如果先看 (0, 1)->(1, 1)->(1, 0) 會找到三個 'A'，所以會是錯的，但如果我們沒有 backtracking，我們就永遠找不到 (1, 1)->(1, 0)->(2, 0) 這條正確答案了。

**Time Complexity** - `O(m x n x (3^L))`，因為每一個 node 可以看到三個不同的方向（ 不含回頭 ），而 L 是 word 的長度<br>
**Space Complexity** - `O( L )`

#### **Implementation**

```cpp
vector<vector<int>>directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

bool dfs(vector<vector<char>>& board, string& word, vector<vector<bool>>& visit, 
        int i, int j, int w){
    if(visit[i][j] || board[i][j] != word[w]) return false;
    if(w == word.size() - 1) return true;
    visit[i][j] = true;
    w++;

    for(vector<int>& d : directions){
        int x = i + d[0], y = j + d[1];
        x = x >= 0 && x < board.size() ? x : 0;
        y = y >= 0 && y < board[0].size() ? y : 0;
        if(dfs(board, word, visit, x, y, w)) return true;
    }

    visit[i][j] = false;
    return false;
}

bool exist(vector<vector<char>>& board, string word) {
    vector<vector<bool>>visit(board.size(), vector<bool>(board[0].size(), false));
    for(int i=0; i<board.size(); i++){
        for(int j=0; j<board[0].size(); j++){
            if(dfs(board, word, visit, i, j, 0)) return true;
        }
    }

    return false;
}
```

### **空間 + 時間優化**

寫完了之後才發現怎麼時間跟空間都這麼差，所以就來思考一下怎麼優化，這題的大致思路其實就是這樣，沒有新的演算法技巧，但是在實作上有很多可以節省的地方。

空間的部分，我們可以不開 2D `visit` 就紀錄所有 visited 的 node，因為進入 dfs 的條件是 board[i][j] 要跟 word[w] 一樣，所以如果 visit 過的 node 就直接修改成 "#" 就可以了，這樣他就進不了 dfs，最後 backtracking 的時候再拿回來就好。

```cpp
bool dfs(vector<vector<char>>& board, string& word, int i, int j, int w){
        if(board[i][j] != word[w]) return false;
        if(w == word.size() - 1) return true;

        char temp = board[i][j];
        board[i][j] = '#';

        for(vector<int>& d : directions){
            int x = i + d[0], y = j + d[1];
            x = x >= 0 && x < board.size() ? x : i;
            y = y >= 0 && y < board[0].size() ? y : j;
            if(dfs(board, word, x, y, w+1)) return true;
        }

        board[i][j] = temp;
        return false;
    }
```

再極致一點的話就是連 `vector<vector<int>>directions` 都不要用，不過這個相較起來就不是很重要了。

```cpp
bool dfs(vector<vector<char>>& board, string& word, int i, int j, int w){

        if (i < 0 || i >= board.size() || j < 0 || j >= board[0].size() 
                || board[i][j] != word[w]) return false;
        if(w == word.size() - 1) return true;
        
        char temp = board[i][j];
        board[i][j] = '#';

        bool found = dfs(board, word, i + 1, j, w + 1) || dfs(board, word, i - 1, j, w + 1) ||
            dfs(board, word, i, j + 1, w + 1) || dfs(board, word, i, j - 1, w + 1);

        board[i][j] = temp;
        return found;
    }
```

再來有一招最重要的，直接大幅提升運行速度，就是如果 `word` 內有字母的數量在 `board` 裡不夠的話，那怎麼樣也不會在 `board` 中找到 `word`，那就可以直接 return false 了。

```cpp
unordered_map<char, int>boardFreq, wordFreq;
for(int i=0; i<board.size(); i++){
    for(int j=0; j<board[0].size(); j++){
        boardFreq[board[i][j]]++;
    }
}
for(char c : word) wordFreq[c]++;
for(unordered_map<char, int>::iterator iter = wordFreq.begin(); 
            iter != wordFreq.end(); iter++){
    if(boardFreq[iter->first] < iter->second) return false;
}
```

**Time Complexity** - `O(m x n x (3^L))`，因為每一個 node 可以看到三個不同的方向（ 不含回頭 ），而 L 是 word 的長度<br>
**Space Complexity** - `O( L )`

#### **Implementation**

```cpp
bool dfs(vector<vector<char>>& board, string& word, int i, int j, int w){

    if (i < 0 || i >= board.size() || j < 0 || j >= board[0].size() 
            || board[i][j] != word[w]) return false;
    if(w == word.size() - 1) return true;
    
    char temp = board[i][j];`
    board[i][j] = '#';

    bool found = dfs(board, word, i + 1, j, w + 1) || dfs(board, word, i - 1, j, w + 1) ||
        dfs(board, word, i, j + 1, w + 1) || dfs(board, word, i, j - 1, w + 1);

    board[i][j] = temp;
    return found;
}

bool exist(vector<vector<char>>& board, string word) {
    unordered_map<char, int>boardFreq, wordFreq;
    for(int i=0; i<board.size(); i++){
        for(int j=0; j<board[0].size(); j++){
            boardFreq[board[i][j]]++;
        }
    }
    for(char c : word) wordFreq[c]++;
    for(unordered_map<char, int>::iterator iter = wordFreq.begin(); iter != wordFreq.end(); iter++){
        if(boardFreq[iter->first] < iter->second) return false;
    }

    for(int i=0; i<board.size(); i++){
        for(int j=0; j<board[0].size(); j++){
            if (board[i][j] == word[0] && dfs(board, word, i, j, 0))
                return true;
        }
    }

    return false;
}
```