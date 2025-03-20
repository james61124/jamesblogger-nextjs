---
title: "[ Leetcode 105 ] Construct Binary Tree from Preorder and Inorder Traversal | 解題思路分享"
date: "2025-03-20"
author: James
tags: Array, Hash Table, Divide and Conquer,Tree,Binary Tree
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給 Preorder Traversal 跟 Inorder Traversal 的結果，要 return 原先的 Tree。

題目連結 🔗：[https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

### **問題分析**

這是 Preorder Traversal 的 Array

```
[Root] [Left Subtree] [Right Subtree]
```

這是 Inorder Traversal 的 Array

```
[Left Subtree] [Root] [Right Subtree]
```

所以我們目標就是要從這兩種 Array 中還原出原本的 Tree。

### **解題思路 - Binary Tree Reconstruction**

首先可以觀察到 Preorder Traversal 的第一個一定是 Root，利用這個 Root 我們可以知道他在 Inorder Traversal 的 index，在這個 index 左邊的 subarray size 就是 Left Subtree Size，所以就可以知道 Preorder Traversal Left Subtree 是從哪裡到哪裡，剩下的部分就是 Right Subtree。

所以有 Left Subtree, Right Subtree 就可以繼續 recursive 下去，最後建成完整的 Tree。

#### **如何快速找到 Inorder Traversal 中 Root 的 index**

直接建立 Hash Table - Unordered_map 就行了。

#### **如何判斷這個 node 是 null 要 return？**

在將 Subtree 的資訊傳給下一層遞迴時不用再建一個 Array，我們直接用 `preLeft`, `preRight`, `inLeft`, `inRight` 來標示就行了，換句話說 inLeft 跟 inRight 代表的是 inorder 的有效區間，所以如果今天 `inLeft > inRight`，那就表示這個 Subtree 根本不存在，`preLeft > preRight` 也是一樣意思，舉一個例子

```
preorder = [1, 2, 3, 4, 5]
inorder  = [2, 3, 4, 5, 1]
```

Root = 1，所以 Left Subtree = [2, 3, 4, 5] 這個沒有問題，但是 Right Subtree 就得直接 return nullptr 了，我們來看一下右邊的指標狀況。

假設 Root 在 inorder 中的 index 是 `rootInorderIndex`，那 Right Subtree 的 inLeft = rootInorderIndex + 1，但 inRight 不會變，因為 inorder 的最右邊那個元素本來就是 Right Subtree 的，是因為現在沒有 Right Subtree 所以那邊才會是 Root，也就是說這個 case `inleft > inRight` 了，就代表他沒有 Right subtree，也就應該 return nullptr。

#### **四個指標的位置變化**

Left Subtree 中，
`preLeft = preLeft + 1`，因為就是 Root 的下一個

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
TreeNode* buildTreeHelper(vector<int>& preorder, unordered_map<int, int>& umap, 
                        int preLeft, int preRight, int inLeft, int inRight){

    if(preLeft > preRight) return nullptr;
    TreeNode* root = new TreeNode(preorder[preLeft]);
    
    int rootInorderIndex = umap[preorder[preLeft]];
    int leftSize = rootInorderIndex - inLeft;

    root->left = buildTreeHelper(preorder, umap, 
            preLeft + 1, preLeft + leftSize, inLeft, rootInorderIndex - 1);
    root->right = buildTreeHelper(preorder, umap, 
            preLeft + leftSize + 1, preRight, rootInorderIndex + 1, inRight);

    return root;
}

TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {

    unordered_map<int, int>umap; 
    for(int i=0; i<inorder.size(); i++){
        umap[inorder[i]] = i;
    }

    return buildTreeHelper(preorder, umap, 
            0, preorder.size()-1, 0, inorder.size()-1);

}
```
