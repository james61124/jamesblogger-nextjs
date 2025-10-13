---
title: "[ Leetcode 530 ] Minimum Absolute Difference in BST | 解題思路分享"
date: "2025-10-09"
author: James
tags: Tree,Binary Tree,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 Binary Search Tree，回傳任意兩個 nodes 之間最小的差值

題目連結 🔗：[https://leetcode.com/problems/minimum-absolute-difference-in-bst/](https://leetcode.com/problems/minimum-absolute-difference-in-bst/)

### **問題分析**

這題一開始可以照直覺去想，對於 root 來說，跟他最近的 node 就是 left subtree 中最右邊的 node 以及 right subtree 中最左邊的 node，但我們會發現整個 BST 中每一個 node 最鄰近的點都不一樣，他很難一路往上傳，但仔細想想就發現，這不就是 In Order Traversal 而已嗎？

### **解題思路 - In Order Traversal**

對於一個 root 來說，如果用 in order traversal，那他 left subtree 中最右邊的 node 就會是上一個 visit 到的 node，他 right subtree 中最左邊的 node 就會是下一個會 visit 到的 node，那只要一直計算這中間的差值即可，非常簡單。

所以先進行一次 in order traversal

```cpp
void inOrder(TreeNode* root){
    if(!root) return;

    inOrder(root->left, prev, result);
    // ...
    inOrder(root->right, prev, result);
}

int getMinimumDifference(TreeNode* root) {
    inOrder(root, prev, result);
}
```

再來利用 prev 來記錄上一個 node 的 value，然後一直計算差值即可

```cpp
void inOrder(TreeNode* root, int& prev, int& result){
    if(!root) return;

    inOrder(root->left, prev, result);
    if(prev != -1) result = min(result, root->val - prev);
    prev = root->val;
    inOrder(root->right, prev, result);
}

int getMinimumDifference(TreeNode* root) {
    int result = INT_MAX;
    int prev = -1;
    inOrder(root, prev, result);
    return result;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
void inOrder(TreeNode* root, int& prev, int& result){
    if(!root) return;

    inOrder(root->left, prev, result);
    if(prev != -1) result = min(result, root->val - prev);
    prev = root->val;
    inOrder(root->right, prev, result);
}

int getMinimumDifference(TreeNode* root) {
    int result = INT_MAX;
    int prev = -1;
    inOrder(root, prev, result);
    return result;
}
```
 