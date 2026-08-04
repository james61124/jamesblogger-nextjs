---
title: "[ Leetcode 129 ] Sum Root to Leaf Numbers | 解題思路分享"
date: "2025-09-27"
author: James
tags: Linked List,Tree,Binary Tree,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: a70f37f8-f345-45fb-9b50-91dbc7f547f8
---

給一個 Binary Tree，每個 node 都是 0-9 的數字，從 root -> leaf 會有一條 path，把 path 上的數字視為一個整數，然後把所有整數相加，回傳總和

題目連結 🔗：[https://leetcode.com/problems/sum-root-to-leaf-numbers/](https://leetcode.com/problems/sum-root-to-leaf-numbers/)

## 問題分析

這題可以不用建立額外的空間存之前 visit 過的數字，我們只要將目前 path visit 過的數字往下傳就好，這邊會用到一個小技巧，如果我前面 visit 過 495，下一個要 visit 的是 6，我們就將上一個數字 * 10 再加上目前的數字就好，所以 495 * 10 + 6 = 4956，然後再把 4956 往下傳即可

## 解題思路

我們用上面講到的方式往下傳當前總和

```cpp
int dfs(TreeNode* root, int curr) {
    curr = curr * 10 + root->val;
}
```

再來看返回條件，如果碰到 leaf node，也就是沒有任何 children 的 node，就要 return 整條 path 的總和

```cpp
int dfs(TreeNode* root, int curr) {
    curr = curr * 10 + root->val;
    if(!root->left && !root->right) return curr;
}
```

所以最後的回傳的結果是兩邊 path 相加

```cpp
int dfs(TreeNode* root, int curr) {
    curr = curr * 10 + root->val;
    if(!root->left && !root->right) return curr;
    return dfs(root->left, curr) + dfs(root->right, curr);
}
```

那有一種情況是只有一邊有 children，也就是說沒有 children 的那邊會碰到 nullptr，因此如果 `root` 沒有東西就直接回傳 0

```cpp
int dfs(TreeNode* root, int curr) {
    if(!root) return 0;
    curr = curr * 10 + root->val;
    if(!root->left && !root->right) return curr;
    return dfs(root->left, curr) + dfs(root->right, curr);
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(h)`

### Implementation

```cpp
int dfs(TreeNode* root, int curr) {
    if(!root) return 0;
    curr = curr * 10 + root->val;
    if(!root->left && !root->right) return curr;
    return dfs(root->left, curr) + dfs(root->right, curr);
}

int sumNumbers(TreeNode* root) {
    return dfs(root, 0);
}
```
