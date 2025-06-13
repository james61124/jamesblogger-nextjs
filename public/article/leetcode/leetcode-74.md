---
title: "[ Leetcode 74 ] Search a 2D Matrix | 解題思路分享"
date: "2025-06-13"
author: James
tags: Array,Binary Search,Matrix
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給你一個 `m x n` 的 2D matrix，每一個 row 的數字是 increasing，每個 row 的第一個數字會大於上一個 row 的最後一個數字，給一個 target 判斷他是不是在這個 matrix 中。

題目連結 🔗：[https://leetcode.com/problems/search-a-2d-matrix/](https://leetcode.com/problems/search-a-2d-matrix/)

### **問題分析**

題目說要在 sorted 的東西裡面 search target，所以很明顯就是要用 binary search，那關鍵就是在於要如何在 2D matrix 裡面使用 binary search。

### **解題思路 - **

binary search 我有一套很喜歡用的模板，詳情可以參考下面這篇文章。

[[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析](https://www.jamesblogger.com/program/articles/binary-search)

那對於 2D matrix 來說，我們不用去思考 row, column，直接把 2D matrix 的 index 鋪平成 1D 就簡單很多了，什麼意思呢？假設今天有一個 3 * 4 的 2D matrix，他的 index 應該長這樣：

```
(0, 0) (0, 1) (0, 2) (0, 3)
(1, 0) (1, 1) (1, 2) (1, 3)
(2, 0) (2, 1) (2, 2) (2, 3)
```

我們只需要重新 reindex 一下就好，就等於是將它鋪平了

```
0 1  2  3
4 5  6  7
8 9 10 11
```

所以在計算 binary search 的過程中，我們使用的是鋪平後的 1d index，這樣比較好計算 left, mid, right 的邊界，需要去查 matrix 的表再把 index 轉回來就好。

轉換式很好寫，假設 matrix 的大小是 `m * n`，2D index 是 `(i, j)`，要從 2D index 轉 1D index，公式如下：

> index = i * n + j

如果要從 1D 轉 2D，有點像是餘式定理， n 是除數， i 是商，j 是餘數，所以可以直接轉換成 2D index

> x = index / n<br>
> y = index % n

那如果有看上面的文章，我們可以先建立好 binary search 的 template。

```cpp
int binarySearch(vector<vector<int>>& matrix, int target) {
    int m = matrix.size(), n = matrix[0].size();
    int left = 0, right = m * n - 1;
    while(right >= left) {
        int mid = left + (right - left) / 2;
        if(is_valid()) right = mid - 1; // 
        else left = mid + 1;
    }
    return left;
}
```

所以重點是要如何解決 `is_valid` function，如果只是要找 target，我們就讓 >= target 的部分全部回傳 true 就好了，如果是照正常邏輯應是這樣寫

```cpp
bool is_valid(vector<vector<int>>& nums, int mid, int target) {
    return nums[mid] >= target;
}
```

但是我們查表是查不到 `nums[mid]` 這個東西的，這邊需要把 index 轉回來變成 2D 的再去查表，因此要寫成這樣：

```cpp
bool is_valid(vector<vector<int>>& matrix, int mid, int target) {
    int x = mid / matrix[0].size(), y = mid % matrix[0].size();
    return matrix[x][y] >= target;
}
```

合起來就是這樣

```cpp
bool is_valid(vector<vector<int>>& matrix, int mid, int target) {
    int x = mid / matrix[0].size(), y = mid % matrix[0].size();
    return matrix[x][y] >= target;
}

int binarySearch(vector<vector<int>>& matrix, int target) {
    int m = matrix.size(), n = matrix[0].size();
    int left = 0, right = m * n - 1;
    while(right >= left) {
        int mid = left + (right - left) / 2;
        if(is_valid(matrix, mid, target)) right = mid - 1;
        else left = mid + 1;
    }
    return left;
}
```

到這邊 binary search 的部分就寫完了，那我們會注意到這個 template 的寫法事實上會回傳大於等於 target 的最小值，因此不能單單用 index = -1 來判斷 matrix 裡面是不是沒有 target，最後回傳答案的時候檢查一下即可。

```cpp
bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int m = matrix.size(), n = matrix[0].size();
    int index = binarySearch(matrix, target);
    int x = index / n, y = index % n;
    return (index >= 0) && (index < m * n) && (matrix[x][y] == target);
}
```

**Time Complexity** - `O(logn)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
bool is_valid(vector<vector<int>>& matrix, int mid, int target) {
    int x = mid / matrix[0].size(), y = mid % matrix[0].size();
    return matrix[x][y] >= target;
}

int binarySearch(vector<vector<int>>& matrix, int target) {
    int m = matrix.size(), n = matrix[0].size();
    int left = 0, right = m * n - 1;
    while(right >= left) {
        int mid = left + (right - left) / 2;
        if(is_valid(matrix, mid, target)) right = mid - 1;
        else left = mid + 1;
    }
    return left;
}

bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int m = matrix.size(), n = matrix[0].size();
    int index = binarySearch(matrix, target);
    int x = index / n, y = index % n;
    return (index >= 0) && (index < m * n) && (matrix[x][y] == target);
}
```