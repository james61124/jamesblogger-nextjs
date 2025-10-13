---
title: "[ Leetcode 222 ] Count Complete Tree Nodes | 解題思路分享"
date: "2025-10-06"
author: James
tags: Tree,Binary Tree,Top Interview
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 3
---

給一個 complete binary tree，就是除了最後一層，其他層都是滿的，且最後一層是由左到右排，然後要計算出這個 tree 有多少 nodes

題目連結 🔗：[https://leetcode.com/problems/count-complete-tree-nodes/](https://leetcode.com/problems/count-complete-tree-nodes/)

### **問題分析**

這題的關鍵在於，如果最左邊的 height 跟最右邊的 height 高度一樣，那他一定是顆 perfect tree，nodes 數是 2 ^ height - 1，這樣我們就不用把每個 nodes 都 visit 過。

但如果最左邊的 height 跟最右邊的 height 高度不一樣呢？表示這不是個 perfect tree，那五們要繼續遞迴下去，並找出 left subtree 的 nodes 數量跟 right subtree 的 nodes 數量，大概會像這樣

```cpp
int dfs(TreeNode* root) {
    if left height == right height:
        return 2 ^ height - 1;

    return 1 + dfs(root->left) + dfs(root->right);
}
```

簡單來說，只要找到 perfect tree，就可以直接計算這個 subtree 的 nodes 數量，不用整個 visit 過。

### **解題思路**

實作應該不難，首先先計算左右兩邊的 height

```cpp
int countLeftHeight(TreeNode* root) {
    if(!root) return 0;
    return countLeftHeight(root->left) + 1;
}

int countRightHeight(TreeNode* root) {
    if(!root) return 0;
    return countRightHeight(root->right) + 1;
}
```

最後完成 dfs 就好

```cpp
int countNodes(TreeNode* root) {
    int left = countLeftHeight(root);
    int right = countRightHeight(root);
    
    if(left == right) return pow(2, left) - 1;
    return 1 + countNodes(root->left) + countNodes(root->right);
}
```

**Time Complexity** - `O((log n)^2)`，因為 tree height 是 log n，但是最多有可能需要做 log n 次 dfs<br>
**Space Complexity** - `O(log n)`

#### **Implementation**

```cpp
int countLeftHeight(TreeNode* root) {
    if(!root) return 0;
    return countLeftHeight(root->left) + 1;
}

int countRightHeight(TreeNode* root) {
    if(!root) return 0;
    return countRightHeight(root->right) + 1;
}

int countNodes(TreeNode* root) {
    int left = countLeftHeight(root);
    int right = countRightHeight(root);
    
    if(left == right) return pow(2, left) - 1;
    return 1 + countNodes(root->left) + countNodes(root->right);
}
```
