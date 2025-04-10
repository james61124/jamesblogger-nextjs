---
title: "[ Data Structure ] Binary Tree - Reconstruction | 核心概念與 Leetcode 題型解析"
date: "2025-04-10"
author: James
tags: Data Structure,Binary Tree
image: /images/program/data-structure.jpeg
description: "Binary Search Tree 除了每個 node 最多只能有兩個 children 外，還必須符合下面這條規則"
readTime: 5
---



Binary Tree 除了要會三種基本的 traversal，如何從這些 traversal 的 array 重新建構出一棵樹也是很重要的，下面舉了三種最常見的例子跟解題思路，簡單來說，我們要先找到其中一種 traversal 的 root，在另一邊定位出來之後，就可以很好的分辨 left subtree 跟 right subtree 的位置了。

### **Construct Binary Tree from Preorder and Inorder Traversal**

這是 Preorder Traversal 的 Array

```
[Root] [Left Subtree] [Right Subtree]
```

這是 Inorder Traversal 的 Array

```
[Left Subtree] [Root] [Right Subtree]
```

Preorder Traversal 的第一個一定是 Root，利用這個 Root 我們可以知道他在 Inorder Traversal 的 index，在這個 index 左邊的 subarray size 就是 Left Subtree Size，所以就可以知道 Preorder Traversal Left Subtree 是從哪裡到哪裡，剩下的部分就是 Right Subtree，所以有 Left Subtree, Right Subtree 就可以繼續 recursive 下去，最後建成完整的 Tree。

我們需要一個 `buildTreeHelper` 來幫我們遞迴 build tree：

```cpp
TreeNode* buildTreeHelper(...){
    TreeNode* root = new TreeNode(...);
    root->left = buildTreeHelper(...);
    root->right = buildTreeHelper(...);
    return root;
}
```

#### **如何快速找到 Inorder Traversal 中 Root 的 index**

preorder traversal 的第一個就是 root，我們如果直接建立 inorder traversal 的 Hash Table 就可以很快找到 root 的位置。

```cpp
unordered_map<int, int>umap; 
for(int i=0; i<inorder.size(); i++){
    umap[inorder[i]] = i;
}
```

#### **Subtree 的資訊傳遞**

在將 Subtree 的資訊傳給下一層遞迴時不用再建一個 Array，我們直接用 `preLeft`, `preRight`, `inLeft`, `inRight` 來標示就行了

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


```cpp
TreeNode* buildTreeHelper(vector<int>& preorder, unordered_map<int, int>& umap, 
                        int preLeft, int preRight, int inLeft, int inRight){

    TreeNode* root = new TreeNode(preorder[preLeft]);
    
    int rootInorderIndex = umap[preorder[preLeft]];
    int leftSize = rootInorderIndex - inLeft;

    root->left = buildTreeHelper(preorder, umap, 
            preLeft + 1, preLeft + leftSize, inLeft, rootInorderIndex - 1);
    root->right = buildTreeHelper(preorder, umap, 
            preLeft + leftSize + 1, preRight, rootInorderIndex + 1, inRight);

    return root;
}
```

#### **如何判斷這個 node 是 null 要 return？**

inLeft 跟 inRight 代表的是 inorder 的有效區間，所以如果今天 `inLeft > inRight`，那就表示這個 Subtree 根本不存在，`preLeft > preRight` 也是一樣意思，舉一個例子

```
preorder = [1, 2, 3, 4, 5]
inorder  = [2, 3, 4, 5, 1]
```

從 preorder 可以看到 Root = 1，所以 inorder 中 Left Subtree = [2, 3, 4, 5] 這個沒有問題，但是 Right Subtree 就得直接 return nullptr 了，我們來看一下右邊的指標狀況。

假設 Root 在 inorder 中的 index 是 `rootInorderIndex`，那 Right Subtree 的 inLeft = rootInorderIndex + 1，但 inRight 不會變，因為 inorder 的最右邊那個元素本來就是 Right Subtree 的，是因為現在沒有 Right Subtree 所以那邊才會是 Root，也就是說這個 case `inleft > inRight` 了，就代表他沒有 Right subtree，也就應該 return nullptr。

#### **Template**

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

### **Construct Binary Tree from Inorder and Postorder Traversal**

這是 Inorder Traversal 的 Array

```
[Left Subtree] [Root] [Right Subtree]
```

這是 Postorder Traversal 的 Array

```
[Left Subtree] [Right Subtree] [Root]
```

Postorder Traversal 的最後一個一定是 Root，利用這個 Root 我們可以知道他在 Inorder Traversal 的 index，在這個 index 左邊的 subarray size 就是 Left Subtree Size，所以就可以知道 Postorder Traversal Left Subtree 是從哪裡到哪裡，剩下的部分就是 Right Subtree。

所以有 Left Subtree, Right Subtree 就可以繼續 recursive 下去，最後建成完整的 Tree。

#### **如何快速找到 Inorder Traversal 中 Root 的 index**

postorder traversal 的最後一個就是 root，我們如果直接建立 inorder traversal 的 Hash Table 就可以很快找到 root 的位置。

```cpp
unordered_map<int, int>umap;
for(int i=0; i<inorder.size(); i++){
    umap[inorder[i]] = i;
}
```

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

```cpp
TreeNode* buildTreeHelper(vector<int>& postorder, unordered_map<int, int>& umap, 
            int inLeft, int inRight, int postLeft, int postRight) {
    
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
```

#### **如何判斷這個 node 是 null 要 return？**

inLeft 跟 inRight 代表的是 inorder 的有效區間，所以如果今天 `inLeft > inRight`，那就表示這個 Subtree 根本不存在，`postLeft > postRight` 也是一樣意思，舉一個例子

```
postorder = [1, 2, 3, 4, 5]
inorder  = [2, 3, 4, 1, 5]
```

從 postorder 可以看到 Root = 5，所以 inorder 中 Left Subtree = [2, 3, 4, 1] 這個沒有問題，但是 Right Subtree 就得直接 return nullptr 了，我們來看一下 Right Subtree 指標狀況。

假設 Root 在 inorder 中的 index 是 `rootInorderIndex`，那 Right Subtree 的 inLeft = rootInorderIndex + 1，但 inRight 不會變，因為 inorder 的最右邊那個元素本來就是 Right Subtree 的，是因為現在沒有 Right Subtree 所以那邊才會是 Root，也就是說這個 case `inleft > inRight` 了，就代表他沒有 Right subtree，也就應該 return nullptr。

#### **Template**

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

### **Construct Binary Tree from Preorder and Postorder Traversal**

這是 Preorder Traversal 的 Array

```
[Root] [Left Subtree] [Right Subtree]
```

這是 Postorder Traversal 的 Array

```
[Left Subtree] [Right Subtree] [Root]
```

所以我們目標就是要從這兩種 Array 中還原出原本的 Tree。Preorder Traversal 的第一個跟 Postorder Traversal 的最後一個都會是 root，但是光只有這些資訊是沒有辦法組合出唯一的 Tree 的，因為我們不知道 Left Subtree 跟 Right Subtree 的分界在哪裡，所以這邊先講至少找到一種的情況。

Preorder Traversal 的第一個一定是 Root，那第二個就是 Left Subtree 的 Root，利用這個 LeftSubtree Root 我們可以知道他在 Postorder Traversal 的 index，在這個 index 左邊的 subarray size 就是 Left Subtree Size，所以就可以知道 Preorder Traversal Left Subtree 是從哪裡到哪裡，剩下的部分就是 Right Subtree。

所以有 Left Subtree, Right Subtree 就可以繼續 recursive 下去，最後建成完整的 Tree。

#### **如何快速找到 Postorder Traversal 中 Root 的 index**

preorder traversal 的第二個就是 Left Subtree 的 Root，我們如果直接建立 postorder traversal 的 Hash Table 就可以很快找到 root 的位置。

#### **Subtree 的資訊傳遞**

在將 Subtree 的資訊傳給下一層遞迴時不用再建一個 Array，我們直接用 `preLeft`, `preRight`, `postLeft`, `postRight` 來標示就行了

**Left Subtree 中 :**<br>
`preLeft = preLeft + 1` - 因為就是 Root 的下一個<br>
`preRight = preLeft + leftSize` - 因為 leftSize 就是 Left Subtree 的大小，那剩下就是 Right Subtree 了<br>
`postLeft = postLeft` - 這個不動，應該也很好理解<br>
`postRight = postLeft + leftSize - 1` - 因為 leftSize 就是 Left Subtree 的大小

**Right Subtree 中 :**<br>
`preLeft = preLeft + leftSize + 1` - 因為 Left Subtree 的後面就是 Right Subtree<br>
`preRight = preRight` - 這個不動，Preorder 的最右邊就是 Right Subtree 的最右邊<br>
`postLeft = postLeft + leftSize` - 因為 Left Subtree 的後面就是 Right Subtree<br>
`postRight = postRight - 1` - 因為 Root 的左邊就是 Right Subtree 的最右邊

#### **如何判斷這個 node 是 null 要 return？**

preLeft 跟 preRight 代表的是 preorder 的有效區間，所以如果今天 `preLeft > preRight`，那就表示這個 Subtree 根本不存在。

但是這裡還需要多一個判斷，假設這個 Subtree 只有一個 node，表示他沒有 Left Subtree 跟 Right Subtree，如果我們沒有 return 這個 root 的話他就會往下去計算 Left Subtree 的 root，那就會 segmentation fault，所以在 `preLeft == preRight` 的時候要直接 return root。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Template**

```cpp
TreeNode* buildTreeHelper(vector<int>& preorder, unordered_map<int, int>& umap, 
        int preLeft, int preRight, int postLeft, int postRight) {

    if(preLeft > preRight) return nullptr;
    TreeNode* root = new TreeNode(preorder[preLeft]);
    if(preLeft == preRight) return root;
    
    int leftSubtreeRootIndex = umap[preorder[preLeft+1]];
    int leftSize = leftSubtreeRootIndex - postLeft + 1;

    root->left = buildTreeHelper(preorder, umap, 
            preLeft + 1, preLeft + leftSize, postLeft, postLeft + leftSize - 1);
    root->right = buildTreeHelper(preorder, umap, 
            preLeft + leftSize + 1, preRight, postLeft + leftSize, postRight - 1);

    return root;
}

TreeNode* constructFromPrePost(vector<int>& preorder, vector<int>& postorder) {
    unordered_map<int, int>umap;
    for(int i=0; i<postorder.size(); i++){
        umap[postorder[i]] = i;
    }

    return buildTreeHelper(preorder, umap, 0, preorder.size()-1, 0, postorder.size()-1);
}
```

#### **範例** 

[[ Leetcode 105 ] Construct Binary Tree from Preorder and Inorder Traversal | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-105/)
[[ Leetcode 106 ] Construct Binary Tree from Inorder and Postorder Traversal | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-106/)
[[ Leetcode 889 ] Delete Node in a BST | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-889/)

105
106
889