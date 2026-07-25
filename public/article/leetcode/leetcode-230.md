---
title: "[ Leetcode 230 ] Kth Smallest Element in a BST | 解題思路分享"
date: "2025-04-18"
author: James
tags: Tree,Binary Tree,DFS
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: d4076bad-b17d-4e1c-a6d2-85df6e64dd44
---

給一個 Binary Tree，回傳第 k 小的 element。

題目連結 🔗：[https://leetcode.com/problems/kth-smallest-element-in-a-bst/](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)

### **解題思路**

Binary Tree 中如果要由小到大 Traverse 過所有 node，就是直接想到 Inorder Traversal，因為 Inorder Traversal 長這樣：

```
[Left Subtree] [Root] [Right Subtree]
```

那這題其實也就解了，按照順序 traverse，traverse 到第 k 個就解完了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int result = 0;

void inorderTraversal(TreeNode* node, int& count, int& k){
    if(!node || count > k) return;
    inorderTraversal(node->left, count, k);
    if(count == k){
        result = node->val;
        count++;
        return;
    }
    count++;
    inorderTraversal(node->right, count, k);
}

int kthSmallest(TreeNode* root, int k) {
    int count = 1;
    inorderTraversal(root, count, k);
    return result;
}
```
