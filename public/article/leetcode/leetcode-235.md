---
title: "[ Leetcode 235 ] Lowest Common Ancestor of a Binary Search Tree | 解題思路分享"
date: "2025-04-23"
author: James
tags: Tree,DFS,Binary Tree,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
id: ff73d04a-d55b-4c09-82da-27b980b79bba
---

給一個 Binary Search Tree，還有兩個其中的 node，找到這兩個 node 最低的共同 Ancestor。

題目連結 🔗：[https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

## 問題分析

這題的規律很明顯，如果 `p`, `q` 都在左邊，那表示要繼續往左邊的 node dfs，如果 `p`, `q` 都在右邊，就要繼續往右邊的 node dfs，當碰到不是這兩種情況，例如 root 碰到 `p` 或 `q`，或是碰到 `p`, `q` 分別在左右兩側的情況，那就表示碰到 Anscestor 了，就可以直接 return 這個 node。

那因為題目有說是 Binary Search Tree，所以要判斷 `p`, `q` 在哪一邊只要判斷跟 root 的大小即可。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if(p->val > root->val && q->val > root->val) 
        return lowestCommonAncestor(root->right, p, q);
    else if(p->val < root->val && q->val < root->val) 
        return lowestCommonAncestor(root->left, p, q);
    else return root;
}
```
