---
title: "[ Leetcode 124 ] Binary Tree Maximum Path Sum | 解題思路分享"
date: "2025-04-08"
author: James
tags: Tree,DFS,Binary Tree,DP
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給定一棵 Binary Tree，找出一條路徑的 node 的值總和最大的那條 path，並回傳這個最大總和。其中 path 可以從樹中任意一個 node 開始，也可以在任意 node 結束，這條 path 必須連續，而且 path 中不能重複經過同一個 node。

題目連結 🔗：[https://leetcode.com/problems/binary-tree-maximum-path-sum/](https://leetcode.com/problems/binary-tree-maximum-path-sum/)

### **問題分析**

對於每一個 node 而言，經過這個 node 的 maximum path sum 就是「left subtree 的最大貢獻值 + node->val + right subtree 的最大貢獻值」，所以我們只要看過所有 node 判斷最大的 path sum 是什麼就可以了，這種可以把一個問題切成很多子問題的，我們就朝 DP 去想。

### **解題思路 - DP**

因為我們需要看過所有 node，所以一定是 dfs 走過一次，所以關鍵在於我們要計算什麼，回傳什麼，以及紀錄什麼。

從最 overview 來看，我們需要得到通過每一個 node 的 maximum path sum，嚴格說起來會有四種情況，可能只包含 left subtree、可能只包含 right subtree、可能都包含、也可能都不包含，真正決定有沒有包含那個 subtree 的關鍵在於「該 subtree 的貢獻值是否大於 0」，如果該 subtree 的貢獻值是負數，那把他加上來只會降低 path sum 而已，我們就直接把他 drop 掉，所以對於每一個 dfs function 來說，我們可以這樣寫：

```cpp
int left = max(0, dfs(node->left));
int right = max(0, dfs(node->right));
```

再來就可以想，所以對於 dfs function 來說，每一個 node 我應該要回傳些什麼，如果要算我的最大貢獻值，而不是通過我的 maximum path sum，那我只能回傳「node->val + left subtree 最大貢獻值」跟「node->val + right subtree 最大貢獻值」中比較大的。

最後在每一個 node 計算完 left subtree 跟 right subtree 後，就要把 maximum path sum 更新上去，這樣走完全部就會知道 maximum path sum 是多少。

```cpp
int dfs(TreeNode* node){
    if(!node) return 0;

    int left = max(0, dfs(node->left));
    int right = max(0, dfs(node->right));
    result = max(result, left + node->val + right);

    return max(left, right) + node->val;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int result = INT_MIN;

int dfs(TreeNode* node){
    if(!node) return 0;

    int left = max(0, dfs(node->left));
    int right = max(0, dfs(node->right));
    result = max(result, left + node->val + right);

    return max(left, right) + node->val;
}

int maxPathSum(TreeNode* root) {
    dfs(root);
    return result;
}
```
