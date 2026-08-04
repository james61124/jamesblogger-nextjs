---
title: "[ Leetcode 543 ] Diameter of Binary Tree | 解題思路分享"
date: "2025-07-03"
author: James
tags: Tree,Binary Tree,DFS
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 733ca795-a71b-4181-8b19-9c5919bc5292
---

給一個 Binary Tree，求任兩 node 間最長的 edge 數量。

題目連結 🔗：[https://leetcode.com/problems/diameter-of-binary-tree/](https://leetcode.com/problems/diameter-of-binary-tree/)

## 問題分析

這題原則上就是 dfs 走過每一個 node，把 left subtree 的資訊跟 right subtree 的資訊統整找出最大的 path 就可以了，稍微注意他問的是 path 長度不是 node 數量就好。

## 解題思路 - DFS

思路很簡單，一個 node 中最長的 path 就是 left subtree 的深度 + right subtree 的深度，然後比較每一個 node 找到的 path 長度並更新到 `maxLength`，像這樣

```cpp
int maxLength = 0;

int dfs(TreeNode* root) {
    int left = dfs(root->left);
    int right = dfs(root->right);
    maxLength = max(maxLength, left + right);
}
```

那 dfs function 要回傳的是這個 root 開始的深度，換句話說就是 left subtree 跟 right subtree 較深的那個，再加上 1。

```cpp
int maxLength = 0;

int dfs(TreeNode* root) {
    if(!root) return 0;
    int left = dfs(root->left);
    int right = dfs(root->right);
    maxLength = max(maxLength, left + right);
    return max(left, right) + 1;
}
```

**Time Complexity** - `O(V + E)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
int maxLength = 0;

int dfs(TreeNode* root) {
    if(!root) return 0;
    int left = dfs(root->left);
    int right = dfs(root->right);
    maxLength = max(maxLength, left + right);
    return max(left, right) + 1;
}

int diameterOfBinaryTree(TreeNode* root) {
    dfs(root);
    return maxLength;
}
```
