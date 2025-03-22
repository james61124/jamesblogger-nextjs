---
title: "[ Data Structure ] Binary Search Tree | 核心概念與 Leetcode 題型解析"
date: "2025-03-21"
author: James
tags: Data Structure,Binary Tree,Binary Search Tree
image: /images/program/data-structure.jpeg
description: "Binary Search Tree 除了每個 node 最多只能有兩個 children 外，還必須符合下面這條規則"
readTime: 2
---

Binary Search Tree 除了每個 node 最多只能有兩個 children 外，還必須符合下面這條規則

```
(所有 left subtree 的 value) < (root node 的 value) < (所有 right subtree 的 value)
```

這會造成兩種結果：
1. 如果用 inorder traversal 的話可以生出一個 increasing array
2. 如果需要 search 一個 value，平均的 time complexity 是 `O(logn)`，因為 binary tree 的平均高度就是 `logn`

Binary Search Tree 可以進行以下三種操作：Search, Insert, Delete

### **Search**

簡單來說就是如果 val 比較小，那就往左邊找，如果 val 比較大，就往右邊找。

#### **Template**

```cpp
TreeNode* searchBST(TreeNode* root, int val) {
    if(!root) return nullptr;

    if(val == root->val) return root;
    else if(val < root->val) return searchBST(root->left, val);
    else return searchBST(root->right, val);
}
```

#### **範例**

[[ Leetcode 700 ] Search in a Binary Search Tree | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-700/)

### **Insert**

`insertIntoBST` 這個 function return 的是 insert 完成後的這個 root node，所以遞迴時需要放的東西就很清楚了，如果 val 比較小，那 `root->left` 就會是 `insertIntoBST(root->left, val)`，也就是 root->left insert 完成的結果，如果 val 比較大就反過來。

最後當 `root == nullptr` 表示到達需要 insert 的位置了，所以直接 return `new TreeNode(val)` 就行了。

#### **Template**

```cpp
TreeNode* insertIntoBST(TreeNode* root, int val) {
    if(!root) return new TreeNode(val);

    if(val < root->val) root->left = insertIntoBST(root->left, val);
    else root->right = insertIntoBST(root->right, val);

    return root;
}
```

#### **範例**

[[ Leetcode 701 ] Insert into a Binary Search Tree | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-701/)

### **Delete**

Delete 稍微比較複雜一點，先觀念釐清一下，function `deleteNode` return 的是 delete 完成後的 root node，這樣遞迴要放什麼東西會比較清楚一點。先講最簡單的，如果 key 比 value 小，那 `root->left` 就會是 `deleteNode(root->left, key)`，因為 root->left 需要的就是 delete 完成後的 root->left，那如果 key 比 value 大，就反過來。

```cpp
if(key < root->val) root->left = deleteNode(root->left, key);
else if(key > root->val) root->right = deleteNode(root->right, key);
```

假設 `key == root->val`，表示這個就是需要被刪除的 node，這邊需要分三個部分處理，如果這個 node 沒有 Right Subtree，那就直接 return Left Subtree，如果這個 node 沒有 Left Subtree，那就直接 return Right Subtree，但如果兩個 Tree 都有的話，就得做特殊的處理，首先要找到 Right Subtree 中最小的 value `minRight`，也就是大於被刪除的 node 的最小值，然後用他來替換要被刪掉的 node，最後再去把他刪掉。

#### **Template**

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

#### **範例** 

[[ Leetcode 450 ] Delete Node in a BST | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-450/)

