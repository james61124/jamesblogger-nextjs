---
title: "[ Leetcode 199 ] Binary Tree Right Side View | 解題思路分享"
date: "2025-06-25"
author: James
tags: Tree,DFS,Binary Tree
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 2
id: 9f30ff1d-9ac5-4bb7-912c-b994c13bd2d7
---

給一個 Binary Tree，想像你從右邊看這棵樹，回傳總共會看到哪些 node。

題目連結 🔗：[https://leetcode.com/problems/binary-tree-right-side-view/](https://leetcode.com/problems/binary-tree-right-side-view/)

## 問題分析

題目翻成白話文就是要找該層中最右邊的 node，所以如果在 Tree 中走一個 dfs，先往右邊走到底再往左邊走到底，每到一次新的一層一定會先碰到最右邊的 node，那有這個想法這題就解完了。

## 解題思路 - DFS

每碰到一個最右邊的 node 就要把答案推進去 `result`，也就是說我們可以利用 `result` 的 size 來判斷目前有哪幾層被走過了，而只要碰到新的層數就表示又遇到一個最右邊的 node，就要把 `val` 推進去。

```cpp
void dfs(vector<int>& result, TreeNode* root, int level) {
    if(!root) return;
    if(level >= result.size()) result.push_back(root->val);
    dfs(result, root->right, level + 1);
    dfs(result, root->left, level + 1);
}
```

最後補完 main function

```cpp
vector<int> rightSideView(TreeNode* root) {
    vector<int>result;
    dfs(result, root, 0);
    return result;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

## Implementation
```cpp
void dfs(vector<int>& result, TreeNode* root, int level) {
    if(!root) return;
    if(level >= result.size()) result.push_back(root->val);
    dfs(result, root->right, level + 1);
    dfs(result, root->left, level + 1);
}

vector<int> rightSideView(TreeNode* root) {
    vector<int>result;
    dfs(result, root, 0);
    return result;
}
```