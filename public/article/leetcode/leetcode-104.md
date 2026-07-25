---
title: "[ Leetcode 104 ] Maximum Depth of Binary Tree | 解題思路分享"
date: "2025-04-07"
author: James
tags: Tree,DFS,Binary Tree
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: aa5c5156-168e-4218-8a93-f7842cbaf1ca
---

給一個 binary tree，return 他的最大深度。

題目連結 🔗：[https://leetcode.com/problems/maximum-depth-of-binary-tree/](https://leetcode.com/problems/maximum-depth-of-binary-tree/)

### **問題分析**

這題非常單純，跑一個 DFS，對於每一個 node 而言，回傳他 left subtree 跟 right subtree 可以碰到的最大深度即可。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int dfs(TreeNode* node, int level){
    if(!node) return level;
    return max(dfs(node->left, level+1), dfs(node->right, level+1));
}

int maxDepth(TreeNode* root) {
    return dfs(root, 0);
}
```