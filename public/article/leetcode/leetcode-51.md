---
title: "[ Leetcode 51 ] N-Queens | 解題思路分享"
date: "2025-03-22"
author: James
tags: Array,Backtracking,Bit Manipulation
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: 9ea52413-9f92-4a2d-ac3f-0a0f26f429d1
---

給一個 integer `n`，找出 `n x n` 棋盤中可以排列 n 個 Queens 的方法。 

題目連結 🔗：[https://leetcode.com/problems/n-queens/](https://leetcode.com/problems/n-queens/)

### **解題思路 - Backtracking**

如果要找所有的組合，每一個 rows 就可以有至多 n 種 actions，當看完一種要回到現在這個狀態繼續看下一種，那這種 `現在的 decision 不合適或是不夠，就撤回這個 decision 繼續嘗試其他 action`，就是 Backtracking。

Backtracking 需要考量以下三點，找出所有 action、找出 recursive 的 terminate 條件、backtracking 的方式，以下一一分析：

#### **找出所有 action**

對於每一個 rows 來說，也就是每一層來說，我可以選擇至多 n 個位置放 Queen，所以至多 n 種 actions，但是我必須判斷哪一些 index 是已經不能放 Queens 的了，也就是說我需要找到一個有效率的方法來判斷那個 column, diagonal 上有沒有 Queens。

```cpp
vector<int>col(n, 0);
vector<int>mainDiagonal(2*n-1, 0);
vector<int>antiDiagonal(2*n-1, 0);
```

Columns 很好處理，開一個 `vector<int>col` 來記錄哪一些 column 已經被放 Queens 就行了，但是 diagonal 就比較麻煩了，我們必須找到一個很快速可以判斷這些 Queens 在哪一個 diagonal 的方法，這邊提供一個很酷的想法。

我們把 Diagonal 分成兩種來討論，第一種是從左上到右下的 Main Diagonal，以 n = 4 舉例，每一條 Diagonoal x, y 的差值都會一樣，所以可以用這個去判斷每一條 diagonal，所以該格的 `x-y+(n-1)` 就是他對應的 main diagonal index

```
vector<int>mainDiagonal;
(3, 0)                         -> x-y = -3 -> index = 0
(2, 0), (3, 1)                 -> x-y = -2 -> index = 1
(1, 0), (2, 1), (3, 2)         -> x-y = -1 -> index = 2
(0, 0), (1, 1), (2, 2), (3, 3) -> x-y = 0  -> index = 3
(0, 1), (1, 2), (2, 3)         -> x-y = 1  -> index = 4
(0, 2), (1, 3)                 -> x-y = 2  -> index = 5
(0, 3)                         -> x-y = 3  -> index = 6
```

第二種是從右上到左下的 Anti Diagonal，以 n = 4 舉例，每一條 Diagonoal x, y 的和都會一樣，所以可以用這個去判斷每一條 diagonal，所以該格的 `x+y` 就是他對應的 anti diagonal index

```
vector<int>antiDiagonal;
(0, 0)                         -> x+y = 0 -> index = 0
(0, 1), (1, 0)                 -> x+y = 1 -> index = 1
(0, 2), (1, 1), (2, 0)         -> x+y = 2 -> index = 2
(0, 3), (1, 2), (2, 1), (3, 0) -> x+y = 3  -> index = 3
(1, 3), (2, 2), (3, 1)         -> x+y = 4  -> index = 4
(2, 3), (3, 2)                 -> x+y = 5  -> index = 5
(3, 3)                         -> x+y = 6  -> index = 6
```

#### **recursive 的 terminate 條件**

```cpp
if(index == n){
    result.push_back(board);
    return;
}
```

當我一個 trajectory 走到底了，也就是 `index == n` 時，就必須把現在這條路上決策的 board 放到 result 中。

#### **backtracking 的方式**

```cpp
col[i] = 0;
mainDiagonal[mainDiagonalIndex] = 0;
antiDiagonal[antiDiagonalIndex] = 0;
board[index][i] = '.';
```

如果一個 row 所有 action 看完了，我必須將 board 復原，還有所有 status 復原，才可以繼續 backtracking。

順帶提一個小細節，`vector<string>board(n, string(n, '.'));` 是一種初始化 `vector<string>` 很高效的方法。

**Time Complexity** - `O(n!)`，因為第一個 rows 有 n 種 actions，然後每個 rows 的 actions 數量會逐層減一<br>
**Space Complexity** - `O(n^2)`，主要是 board 的 size

### **Implementation**

```cpp
void dfs(vector<vector<string>>& result, vector<string>& board, 
    vector<int>& col, vector<int>& mainDiagonal, vector<int>& antiDiagonal, 
    int index, int n) {
    
    if(index == n){
        result.push_back(board);
        return;
    }

    for(int i=0; i<n; i++){
        int mainDiagonalIndex = index-i + (n-1);
        int antiDiagonalIndex = index+i;
        if(!col[i] && !mainDiagonal[mainDiagonalIndex] 
                    && !antiDiagonal[antiDiagonalIndex]){
            string s = "";
            col[i] = 1;
            mainDiagonal[mainDiagonalIndex] = 1;
            antiDiagonal[antiDiagonalIndex] = 1;
            board[index][i] = 'Q';
            dfs(result, board, col, mainDiagonal, antiDiagonal, index+1, n);
            col[i] = 0;
            mainDiagonal[mainDiagonalIndex] = 0;
            antiDiagonal[antiDiagonalIndex] = 0;
            board[index][i] = '.';
        }
    }
}

vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> result;
    vector<string>board(n, string(n, '.'));
    vector<int>col(n, 0);
    vector<int>mainDiagonal(2*n-1, 0);
    vector<int>antiDiagonal(2*n-1, 0);
    dfs(result, board, col, mainDiagonal, antiDiagonal, 0, n);
    return result;
}
```

### **空間優化 - Bit Manipulation**

傳統的 Backtracking 需要利用很多 array 來儲存 column, diagonal 的狀態，但是如果用 Bit Mask 的技巧就可以節省這些空間，不是很直觀，但也非常 fancy。

我們把需要紀錄的三個東西 ( column, main diagonal, anti diagonal ) 分別改成三個 integer 來儲存：`int col`, `int diag1`, `int dia2`，假設 `col = 0b1000`，第 0 個 column 不能放 Queens。

#### **計算當前 rows 有多少可以放 queens 的 position**

```cpp
int availablePositions = ((1 << n) - 1) & ~(col | diag1 | diag2);
```

這步就是在計算有多少 actions 可以做，一步一步解釋

`(1 << n)` - 將這個 integer 往左邊移 n 格，多出來的位置補 0，所以如果 n = 4，結果就是 0b10000<br>
`(1 << n) - 1` - 0b10000 - 1 會變成 0b1111，所以這行的意思是建立一個長度為 n 的全 1 bitmask<br>
`(col | diag1 | diag2)` - '|' 就是 or，所以 (col | diag1 | diag2) 就是把所有不能放 Queens 的地方都標 1，舉例說明

```cpp
int col = 0b1000;
int diag1 = 0b0100;
int dia2 = 0b0001;

(col | diag1 | diag2) = 0b1101;
```

`~(col | diag1 | diag2)` - 取反運算，所以所有不能放 Queens 的地方都變成 0，可以的都是 1，延續剛剛的例子，`(col | diag1 | diag2) = 0b0010`。

所以 availablePositions 就是 0b1111 & 0b0010 = 0b0010，意思就是這個 row 中所有可以放 Queens 的地方就是 1，`(1 << n) - 1`不能省，他是用來規範整個 integer 要有 n 個 bits。

#### **具體如何將 availablePositions 轉成 index?**

```cpp
while (availablePositions) {
    int position = availablePositions & -availablePositions;
    availablePositions ^= position;
    int columnIndex = __builtin_ctz(position);
    // 後面的操作
}
```

簡單來說，就是每提取一個 index，就把 availablePositions 的那一個 bit 標成 0，最後 availablePositions 全部都是 0 的時候就是我們已經看完所有 actions 了。我們先拆開來一步一步解析。

```cpp
int position = availablePositions & -availablePositions;
```

`int position = availablePositions & -availablePositions;` 這行的意思是只保留最後面那個 1，每一部分拆開來看，`-x = ~x + 1`，是 two's complement，意思是除了最右邊 1 的位置保留 1，其他地方全部反過來，舉個例子

```cpp
availablePositions = 0b1010;
~availablePositions = 0b0101;
~availablePositions + 1 = 0b0110;
-availablePositions = 0b0110
```

所以 `availablePositions & -availablePositions` 的意思就是只保留最後面那個 1

```cpp
availablePositions = 0b1010;
-availablePositions = 0b0110;
availablePositions & -availablePositions = 0b0010; // position = 0b0010
```

第二行 `availablePositions ^= position;` 的意思是從 availablePositions 裡移除 position，因為 position 只有一個 1，`^` 的意思是 XOR，就是只要相同的都會變 0，看例子最清楚

```cpp
availablePositions = 0b1010;
position = 0b0010;
availablePositions ^= position; // availablePositions = 0b1000
```
第三行 `int columnIndex = __builtin_ctz(position);` 就是 return 最右邊的 1 的 index，所以 `position = 0b0010`，`columnIndex` = 1，到這裡我們就把 availablePositions 轉成 index 而且做更新了。

#### **backtracking 的部分怎麼更新 col, diag1, diag2?**

```cpp
board[row][columnIndex] = 'Q';
dfs(row + 1, n, col | position, (diag1 | position) << 1, (diag2 | position) >> 1, board, res);
board[row][columnIndex] = '.';
```

position 是現在我們放 Queens 的 column index，我們把 col, diag1, diag2 拆開來說。

col 用 `col | position` 更新，`|` 就是只要有 1 結果就會是 1，就代表不能放 Queens，這個應該很好理解。<br>
diag1 用 `(diag1 | position) << 1` 更新，跟上面一樣，用 `|` 更新，只是因為我們要往下一個 rows 去看了，所以全體往左 shift 一個 bits。<br>
diag2 用 `(diag2 | position) >> 1` 更新，基本上就是反過來，到這邊我們就解決所有 status 的紀錄問題了。

**Time Complexity** - `O(n!)`，因為第一個 rows 有 n 種 actions，然後每個 rows 的 actions 數量會逐層減一<br>
**Space Complexity** - `O(n^2)`，主要是 board 的 size，但是少掉其他 status 所需要的 array 空間

### **Implementation**

```cpp
void dfs(int row, int n, int col, int diag1, int diag2, vector<string>& board, vector<vector<string>>& res) {
    if (row == n) {
        res.push_back(board);
        return;
    }
    
    int availablePositions = ((1 << n) - 1) & ~(col | diag1 | diag2);
    while (availablePositions) {
        int position = availablePositions & -availablePositions;
        availablePositions ^= position;
        
        int columnIndex = __builtin_ctz(position);
        board[row][columnIndex] = 'Q';
        dfs(row + 1, n, col | position, (diag1 | position) << 1, (diag2 | position) >> 1, board, res);
        board[row][columnIndex] = '.';
    }
}

vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> res;
    vector<string> board(n, string(n, '.'));
    dfs(0, n, 0, 0, 0, board, res);
    return res;
}
```