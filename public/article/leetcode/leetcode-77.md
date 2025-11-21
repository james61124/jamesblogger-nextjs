---
title: "[ Leetcode 77 ] Combinations | 解題思路分享"
date: "2025-10-13"
author: James
tags: Backtracking,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給 n, k，求 [1, n] 中所有 k 個數字的 combinations

題目連結 🔗：[https://leetcode.com/problems/combinations/](https://leetcode.com/problems/combinations/)

### **問題分析**

看到這種要列出所有排列組合的題目八成就是 Backtracking 了，所以我們可以畫出一個 Decision Tree 類似像這樣

```
        1         2      ...      n 
      / | \     / | \ 
     2  3  4   3  4  5
   / | \       
  3  4  5 
```

每一層的起始數字都是上一層 + 1，總共會有 k 層，那每一條 path 就是一個答案

### **解題思路 - Backtracking**

畫出 Decision Tree 之後實作應該不難，如果該條 path 已經有 k 層了，就直接把它推進去 result

```cpp
void backTracking(vector<vector<int>>&result, vector<int>&subRes, int n, int k, int start){
    if(subRes.size() == k){
        result.push_back(subRes);
        return;
    }
}
```

每一層會從 start 開始，一路往下走，這邊只要計算需要停止的地方即可，如果 path 上已經有 x 層，表示我們還需要 k - x 層，因為每個 node 最多只能算到 n，因此如果 starting point 比 n - (k - x) + 1 還要大，剩下的部分就不夠 k - x 層了，就可以直接不用看，舉個例子：

```
k = 3
n = 4
```

第一層要算 1，要算 2，但是 3 就不用繼續 visit 下去了，因為 [3, 4, 5] 就會超過 n 了，所以到 3 就不用再進 recursion，因此程式碼長這樣

```cpp
for(int i = start; i <= n - k + subRes.size() + 1; i++){
    subRes.push_back(i);
    backTracking(result, subRes, n, k, i + 1);
    subRes.pop_back();
}
```

**Time Complexity** - `O(C(n, k) * k)`，因為一組答案是 k，總共有 C(n, k) 組答案<br>
**Space Complexity** - `O(k)`

#### **Implementation**

```cpp
void backTracking(vector<vector<int>>&result, vector<int>&subRes, int n, int k, int start){
    if(subRes.size() == k){
        result.push_back(subRes);
        return;
    }

    for(int i = start; i <= n - k + subRes.size() + 1; i++){
        subRes.push_back(i);
        backTracking(result, subRes, n, k, i + 1);
        subRes.pop_back();
    }
}

vector<vector<int>> combine(int n, int k) {
    vector<vector<int>>result;
    vector<int>subRes;
    backTracking(result, subRes, n, k, 1);
    return result;
}
```
 