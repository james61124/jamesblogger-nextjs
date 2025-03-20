---
title: "[ Leetcode 145 ] Binary Tree Postorder Traversal | 解題思路分享"
date: "2025-03-20"
author: James
tags: DFS,Tree,Binary Tree
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個 Binary Tree，要 return Postorder Traversal 的結果。

題目連結 🔗：[https://leetcode.com/problems/binary-tree-postorder-traversal/](https://leetcode.com/problems/binary-tree-postorder-traversal/)

### **解題思路 - Postorder Traversal**

Postorder Traversal 就是先看左邊的 Subtree，再看右邊的 Subtree，再看自己，往下看 Subtree 時也是一樣的模式，所以生成的 Array 就會長這樣

```
[Left Subtree] [Right Subtree] [Root]
```

其實滿單純的，沒有什麼需要紀錄的，直接 implement 就可以

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
void postorder(vector<int>& result, TreeNode* node){
    if(!node) return;
    postorder(result, node->left);
    postorder(result, node->right);
    result.push_back(node->val);
}

vector<int> postorderTraversal(TreeNode* root) {
    vector<int>result;
    postorder(result, root);
    return result;
}
```