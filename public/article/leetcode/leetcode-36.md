---
title: "[ Leetcode 36 ] Valid Sudoku | 解題思路分享"
date: "2025-03-10"
author: James
tags: Array,Hash Table,Matrix
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給你一個 9×9 的數獨棋盤（board），檢查這個數獨是否 Valid。Valid 的條件是：

1. 每一列（row） 不能有重複數字 1-9。
2. 每一行（column） 不能有重複數字 1-9。
3. 每一個 3×3 的小區塊 不能有重複數字 1-9。
4. `'.'` 代表空格，可以忽略。

題目連結🔗：[https://leetcode.com/problems/valid-sudoku/](https://leetcode.com/problems/valid-sudoku/)

### **問題分析**

基本上就是 iterate 過整個 board，只是讓 "確定有沒有重複數字" 這件事情上的時間越小越好，Hash Table 聽起來是一個很直覺的解。

### **解題思路 - Hash Table**

我們的目標是要讓我們快速確認這個 row, column, box 中是不是已經有一樣的數字了，其實有很多方法可以解，我們也可以用 3 個 `vector<unordered_set<int>>` 來判斷數字是不是已經在 unordered_set 裡，但這樣會用到太多的 unordered_set 其實有點肥，我們只是要判斷這個數字有沒有出現過而已，所以用 `vector<vector<bool>>`，出現過的數字就標成 true 就綽綽有餘了。

#### **box index 的計算**

row 跟 column 的 2D vector 都很好理解，數字 5 如果出現在第 i 個 row, 第 j 個 column，就把 row[i][5-1], column[j][5-1] 標成 true 就行了 ( 因為 index 是 0-8 不是 1-9 )，但是 box 的 index 就要設計一下。

以九宮格的位置來形容這些 box 的編號：
- 1 號 box - (i/3) = 0, (j/3) = 0
- 2 號 box - (i/3) = 0, (j/3) = 1
- 3 號 box - (i/3) = 0, (j/3) = 2
- 4 號 box - (i/3) = 1, (j/3) = 0

所以我們要讓 box index 變成 0~8，計算 `(i/3)*3 + (j/3)` 就行了，這個技巧也是把 2D Array 轉成 1D Array 常用的技巧。

#### **確定有沒有重複數字**

再來就很單純了，數字 5 如果出現在第 i 個 row, 第 j 個 column，檢查 row[i][5-1], column[j][5-1], box[boxinDex][5-1] 是不是 true 就行了，如果已經是 true 了表示他已經出現過，這個 Sudoku 就是 invalid。

**Time Complexity** - `O(27)` = `O(1)`<br>
**Space Complexity** - `O(27)` = `O(1)`

### **Implementation**

```cpp
bool isValidSudoku(vector<vector<char>>& board) {
    vector<vector<bool>>row(board.size(), vector<bool>(board[0].size(), false));
    vector<vector<bool>>col(board.size(), vector<bool>(board[0].size(), false));
    vector<vector<bool>>box(board.size(), vector<bool>(board[0].size(), false));

    for(int i=0; i<board.size(); i++){
        for(int j=0; j<board[0].size(); j++){
            if(board[i][j]=='.') continue;
            int num = board[i][j] - '1';
            int boxIndex = (i/3)*3 + (j/3);

            if(row[i][num]||col[j][num]||box[boxIndex][num]) return false;
            row[i][num] = true;
            col[j][num] = true;
            box[boxIndex][num] = true;
        }
    }

    return true;
}
```

### **空間極致優化 - Bitset**

個人覺得不一定要做到這麼細，vector 已經算是滿好的解了，不過因為只有 true, false，而且 board size 是固定的，所以可以直接用 bitset 操作，這樣空間會比 vector 來的更省。

#### **Implementation**

```cpp
bool isValidSudoku(vector<vector<char>>& board) {
    bitset<9>row[9];
    bitset<9>col[9];
    bitset<9>box[9];

    for(int i=0; i<board.size(); i++){
        for(int j=0; j<board[0].size(); j++){
            if(board[i][j]=='.') continue;
            int num = board[i][j] - '1';
            int boxIndex = (i/3)*3 + (j/3);

            if(row[i][num]||col[j][num]||box[boxIndex][num]) return false;
            row[i][num] = 1;
            col[j][num] = 1;
            box[boxIndex][num] = 1;
        }
    }

    return true;
}
```