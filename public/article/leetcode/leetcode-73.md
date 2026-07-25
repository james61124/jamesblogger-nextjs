---
title: "[ Leetcode 73 ] Set Matrix Zeros | 解題思路分享"
date: "2025-04-01"
author: James
tags: Array,Matrix,Hash Table
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: dbec5735-a085-45d6-9e86-7009530e8020
---

如果那個 column 或 row 原本有 0，就要把整條都標成 0，而這個轉換必須在 in-place 完成

題目連結 🔗：[https://leetcode.com/problems/set-matrix-zeroes/](https://leetcode.com/problems/set-matrix-zeroes/)

### **問題分析**

這題最直覺的解法，就是遇到 0 的話，就把那一個 column, row 標記起來，等等看哪一個 column, row 被標記起來的就整排都設成 0，所以直接用 Hash Table 就可以寫了。

### **解題思路 - Hash Table**

標記也不用用什麼很特別的 STL，`bool` 就可以直接存。

**Time Complexity** - `O(m x n)`<br>
**Space Complexity** - `O(max(m, n))`

### **Implementation**

```cpp
void setZeroes(vector<vector<int>>& matrix) {
    vector<bool>row(matrix.size(), false);
    vector<bool>col(matrix[0].size(), false);

    for(int i=0; i<matrix.size(); i++){
        for(int j=0; j<matrix[0].size(); j++){
            if(!matrix[i][j]){
                row[i] = true;
                col[j] = true;
            }
        }
    }

    for(int i=0; i<matrix.size(); i++){
        if(row[i]){
            for(int j=0; j<matrix[0].size(); j++){
                matrix[i][j] = 0;
            }
        }
    }

    for(int i=0; i<matrix[0].size(); i++){
        if(col[i]){
            for(int j=0; j<matrix.size(); j++){
                matrix[j][i] = 0;
            }
        }
    }
}
```

### **空間優化**

不過我們會發現，如果這個 column 或是 row 需要被設成 0，那其實直接用 matrix 本身的第一個 column 或是 row 來標記就好，因為他們本來就得要被設成 0，這樣就不用再多花 Hash Table 的空間。

想法很簡單，實作上只要注意一些細節即可，第一個 row 跟第一個 column 要不要設成 0 理論上都是看 matrix[0][0]，但如果 matrix[0][j] == 0，所以我們把 matrix[0][0] 標成 0，但這樣不代表 matrix[i][0] 整列都要被設成 0，所以我們要把第一個 row 的狀態獨立出來用一個 `bool` 存，matrix[0][0] 只用來存 matrix[0] 這一列的狀態。

```cpp
bool firstRowZero = false;
```

最後在更新 0 的時候，第一個 row 跟第一個 column 都不能馬上動到，因為如果那邊也更新了標記就會亂掉，所以要分三步驟來更新。

```cpp
for(int i=1; i<matrix.size(); i++){
    for(int j=1; j<matrix[0].size(); j++){
        if(!matrix[0][j] || !matrix[i][0]) matrix[i][j] = 0;
    }
}

if(!matrix[0][0]){
    for(int i=0; i<matrix.size(); i++){
        matrix[i][0] = 0;
    }
}

if(firstRowZero){
    for(int j=0; j<matrix[0].size(); j++){
        matrix[0][j] = 0;
    }
}
```

**Time Complexity** - `O(m x n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
void setZeroes(vector<vector<int>>& matrix) {
    bool firstRowZero = false;

    for(int i=0; i<matrix.size(); i++){
        for(int j=0; j<matrix[0].size(); j++){
            if(!matrix[i][j]){
                if(i==0){
                    firstRowZero = true;
                    continue;
                }
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }

    for(int i=1; i<matrix.size(); i++){
        for(int j=1; j<matrix[0].size(); j++){
            if(!matrix[0][j] || !matrix[i][0]) matrix[i][j] = 0;
        }
    }

    if(!matrix[0][0]){
        for(int i=0; i<matrix.size(); i++){
            matrix[i][0] = 0;
        }
    }

    if(firstRowZero){
        for(int j=0; j<matrix[0].size(); j++){
            matrix[0][j] = 0;
        }
    }
}
```