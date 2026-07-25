---
title: "[ Leetcode 700 ] Search in a Binary Search Tree | 解題思路分享"
date: "2025-03-21"
author: James
tags: Tree,Binary Tree,Binary Search Tree
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
id: 96b532fc-10aa-4e6d-afa0-8588364597aa
---

給一個 Binary Search Tree (BST) 的 `root` 和一個整數 `val`，要在 BST 中找到 value 等於 `val` 的 node，並 return 該 node。如果找不到，就 return null。

題目連結 🔗：[https://leetcode.com/problems/search-in-a-binary-search-tree/](https://leetcode.com/problems/search-in-a-binary-search-tree/)

### **解題思路 - Binary Search Tree**

Binary Search Tree 除了每個 node 最多只能有兩個 children 外，還符合下面這條規則

```
(所有 left subtree 的 value) < (root node 的 value) < (所有 right subtree 的 value)
```

所以 Search 其實滿單純的，簡單來說就是如果 val 比較小，那就往左邊找，如果 val 比較大，就往右邊找。

**Time Complexity** - `O(logn)`，因為 Tree 的平均高度就是 logn<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
TreeNode* searchBST(TreeNode* root, int val) {
    if(!root) return nullptr;

    if(val == root->val) return root;
    else if(val < root->val) return searchBST(root->left, val);
    else return searchBST(root->right, val);
}
```