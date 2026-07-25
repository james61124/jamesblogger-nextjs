---
title: "[ Leetcode 94 ] Binary Tree Inorder Traversal | 解題思路分享"
date: "2025-03-20"
author: James
tags: DFS,Tree,Binary Tree
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
id: 14f4920a-690e-418e-87cd-a4cfa9dcaf3b
---

給一個 Binary Tree，要 return Inorder Traversal 的結果。

題目連結 🔗：[https://leetcode.com/problems/binary-tree-inorder-traversal/](https://leetcode.com/problems/binary-tree-inorder-traversal/)

### **解題思路 - Inorder Traversal**

Inorder Traversal 就是先看左邊的 Subtree，再看自己，再看右邊的 Subtree，往下看 Subtree 時也是一樣的模式，所以生成的 Array 就會長這樣

```
[Left Subtree] [Root] [Right Subtree]
```

其實滿單純的，沒有什麼需要紀錄的，直接 implement 就可以

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
void inorder(vector<int>& result, TreeNode* node){
    if(!node) return;
    inorder(result, node->left);
    result.push_back(node->val);
    inorder(result, node->right);
}

vector<int> inorderTraversal(TreeNode* root) {
    vector<int>result;
    inorder(result, root);
    return result;
}
```