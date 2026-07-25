---
title: "[ Leetcode 106 ] Construct Binary Tree from Inorder and Postorder Traversal | 解題思路分享"
date: "2025-03-21"
author: James
tags: Array, Hash Table, Divide and Conquer,Tree,Binary Tree
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: 379d7f6f-cf5b-41f7-9d5a-7bae64688eb1
---

給 Inorder Traversal 跟 Postorder Traversal 的結果，要 return 原先的 Tree。

題目連結 🔗：[https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

### **問題分析**

這是 Inorder Traversal 的 Array

```
[Left Subtree] [Root] [Right Subtree]
```

這是 Postorder Traversal 的 Array

```
[Left Subtree] [Right Subtree] [Root]
```

所以我們目標就是要從這兩種 Array 中還原出原本的 Tree。

### **解題思路 - Binary Tree Reconstruction**

首先可以觀察到 Postorder Traversal 的最後一個一定是 Root，利用這個 Root 我們可以知道他在 Inorder Traversal 的 index，在這個 index 左邊的 subarray size 就是 Left Subtree Size，所以就可以知道 Postorder Traversal Left Subtree 是從哪裡到哪裡，剩下的部分就是 Right Subtree。

所以有 Left Subtree, Right Subtree 就可以繼續 recursive 下去，最後建成完整的 Tree。

#### **如何快速找到 Inorder Traversal 中 Root 的 index**

直接建立 Hash Table - Unordered_map 就行了。

#### **Subtree 的資訊傳遞**

在將 Subtree 的資訊傳給下一層遞迴時不用再建一個 Array，我們直接用 `postLeft`, `postRight`, `inLeft`, `inRight` 來標示就行了

**Left Subtree 中 :**<br>
`preLeft = preLeft + 1` - 因為就是 Root 的下一個<br>
`preRight = preLeft + leftSize` - 因為 leftSize 就是 Left Subtree 的大小，那剩下就是 Right Subtree 了<br>
`inLeft = inLeft` - 這個不動，應該也很好理解<br>
`inRight = rootInorderIndex - 1` - 因為 Root 的左邊就全部都是 Left Subtree

**Right Subtree 中 :**<br>
`preLeft = preLeft + leftSize + 1` - preLeft + leftSize 是 Left Subtree 的範圍，後面開始就是 Right Subtree 了<br>
`preRight = preRight` - 這個不動，應該也很好理解<br>
`inLeft = rootInorderIndex + 1` - inorder 中 Root 的右邊就是 Right Subtree 的開始<br>
`inRight = inRight` - 這個就一樣不用動

#### **如何判斷這個 node 是 null 要 return？**

inLeft 跟 inRight 代表的是 inorder 的有效區間，所以如果今天 `inLeft > inRight`，那就表示這個 Subtree 根本不存在，`postLeft > postRight` 也是一樣意思，舉一個例子

```
postorder = [1, 2, 3, 4, 5]
inorder  = [2, 3, 4, 1, 5]
```

從 postorder 可以看到 Root = 5，所以 inorder 中 Left Subtree = [2, 3, 4, 1] 這個沒有問題，但是 Right Subtree 就得直接 return nullptr 了，我們來看一下 Right Subtree 指標狀況。

假設 Root 在 inorder 中的 index 是 `rootInorderIndex`，那 Right Subtree 的 inLeft = rootInorderIndex + 1，但 inRight 不會變，因為 inorder 的最右邊那個元素本來就是 Right Subtree 的，是因為現在沒有 Right Subtree 所以那邊才會是 Root，也就是說這個 case `inleft > inRight` 了，就代表他沒有 Right subtree，也就應該 return nullptr。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
TreeNode* buildTreeHelper(vector<int>& postorder, unordered_map<int, int>& umap, 
            int inLeft, int inRight, int postLeft, int postRight) {

    if(postLeft > postRight) return nullptr;
    
    int rootValue = postorder[postRight];
    TreeNode* root = new TreeNode(rootValue);
    int inRootIndex = umap[rootValue];
    int leftSize = inRootIndex - inLeft;

    root->left = buildTreeHelper(postorder, umap, 
            inLeft, inRootIndex - 1, postLeft, postLeft + leftSize - 1);
    root->right = buildTreeHelper(postorder, umap, 
            inRootIndex + 1, inRight, postLeft + leftSize, postRight - 1);

    return root;
}

TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
    unordered_map<int, int>umap;
    for(int i=0; i<inorder.size(); i++){
        umap[inorder[i]] = i;
    }

    return buildTreeHelper(postorder, umap
            , 0, inorder.size()-1, 0, postorder.size()-1);
}
```