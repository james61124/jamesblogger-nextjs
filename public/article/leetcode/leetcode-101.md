---
title: "[ Leetcode 101 ] Symmetric Tree | 解題思路分享"
date: "2025-09-25"
author: James
tags: Tree,Binary Tree,DFS,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: f892b223-6c51-47e2-bf4e-365510851e13
---

給一個 Binary Tree，判斷他是不是對稱的

題目連結 🔗：[https://leetcode.com/problems/symmetric-tree/](https://leetcode.com/problems/symmetric-tree/)

## 問題分析

如果一個 Binary Tree 是對稱的，那他 left subtree 的右半邊會跟 right subtree 的左半邊一樣，而他的 left subtree 的左半邊會跟 right subtree 的右半邊一樣，所以我們可以把 left subtree 跟 right subtree 都丟到 dfs function 裡面簡單判斷一下就好

不太難，實作就不細說了

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(h)`，h 代表 tree height

### Implementation

```cpp
bool dfs(TreeNode* left, TreeNode* right) {
    if(!left && !right) return true;
    if(!left || !right) return false;
    if(left->val != right->val) return false;
    return dfs(left->right, right->left) && dfs(left->left, right->right);
}

bool isSymmetric(TreeNode* root) {
    if(!root) return true;
    return dfs(root->left, root->right);
}
```
