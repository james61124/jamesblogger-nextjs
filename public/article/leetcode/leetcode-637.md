---
title: "[ Leetcode 637 ] Average of Levels in Binary Tree | 解題思路分享"
date: "2025-10-09"
author: James
tags: Tree,Binary Tree,DFS,BFS,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: c94fb564-870e-409e-8908-16a604e03a69
---

給一個 Binary Tree，求把每一層 nodes `val` 總和的平均

題目連結 🔗：[https://leetcode.com/problems/average-of-levels-in-binary-tree/](https://leetcode.com/problems/average-of-levels-in-binary-tree/)

## 問題分析

這題順著做就可以了，做一個 level order traversal，把每一層的 nodes 都加起來取平均。

## 解題思路 - Level Order Traversal

我們先做一個 Level Order Traversal，他需要一個 queue 把下一層的 nodes 存起來

```cpp
queue<TreeNode*>q;
q.push(root);

while(!q.empty()){
    int levelSize = q.size();
    for(int i = 0; i < levelSize; i++){
        TreeNode* curr = q.front();
        q.pop();

        if(curr->left) q.push(curr->left);
        if(curr->right) q.push(curr->right); 
    }
}
```

再來把每一層總和起來做平均即可

```cpp
queue<TreeNode*>q;
vector<double>result;
q.push(root);

while(!q.empty()){
    int levelSize = q.size();
    long long sum = 0;
    for(int i = 0; i < levelSize; i++){
        TreeNode* curr = q.front();
        q.pop();

        if(curr->left) q.push(curr->left);
        if(curr->right) q.push(curr->right); 
        sum += curr->val;
    }
    result.push_back((double)sum / levelSize);
}

return result;
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### Implementation

```cpp
vector<double> averageOfLevels(TreeNode* root) {
    queue<TreeNode*>q;
    vector<double>result;
    q.push(root);

    while(!q.empty()){
        int levelSize = q.size();
        long long sum = 0;
        for(int i = 0; i < levelSize; i++){
            TreeNode* curr = q.front();
            q.pop();

            if(curr->left) q.push(curr->left);
            if(curr->right) q.push(curr->right); 
            sum += curr->val;
        }
        result.push_back((double)sum / levelSize);
    }

    return result;
}
```
