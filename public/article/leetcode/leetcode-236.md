---
title: "[ Leetcode 236 ] Lowest Common Ancestor of a Binary Tree | 解題思路分享"
date: "2025-10-06"
author: James
tags: Tree,Binary Tree,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 3
---

給一個 Binary Tree，給 node `p`, `q`，找到這兩個 node 的 lowest common ancestor

題目連結 🔗：[https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

### **解題思路**

這題關鍵在於 dfs 要回傳什麼東西回來，我們分兩種情況分析，如果 `q` 是 `p` 底下 subtree 的其中一個 node，那 lowest common ancestor 就是 `p` 自己，所以 dfs 到 `p` 的時候就可以直接 return 自己回來。

如果 `p`, `q` 在兩個不同的 subtree，那一定會有一個 node 分別接到右邊 return 回一個 node，左邊也 return 回一個 node，那就代表這個 node 自己就是 lowest common ancestor。

簡單來說，如果遇到 `p`, `q` 本身，就直接 return

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if(!root || root->val == p->val || root->val == q->val) return root;
}
```

如果左邊有 return 東西，右邊也有 return 東西回來，那表示這個 node 本身就是 lowest common ancestor

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if(!root || root->val == p->val || root->val == q->val) return root;

    TreeNode* left = lowestCommonAncestor(root->left, p, q); 
    TreeNode* right = lowestCommonAncestor(root->right, p, q);

    if(left && right) return root;
}
```

最後如果只有一邊有 return 東西，表示已經找到 lowest common ancestor 了，就直接往回傳

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if(!root || root->val == p->val || root->val == q->val) return root;

    TreeNode* left = lowestCommonAncestor(root->left, p, q); 
    TreeNode* right = lowestCommonAncestor(root->right, p, q);

    if(left && right) return root;
    return left ? left : right;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(log n)`

#### **Implementation**

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if(!root || root->val == p->val || root->val == q->val) return root;

    TreeNode* left = lowestCommonAncestor(root->left, p, q); 
    TreeNode* right = lowestCommonAncestor(root->right, p, q);

    if(left && right) return root;
    return left ? left : right;
}
```
