---
title: "[ Leetcode 329 ] Longest Increasing Path in a Matrix | 解題思路分享"
date: "2025-06-30"
author: James
tags: Array,DP,DFS,Memorization
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給定一個 `matrix`，你要找出一條最長的嚴格遞增路徑（ increasing path ）。你可以從矩陣中的任意一個格子出發，並且每次只能移動到上下左右四個方向中數值比當前格子大的相鄰格子。

題目連結 🔗：[https://leetcode.com/problems/longest-increasing-path-in-a-matrix/](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/)

### **問題分析**

這題最直覺就是每一格都 dfs，然後往數字越更高的走，那計算出每一格當起點的 path 長度就可以知道最大的是哪一條了，不過這樣肯定會走到很多重複的路線，所以我們可以開一個 2d dp table 來記錄這些已經走過的 path。

### **解題思路 - DFS + Memorization**

從 matrix[i][j] 出發的 path，途中經過的每一個 grid 都算是已經計算完成不用重新計算，因為 dfs 往下走到下一個 grid，他會計算完這個 grid 的最大 path 才會回傳回去，所以上面那一層的 path 長度就是下面那一層的 path + 1，而走過的 grid 再重新走一次也不會有新的結果，直接記錄起來就可以了。

有點繞我們直接來看程式碼，每一個 grid 都可以往四個方向走，而 dfs 這個 function 會回傳從 matrix[i][j] 出發的最大 path 長度，所以 pseudo code 是這樣：

```python
dfs(i, j):
    path = 1
    for 4 directions:
        path = max(path, dfs(next grid) + 1)
    return path
```

path 就是下一層回傳回來再加 1，那超出邊界就不要進 dfs，如果下一個 grid 比較小也不要進，寫成 c++ 就是這樣：

```cpp
int dfs(vector<vector<int>>&matrix, int i, int j){
    int m = matrix.size();
    int n = matrix[0].size();

    int path = 1;
    if(i-1 >= 0 && matrix[i-1][j] > matrix[i][j]) path = max(path, dfs(matrix, i-1, j) + 1);
    if(j-1 >= 0 && matrix[i][j-1] > matrix[i][j]) path = max(path, dfs(matrix, i, j-1) + 1);
    if(i+1 < m && matrix[i+1][j] > matrix[i][j]) path = max(path, dfs(matrix, i+1, j) + 1);
    if(j+1 < n && matrix[i][j+1] > matrix[i][j]) path = max(path, dfs(matrix, i, j+1) + 1);

    return path;
}
```

單純只是這樣我們每一個 grid 都會再重新算到一遍，不過就像剛剛說的，算過的 grid 實際上重算一次也不會有新的答案，所以直接用 dp table 紀錄起來就行了

```cpp
int dfs(vector<vector<int>>&matrix, vector<vector<int>>&dp, int i, int j){
    int m = matrix.size();
    int n = matrix[0].size();
    if(dp[i][j] != -1) return dp[i][j]; // 已經計算過了，直接回傳

    int path = 1;
    if(i-1 >= 0 && matrix[i-1][j] > matrix[i][j]) path = max(path, dfs(matrix, dp, i-1, j) + 1);
    if(j-1 >= 0 && matrix[i][j-1] > matrix[i][j]) path = max(path, dfs(matrix, dp, i, j-1) + 1);
    if(i+1 < m && matrix[i+1][j] > matrix[i][j]) path = max(path, dfs(matrix, dp, i+1, j) + 1);
    if(j+1 < n && matrix[i][j+1] > matrix[i][j]) path = max(path, dfs(matrix, dp, i, j+1) + 1);

    dp[i][j] = path; // dp table 紀錄
    return path;
}
```

**Time Complexity** - `O(m*n)`<br>
**Space Complexity** - `O(m*n)`

### **Implementation**
```cpp
int dfs(vector<vector<int>>&matrix, vector<vector<int>>&dp, int i, int j){
    int m = matrix.size();
    int n = matrix[0].size();
    if(dp[i][j] != -1) return dp[i][j];

    int path = 1;
    if(i-1 >= 0 && matrix[i-1][j] > matrix[i][j]) path = max(path, dfs(matrix, dp, i-1, j) + 1);
    if(j-1 >= 0 && matrix[i][j-1] > matrix[i][j]) path = max(path, dfs(matrix, dp, i, j-1) + 1);
    if(i+1 < m && matrix[i+1][j] > matrix[i][j]) path = max(path, dfs(matrix, dp, i+1, j) + 1);
    if(j+1 < n && matrix[i][j+1] > matrix[i][j]) path = max(path, dfs(matrix, dp, i, j+1) + 1);

    dp[i][j] = path;
    return path;
}

int longestIncreasingPath(vector<vector<int>>& matrix) {
    int m = matrix.size();
    int n = matrix[0].size();
    int result = 1;
    vector<vector<int>>dp(m, vector<int>(n, -1));

    for(int i = 0; i < m; i++){
        for(int j = 0; j < n; j++){
            result = max(result, dfs(matrix, dp, i, j));
        }
    }

    return result;
}
```