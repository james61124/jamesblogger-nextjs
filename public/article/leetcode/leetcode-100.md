---
title: "[ Leetcode 100 ] Same Tree | 解題思路分享"
date: "2025-04-07"
author: James
tags: Tree,DFS,Binary Tree
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
---

給兩個 binary tree，判斷兩個 binary tree 是不是長一樣。

題目連結 🔗：[https://leetcode.com/problems/same-tree/](https://leetcode.com/problems/same-tree/)

### **問題分析**

這題非常單純，跑一個 DFS 判斷每一個 node 是不是都一樣的就可以了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
bool dfs(TreeNode* p, TreeNode* q){
    if(!p && !q) return true;
    if(!p || !q) return false;
    if(p->val != q->val) return false;
    return dfs(p->left, q->left) && dfs(p->right, q->right);
}

bool isSameTree(TreeNode* p, TreeNode* q) {
    return dfs(p, q);
}
```