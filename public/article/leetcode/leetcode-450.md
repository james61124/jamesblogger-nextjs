---
title: "[ Leetcode 450 ] Delete Node in a BST | 解題思路分享"
date: "2025-03-21"
author: James
tags: Tree,Binary Tree,Binary Search Tree
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 2
id: 958c2f86-b121-4362-bb71-b9bdddd6a9c2
---

給一個 Binary Search Tree (BST) 的 `root` 和一個整數 `val`，要在 BST 中 delete `val` 這個 node。

題目連結 🔗：[https://leetcode.com/problems/delete-node-in-a-bst/](https://leetcode.com/problems/delete-node-in-a-bst/)

### **解題思路 - Binary Search Tree**

Binary Search Tree 除了每個 node 最多只能有兩個 children 外，還符合下面這條規則

```
(所有 left subtree 的 value) < (root node 的 value) < (所有 right subtree 的 value)
```

先觀念釐清一下，function `deleteNode` return 的是 delete 完成後的 root node，這樣遞迴要放什麼東西會比較清楚一點。先講最簡單的，如果 key 比 value 小，那 `root->left` 就會是 `deleteNode(root->left, key)`，因為 root->left 需要的就是 delete 完成後的 root->left，那如果 key 比 value 大，就反過來。

```cpp
if(key < root->val) root->left = deleteNode(root->left, key);
else if(key > root->val) root->right = deleteNode(root->right, key);
```

假設 `key == root->val`，表示這個就是需要被刪除的 node，這邊需要分三個部分處理，如果這個 node 沒有 Right Subtree，那就直接 return Left Subtree，如果這個 node 沒有 Left Subtree，那就直接 return Right Subtree，但如果兩個 Tree 都有的話，就得做特殊的處理，首先要找到 Right Subtree 中最小的 value `minRight`，也就是大於被刪除的 node 的最小值，然後用他來替換要被刪掉的 node，最後再去把他刪掉。

**Time Complexity** - `O(logn)`，因為 Tree 的平均高度就是 logn<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int findMin(TreeNode* root) {
    if(!root->left) return root->val;
    return findMin(root->left);
}

TreeNode* deleteNode(TreeNode* root, int key) {

    if(!root) return nullptr;

    if(key < root->val) root->left = deleteNode(root->left, key);
    else if(key > root->val) root->right = deleteNode(root->right, key);
    else {
        if(!root->right) return root->left;
        else if(!root->left) return root->right;
        else {
            int minRight = findMin(root->right);
            root->val = minRight;
            root->right = deleteNode(root->right, minRight);
        }
    }
    return root;
}
```