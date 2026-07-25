---
title: "[ Leetcode 112 ] Path Sum | 解題思路分享"
date: "2025-09-27"
author: James
tags: Tree,Binary Tree,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: 8b5ee407-3f82-4d0e-b255-673fe5b6bf7c
---

給一個 Binary Tree，看看有沒有從 root -> leaf 的 path 總和是 `targetSum`，有就回傳 `true`

題目連結 🔗：[https://leetcode.com/problems/path-sum/](https://leetcode.com/problems/path-sum/)

### **問題分析**

這應該就是普通的 dfs，我們可以將 `targetSum` - 現在 node 的 val 傳遞到下面一層，最後在 leaf 判斷是不是變成 0 就可以了。

```cpp
if(!root->left && !root->right) return targetSum - root->val == 0;
```

那我們的回傳值就是 left subtree 跟 right subtree 只要有一個回傳是 true，就表示整體要回傳 true

```cpp
return hasPathSum(root->left, targetSum - root->val) || hasPathSum(root->right, targetSum - root->val);
```

整個寫起來就是像下面這樣

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(h)`

#### **Implementation**

```cpp
bool hasPathSum(TreeNode* root, int targetSum) {
    if(!root) return false;
    if(!root->left && !root->right) return targetSum - root->val == 0;
    return hasPathSum(root->left, targetSum - root->val) || hasPathSum(root->right, targetSum - root->val);
}
```
