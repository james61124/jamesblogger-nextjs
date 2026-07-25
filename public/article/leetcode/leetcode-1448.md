---
title: "[ Leetcode 1448 ] Count Good Nodes in Binary Tree | 解題思路分享"
date: "2025-07-23"
author: James
tags: Tree,Binary Tree,DFS
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 06121719-5fd3-402e-89af-e7c63dc8cbbd
---

給一個 Binary Tree，如果有一個 node 從 root 走到這個 node 路上沒有任何 node 的 value 比他的 value 大，那這個 node 就是 good node，計算所有 good node 的數量。

題目連結 🔗：[https://leetcode.com/problems/count-good-nodes-in-binary-tree/](https://leetcode.com/problems/count-good-nodes-in-binary-tree/)

### **問題分析**

簡單來說，對於每一個 node 而言，他要拿到從 root 走來這路上最大的 value 是什麼，所以 parent 只要將目前最大的 value 往下傳這題就解完了

### **解題思路 - DFS**

對每個 node 來說，如果發現從上面傳下來的 `maxValue` 沒有比自己大，就表示自己是 good node，`result` 就可以加上自己

```cpp
void dfs(TreeNode* root, int maxValue, int &result){
    if(!root) return;
    if(maxValue <= root->val) result++;
}
```

再來計算出新的 `maxValue` 後往下傳即可

```cpp
void dfs(TreeNode* root, int maxValue, int &result){
    if(!root) return;
    if(maxValue <= root->val) result++;
    maxValue = max(maxValue, root->val);
    dfs(root->left, maxValue, result);
    dfs(root->right, maxValue, result);
}
```

這題差不多就這樣而已

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
void dfs(TreeNode* root, int maxValue, int &result){
    if(!root) return;
    if(maxValue <= root->val) result++;
    maxValue = max(maxValue, root->val);
    dfs(root->left, maxValue, result);
    dfs(root->right, maxValue, result);
}

int goodNodes(TreeNode* root) {
    int result = 0;
    dfs(root, INT_MIN, result);
    return result;
}
```