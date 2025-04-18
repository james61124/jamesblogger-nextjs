---
title: "[ Leetcode 226 ] Invert Binary Tree | 解題思路分享"
date: "2025-04-18"
author: James
tags: Tree,Binary Tree,DFS
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 Binary Tree，把他的左右顛倒。

題目連結 🔗：[https://leetcode.com/problems/invert-binary-tree/](https://leetcode.com/problems/invert-binary-tree/)

### **解題思路**

這題其實沒啥好講的，dfs 走過每一個 node，把 left, right 交換就好了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
void dfs(TreeNode* node){
    if(!node) return;
    swap(node->left, node->right);
    dfs(node->left);
    dfs(node->right);
}

TreeNode* invertTree(TreeNode* root) {
    dfs(root);
    return root;
}
```
