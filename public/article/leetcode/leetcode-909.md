---
title: "[ Leetcode 909 ] Snakes and Ladders | 解題思路分享"
date: "2025-10-10"
author: James
tags: Array,Matrix,BFS,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 n x n 的 board[i][j]，用從下到上、左右交錯的方式編號成 1...n^2，如果 board[i][j] = -1 代表沒事，如果是正數 v，代表他可以直接傳送到編號 v，題目要求如果從編號 1 出發，每次可以選擇走 1 ~ 6 步，問最短幾個 steps 可以走到編號 n * n。

題目連結 🔗：[https://leetcode.com/problems/snakes-and-ladders/](https://leetcode.com/problems/snakes-and-ladders/)

### **問題分析**

這題要找到是最短的 steps，最 brute force 的解就是 dfs / bfs 開始一路走，看看哪條 path 會先到終點對吧？看起來這個方法會重複走到很多同樣的 grid，但實際上這題 `O(n^2)` 就可以解決。

仔細想我們就會發現，如果用 bfs 來走，一層 bfs 就是一個 step，最終答案如果是 i 個 steps，我們就只需要 i 層 bfs，這樣就可以避免 dfs 時多走了一大堆用不到的 path。再來對於每一格 grid 其實他們各自到終點的最少 steps 數是一樣的，也就是說走過的 grid 不用再走一次，所以每一個 grid 最多只會被看一次就可以找到答案了。

### **解題思路 - BFS**

首先我們要先來處理 (x, y) 座標跟 board 編號的問題，他的編號方式是螺旋狀有點特別，像是這樣

```
20 21 22 23 24
19 18 17 16 15
10 11 12 13 14
9   8  7  6  5
0   1  2  3  4
```

我們要把座標 [i, j] 轉成他在板子上的編號，如果 board size = n，我們會發現 n - i 是奇數的，那個 row 的數字會是 increasing

```
i                     n - i
0 : 20 21 22 23 24 -> 5
2 : 10 11 12 13 14 -> 3
4 : 0  1  2  3  4  -> 1
```

如果 n - i 是偶數的，那個 row 的數字會是 decreasing

```
i                     n - i
1 : 19 18 17 16 15 -> 4
3 : 9   8  7  6  5 -> 2
```

先來處理 increasing，每個 row 最小的數字是 n * (n - i - 1)，再來根據 j 算 offset 就好，所以 increasing 的公式是 `n * (n - i - 1) + j + 1`

decreasing 的算法也是雷同，每個 row 最小的數字是 n * (n - i - 1)，再來根據 j 算 offset 就好，所以 decreasing 的公式是 `n * (n - i - 1) + (n - j)`

再來就進入到程式碼的部分，我們先將所有要跳轉的 grid 先拿出來紀錄在一個 Hash Table，等下要 query 會比較快

```cpp
int n = board.size();
vector<int>jump(n * n + 1, -1);

for(int i = 0; i < n; i++){
    for(int j = 0; j < n; j++){
        int idx = (n - i) % 2 == 0 ? n * (n - i - 1) + (n - j) : n * (n - i - 1) + j + 1;
        if(board[i][j] != -1) jump[idx] = board[i][j];
    }
}
```

再來就做每一層 bfs，對於每一層我們都會把擲六次骰子的結果放進去 queue 中，所以如果遇到蛇或是遇到梯子就直接利用剛剛的 `jump` 計算完下一個 grid 再放到 queue 中，那如果下一個點超過終點或是已經到終點了，就可以直接 break 出來

```cpp
int n = board.size();
vector<int>jump(n * n + 1, -1);
queue<int>q;
int level = 1;

for(int i = 0; i < n; i++){
    for(int j = 0; j < n; j++){
        int idx = (n - i) % 2 == 0 ? n * (n - i - 1) + (n - j) : n * (n - i - 1) + j + 1;
        if(board[i][j] != -1) jump[idx] = board[i][j];
    }
}

q.push(1);
while(!q.empty()){
    int levelSize = q.size();
    for(int i = 0; i < levelSize; i++){
        int curr = q.front();
        q.pop();
        
        for(int j = 1; j <= 6; j++){
            int next = curr + j;
            if(jump[next] != -1) next = jump[next];
            if(next > n * n) break;
            if(next == n * n) return level;

            q.push(next);
        }
    }
    level++;
}
```

最後就像剛剛說的，走過的 grid 不用再走一次，所以我們可以建一個 `visit` array 紀錄走過的 grid，走過的就不用再走一次了

```cpp
int n = board.size();
vector<int>jump(n * n + 1, -1);
vector<bool>visit(n * n + 1, false);
queue<int>q;
int level = 1;

for(int i = 0; i < n; i++){
    for(int j = 0; j < n; j++){
        int idx = (n - i) % 2 == 0 ? n * (n - i - 1) + (n - j) : n * (n - i - 1) + j + 1;
        if(board[i][j] != -1) jump[idx] = board[i][j];
    }
}

q.push(1);
visit[1] = true;
while(!q.empty()){
    int levelSize = q.size();
    for(int i = 0; i < levelSize; i++){
        int curr = q.front();
        q.pop();
        
        for(int j = 1; j <= 6; j++){
            int next = curr + j;
            if(jump[next] != -1) next = jump[next];
            if(next > n * n) break;
            if(next == n * n) return level;

            if(!visit[next]) {
                q.push(next);
                visit[next] = true;
            }
        }
    }
    level++;
}
```

最後完整程式碼附在下方

**Time Complexity** - `O(n^2)`<br>
**Space Complexity** - `O(n^2)`

#### **Implementation**

```cpp
int snakesAndLadders(vector<vector<int>>& board) {
    int n = board.size();
    vector<int>jump(n * n + 1, -1);
    vector<bool>visit(n * n + 1, false);
    queue<int>q;
    int level = 1;

    for(int i = 0; i < n; i++){
        for(int j = 0; j < n; j++){
            int idx = (n - i) % 2 == 0 ? n * (n - i - 1) + (n - j) : n * (n - i - 1) + j + 1;
            if(board[i][j] != -1) jump[idx] = board[i][j];
        }
    }

    q.push(1);
    visit[1] = true;
    while(!q.empty()){
        int levelSize = q.size();
        for(int i = 0; i < levelSize; i++){
            int curr = q.front();
            q.pop();
            
            for(int j = 1; j <= 6; j++){
                int next = curr + j;
                if(jump[next] != -1) next = jump[next];
                if(next > n * n) break;
                if(next == n * n) return level;

                if(!visit[next]) {
                    q.push(next);
                    visit[next] = true;
                }
            }
        }
        level++;
    }

    return -1;
}
```
 