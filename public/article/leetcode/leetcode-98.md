---
title: "[ Leetcode 98 ] Validate Binary Search Tree | 解題思路分享"
date: "2025-04-07"
author: James
tags: Tree,DFS,Binary Search Tree,Binary Tree
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 Binary Tree，判斷他是不是 valid Binary Search Tree。

題目連結 🔗：[https://leetcode.com/problems/validate-binary-search-tree/](https://leetcode.com/problems/validate-binary-search-tree/)

### **問題分析**

Valid Binary Search Tree 有兩個條件，對於每一個 node 來說，左邊的所有 node 都要小於自己，右邊的所有 node 都要大於自己，所以解法也很直覺，只要 dfs 檢查是不是所有 node 都符合這些條件就可以了。

### **解題思路 - DFS**

dfs 要傳下去的參數，除了 node 本身以外，我們還需要傳他最大只能是多少，還有他最小只能是多少，如果超過這兩個條件就直接 return false 就行了。

```cpp
bool dfs(TreeNode* node, int minNum, int maxNum){
    if(!node) return true;
    if(node->val <= minNum) return false;
    if(node->val >= maxNum) return false;

    return dfs(node->left, minNum, node->val) 
                && dfs(node->right, node->val, maxNum);
}
```

所以初始化可以設 `dfs(root, INT_MIN, INT_MAX)`，但這樣會遇到一個問題，如果 node 的數字剛好就是 INT_MIN 或是 INT_MAX，那在前面判斷就會直接 return false，但我們又不能初始化為 `INT_MAX + 1`，這樣會 overflow，所以為了解決這個問題，我們只好把 minNum, maxNum 調成 long long。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
bool dfs(TreeNode* node, long long minNum, long long maxNum){
    if(!node) return true;
    if(node->val <= minNum) return false;
    if(node->val >= maxNum) return false;

    return dfs(node->left, minNum, node->val) 
                && dfs(node->right, node->val, maxNum);
}

bool isValidBST(TreeNode* root) {
    return dfs(root, LLONG_MIN, LLONG_MAX);
}
```

### **另一種寫法**

不過與其把 int 調成 long long，我們其實可以直接紀錄「最大值的 node」跟「最小值的 node」就好，這樣也不用多開 long long 的空間了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
bool dfs(TreeNode* node, TreeNode* minNode, TreeNode* maxNode){
    if(!node) return true;
    if(minNode && node->val <= minNode->val) return false;
    if(maxNode && node->val >= maxNode->val) return false;

    return dfs(node->left, minNode, node) 
                && dfs(node->right, node, maxNode);
}

bool isValidBST(TreeNode* root) {
    return dfs(root, nullptr, nullptr);
}
```
