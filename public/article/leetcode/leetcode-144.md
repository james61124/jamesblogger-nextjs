---
title: "[ Leetcode 144 ] Binary Tree Preorder Traversal | 解題思路分享"
date: "2025-03-20"
author: James
tags: DFS,Tree,Binary Tree
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個 Binary Tree，要 return Inorder Traversal 的結果。

題目連結 🔗：[https://leetcode.com/problems/binary-tree-preorder-traversal/](https://leetcode.com/problems/binary-tree-preorder-traversal/)

### **解題思路 - Preorder Traversal**

Preorder Traversal 就是先看自己，再看左邊的 Subtree，再看右邊的 Subtree，往下看 Subtree 時也是一樣的模式，所以生成的 Array 就會長這樣

```
[Root] [Left Subtree] [Right Subtree]
```

其實滿單純的，沒有什麼需要紀錄的，直接 implement 就可以

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
void preorder(vector<int>& result, TreeNode* node){
    if(!node) return;
    result.push_back(node->val);
    preorder(result, node->left);
    preorder(result, node->right);
}

vector<int> preorderTraversal(TreeNode* root) {
    vector<int>result;
    preorder(result, root);
    return result;
}
```