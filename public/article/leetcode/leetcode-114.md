---
title: "[ Leetcode 114 ] Flatten Binary Tree to Linked List | 解題思路分享"
date: "2025-09-27"
author: James
tags: Tree,Binary Tree,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 Binary Tree，要 flatten 成一個 linked list，順序是 pre-order，攤平後的每個 node 的 right 指向下一個 node，left 要指向 nullptr

題目連結 🔗：[https://leetcode.com/problems/flatten-binary-tree-to-linked-list/](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/)

### **問題分析**

題目要求把 binary tree 的 node 用 pre-order 的順序全部丟到 right sub-tree，我們如果先用 pre-order 的順序 traverse 過整顆 tree，也就是 root -> left -> right，我們會發現我們需要把左邊的東西接到 root 跟 right 的中間，然後中間每一層都要這樣做，聽起來有一點繞。

所以這題應該換個思路，我們把 traverse 的順序整個反過來，變成 right -> left -> root，這樣的話上一個被 visit 的 node 一定需要接在現在這個 node 的 right 身上，基本上這題就解完了，舉個例子

```
       1
     /   \
    2     5
   / \     \
  3   4     6
```

按照剛剛的順序第一個碰到的是 6，第二個是 5，所以要把 6 接到 5 下面，再來下一個碰到的是 4，所以要把 5 接到 4 的下面，以此類推就可以完成整張圖了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
TreeNode* pre = nullptr;

void flatten(TreeNode* root) {
    if(!root) return;
    flatten(root->right);
    flatten(root->left);

    root->right = pre;
    root->left = nullptr;
    pre = root;    
}
```
