---
title: "[ Leetcode 131 ] Surrounded Regions | 解題思路分享"
date: "2025-06-17"
author: James
tags: String,DP,Backtracking
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---



題目連結 🔗：[https://leetcode.com/problems/palindrome-partitioning/](https://leetcode.com/problems/palindrome-partitioning/)

### **問題分析**

這題要列出所有回文組合，所以理論上是 backtracking，但是還真的沒有很好想。

題目說要把整個字串切成好幾段，而且每段都必須是回文，最後輸出所有合法的切法，如果是人腦來解這題會怎麼切字串呢？是不是從第一個字元切，慢慢往後切 1 個字、2 個字、3 個字，每切一段就檢查：是不是回文？如果是，就往下繼續切剩下的部分，如果不是，就跳過這個切法，所以

> 要試每種切法 + 遞迴去處理剩下的字串

寫成 decision tree 會長這樣：

```sql
start = 0
├─ "a" 是回文 → 再對 "ab" 做切割
│   ├─ "a" 是回文 → 再對 "b" 做切割
│   │   ├─ "b" 是回文 → 結束 ["a", "a", "b"]
│   │   └─
│   └─ "ab" 不是回文 → skip
├─ "aa" 是回文 → 再對 "b" 做切割
│   ├─ "b" 是回文 → 結束 ["aa", "b"]
└─ "aab" 不是回文 → skip
```

### **解題思路 - Backtracking**





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

