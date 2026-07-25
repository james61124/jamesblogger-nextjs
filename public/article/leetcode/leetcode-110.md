---
title: "[ Leetcode 110 ] Balanced Binary Tree | 解題思路分享"
date: "2025-06-16"
author: James
tags: Tree,Binary Tree,DFS
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: cb05329d-808e-424c-ae43-fc4972065258
---

給一個 Binary Tree，判斷它是否為高度平衡的 Binary Tree，Balanced Binary Tree 意思就是兩邊的 subtree 高度差不會超過 1。

題目連結 🔗：[https://leetcode.com/problems/balanced-binary-tree/](https://leetcode.com/problems/balanced-binary-tree/)

### **問題分析**

這題應該滿單純的，基本上 dfs 就可以計算每一個 node 的 height 了，判斷一下兩邊的高度差即可。

### **解題思路 - DFS**

所以首先先寫一個可以計算每一個 node 的高度的 dfs。

```cpp
int dfs(TreeNode* root){
    if(!root) return 0;
    int left = dfs(root->left);
    int right = dfs(root->right);
    return max(left, right) + 1;
}
```

再來會遇到一個問題，我們可以利用 `abs(left - right)` 是不是 > 1 來判斷這棵樹是不是 balanced tree，只要找到一個 node 不是 balanced 那就要跳出，但是從這個 function 要怎麼「跳出」呢？

我們可以簡單利用 return 的值來進行 pruning，因為 height 是整數，我們可以定義當一個 node 的 height = -1 表示他不是 balanced，那只要有一邊的 subtree 不是 balanced，那就沒有必要繼續算下去，就一路 return -1 就好了，所以寫起來會像這樣：

```cpp
int dfs(TreeNode* root){
    if(!root) return 0;

    int left = dfs(root->left);
    if(left == -1) return -1;

    int right = dfs(root->right);
    if(right == -1) return -1;

    if(abs(left - right) > 1) return -1;
    return max(left, right) + 1;
}
```

最後判斷一下 root 回傳值是不是 -1 即可。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
int dfs(TreeNode* root){
    if(!root) return 0;

    int left = dfs(root->left);
    if(left == -1) return -1;

    int right = dfs(root->right);
    if(right == -1) return -1;

    if(abs(left - right) > 1) return -1;

    return max(left, right) + 1;
}

bool isBalanced(TreeNode* root) {
    return dfs(root) != -1;
}
```