---
title: "[ Leetcode 701 ] Insert into a Binary Search Tree | 解題思路分享"
date: "2025-03-21"
author: James
tags: Tree,Binary Tree,Binary Search Tree
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個 Binary Search Tree (BST) 的 `root` 和一個整數 `val`，要在 BST 中 insert `val` 到對的位置。

題目連結 🔗：[https://leetcode.com/problems/insert-into-a-binary-search-tree/](https://leetcode.com/problems/insert-into-a-binary-search-tree/)

### **解題思路 - Binary Search Tree**

Binary Search Tree 除了每個 node 最多只能有兩個 children 外，還符合下面這條規則

```
(所有 left subtree 的 value) < (root node 的 value) < (所有 right subtree 的 value)
```

`insertIntoBST` 這個 function return 的是 insert 完成後的這個 root node，所以遞迴時需要放的東西就很清楚了，如果 val 比較小，那 `root->left` 就會是 `insertIntoBST(root->left, val)`，也就是 root->left insert 完成的結果，如果 val 比較大就反過來。

最後當 `root == nullptr` 表示到達需要 insert 的位置了，所以直接 return `new TreeNode(val)` 就行了。

**Time Complexity** - `O(logn)`，因為 Tree 的平均高度就是 logn<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
TreeNode* insertIntoBST(TreeNode* root, int val) {
    if(!root) return new TreeNode(val);

    if(val < root->val) root->left = insertIntoBST(root->left, val);
    else root->right = insertIntoBST(root->right, val);

    return root;
}
```