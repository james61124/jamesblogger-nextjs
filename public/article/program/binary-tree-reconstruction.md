---
title: "[ Data Structure ] Binary Tree - Reconstruction | 核心概念與 Leetcode 題型解析"
date: "2025-04-10"
author: James
tags: Data Structure,Binary Tree
image: /images/program/data-structure.jpeg
description: "Binary Tree 除了要會三種基本的 traversal，如何從這些 traversal 的 array 重新建構出一棵樹也是很重要的，下面舉了三種最常見的例子跟解題思路，簡單來說，我們要先找到其中一種 traversal 的 root，在另一邊定位出來之後，就可以很好的分辨 left subtree 跟 right subtree 的位置了。"
readTime: 5
---

Binary Tree 除了要會三種基本的 traversal，如何從這些 traversal 的 array 重新建構出一棵樹也是很重要的，下面舉了三種最常見的例子跟解題思路，Construct Binary Tree from Preorder and Inorder Traversal、Construct Binary Tree from Postorder and Inorder Traversal 和 Construct Binary Tree from Preorder and Postorder Traversal。

簡單來說，我們要先找到其中一種 traversal 的 root，在另一邊定位出來之後，就可以很好的分辨 left subtree 跟 right subtree 的位置了。

### **Construct Binary Tree from Preorder and Inorder Traversal**

這是 preorder traversal 的 array

```
[Root] [Left Subtree] [Right Subtree]
```

這是 inorder traversal 的 array

```
[Left Subtree] [Root] [Right Subtree]
```

preorder traversal 的第一個一定是 root，利用這個 root 我們可以知道他在 inorder traversal 的 index，在這個 index 左邊的 subarray size 就是 left subtree size，所以就可以知道 preorder traversal left subtree 是從哪裡到哪裡，剩下的部分就是 right subtree，所以有 left subtree, right subtree 就可以繼續 recursive 下去，最後建成完整的 tree。

我們需要一個 `buildTreeHelper` 來幫我們遞迴 build tree：

```cpp
TreeNode* buildTreeHelper(...){
    TreeNode* root = new TreeNode(...);
    root->left = buildTreeHelper(...);
    root->right = buildTreeHelper(...);
    return root;
}
```

至於如何快速找到 inorder traversal 中 root 的 index 呢？preorder traversal 的第一個就是 root，我們如果直接建立 inorder traversal 的 Hash Table 就可以很快找到 root 的位置。

```cpp
unordered_map<int, int>umap; 
for(int i=0; i<inorder.size(); i++){
    umap[inorder[i]] = i;
}
```

而在將 subtree 的資訊傳給下一層遞迴時不用再建一個 array，我們直接用 `preLeft`, `preRight`, `inLeft`, `inRight` 來標示就行了

**Construct Left Subtree:**<br>
> `preLeft = preLeft + 1` - 因為就是 root 的下一個<br>
> `preRight = preLeft + leftSize` - 因為 leftSize 就是 left subtree 的大小，那剩下就是 right subtree 了<br>
> `inLeft = inLeft` - 這個不動，應該也很好理解<br>
> `inRight = rootInorderIndex - 1` - 因為 root 的左邊就全部都是 left subtree

**Construct Right Subtree:**<br>
> `preLeft = preLeft + leftSize + 1` - preLeft + leftSize 是 left subtree 的範圍，後面開始就是 right subtree 了<br>
> `preRight = preRight` - 這個不動，應該也很好理解<br>
> `inLeft = rootInorderIndex + 1` - inorder 中 root 的右邊就是 right subtree 的開始<br>
> `inRight = inRight` - 這個就一樣不用動


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

最後我們得判斷什麼情況下表示我們碰到 nullptr 了要 return，inLeft 跟 inRight 代表的是 inorder 的有效區間，所以如果今天 `inLeft > inRight`，那就表示這個 subtree 根本不存在，`preLeft > preRight` 也是一樣意思，舉一個例子

```
preorder = [1, 2, 3, 4, 5]
inorder  = [2, 3, 4, 5, 1]
```

從 preorder 可以看到 root = 1，所以 inorder 中 left subtree = [2, 3, 4, 5] 這個沒有問題，但是 right subtree 就得直接 return nullptr 了，我們來看一下右邊的指標狀況。

假設 root 在 inorder 中的 index 是 `rootInorderIndex`，那 right subtree 的 inLeft = rootInorderIndex + 1，但 inRight 不會變，因為 inorder 的最右邊那個元素本來就是 right subtree 的，是因為現在沒有 right subtree 所以那邊才會是 root，也就是說這個 case `inleft > inRight` 了，就代表他沒有 right subtree，也就應該 return nullptr。

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

這是 inorder traversal 的 array

```
[Left Subtree] [Root] [Right Subtree]
```

這是 postorder traversal 的 array

```
[Left Subtree] [Right Subtree] [Root]
```

postorder traversal 的最後一個一定是 root，利用這個 root 我們可以知道他在 inorder traversal 的 index，在這個 index 左邊的 subarray size 就是 left subtree size，所以就可以知道 postorder traversal left subtree 是從哪裡到哪裡，剩下的部分就是 right subtree。所以有 left subtree, right subtree 就可以繼續 recursive 下去，最後建成完整的 tree。

我們一樣需要一個 `buildTreeHelper` 來幫我們遞迴 build tree：

```cpp
TreeNode* buildTreeHelper(...){
    TreeNode* root = new TreeNode(...);
    root->left = buildTreeHelper(...);
    root->right = buildTreeHelper(...);
    return root;
}
```

我們如何快速找到 inorder traversal 中 root 的 index 呢？postorder traversal 的最後一個就是 root，我們如果直接建立 inorder traversal 的 Hash Table 就可以很快找到 root 的位置。

```cpp
unordered_map<int, int>umap;
for(int i=0; i<inorder.size(); i++){
    umap[inorder[i]] = i;
}
```

而在將 subtree 的資訊傳給下一層遞迴時不用再建一個 array，我們直接用 `postLeft`, `postRight`, `inLeft`, `inRight` 來標示就行了

**Construct Left Subtree:**<br>
> `postLeft = postLeft + 1` - 因為就是 root 的下一個<br>
> `postRight = postLeft + leftSize` - 因為 leftSize 就是 left subtree 的大小，那剩下就是 right subtree 了<br>
> `inLeft = inLeft` - 這個不動，應該也很好理解<br>
> `inRight = rootInorderIndex - 1` - 因為 root 的左邊就全部都是 left subtree

**Construct Right Subtree:**<br>
> `postLeft = postLeft + leftSize + 1` - postLeft + leftSize 是 left subtree 的範圍，後面開始就是 right subtree 了<br>
> `postRight = postRight` - 這個不動，應該也很好理解<br>
> `inLeft = rootInorderIndex + 1` - inorder 中 root 的右邊就是 right subtree 的開始<br>
> `inRight = inRight` - 這個就一樣不用動

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

最後我們得判斷什麼情況下表示我們碰到 nullptr 了要 return，inLeft 跟 inRight 代表的是 inorder 的有效區間，所以如果今天 `inLeft > inRight`，那就表示這個 subtree 根本不存在，`postLeft > postRight` 也是一樣意思，舉一個例子

```
postorder = [1, 2, 3, 4, 5]
inorder  = [2, 3, 4, 1, 5]
```

從 postorder 可以看到 root = 5，所以 inorder 中 left subtree = [2, 3, 4, 1] 這個沒有問題，但是 right subtree 就得直接 return nullptr 了，我們來看一下 right subtree 指標狀況。

假設 root 在 inorder 中的 index 是 `rootInorderIndex`，那 right subtree 的 inLeft = rootInorderIndex + 1，但 inRight 不會變，因為 inorder 的最右邊那個元素本來就是 right subtree 的，是因為現在沒有 right subtree 所以那邊才會是 root，也就是說這個 case `inleft > inRight` 了，就代表他沒有 right subtree，也就應該 return nullptr。

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

這是 preorder traversal 的 array

```
[Root] [Left Subtree] [Right Subtree]
```

這是 postorder traversal 的 array

```
[Left Subtree] [Right Subtree] [Root]
```

所以我們目標就是要從這兩種 array 中還原出原本的 tree。preorder traversal 的第一個跟 postorder traversal 的最後一個都會是 root，但是光只有這些資訊是沒有辦法組合出唯一的 tree 的，因為我們不知道 left subtree 跟 right subtree 的分界在哪裡，所以這邊先講至少找到一種的情況。

preorder traversal 的第一個一定是 root，那第二個就是 left subtree 的 root，利用這個 leftSubtree root 我們可以知道他在 postorder traversal 的 index，在這個 index 左邊的 subarray size 就是 left subtree size，所以就可以知道 preorder traversal left subtree 是從哪裡到哪裡，剩下的部分就是 right subtree。所以有 left subtree, right subtree 就可以繼續 recursive 下去，最後建成完整的 tree。

我們需要一個 `buildTreeHelper` 來幫我們遞迴 build tree：

```cpp
TreeNode* buildTreeHelper(...){
    TreeNode* root = new TreeNode(...);
    root->left = buildTreeHelper(...);
    root->right = buildTreeHelper(...);
    return root;
}
```

如何快速找到 postorder traversal 中 root 的 index 呢？preorder traversal 的第二個就是 left subtree 的 root，我們如果直接建立 postorder traversal 的 Hash Table 就可以很快找到 root 的位置。

```cpp
unordered_map<int, int>umap;
for(int i=0; i<postorder.size(); i++){
umap[postorder[i]] = i;
}
```

而在將 subtree 的資訊傳給下一層遞迴時不用再建一個 array，我們直接用 `preLeft`, `preRight`, `postLeft`, `postRight` 來標示就行了

**Construct Left Subtree:**<br>
> `preLeft = preLeft + 1` - 因為就是 root 的下一個<br>
> `preRight = preLeft + leftSize` - 因為 leftSize 就是 left subtree 的大小，那剩下就是 right subtree 了<br>
> `postLeft = postLeft` - 這個不動，應該也很好理解<br>
> `postRight = postLeft + leftSize - 1` - 因為 leftSize 就是 left subtree 的大小

**Construct Right Subtree:**<br>
> `preLeft = preLeft + leftSize + 1` - 因為 left subtree 的後面就是 right subtree<br>
> `preRight = preRight` - 這個不動，preorder 的最右邊就是 right subtree 的最右邊<br>
> `postLeft = postLeft + leftSize` - 因為 left subtree 的後面就是 right subtree<br>
> `postRight = postRight - 1` - 因為 root 的左邊就是 right subtree 的最右邊

最後我們得判斷什麼情況下表示我們碰到 nullptr 了要 return，preLeft 跟 preRight 代表的是 preorder 的有效區間，所以如果今天 `preLeft > preRight`，那就表示這個 subtree 根本不存在。

但是這裡還需要多一個判斷，假設這個 subtree 只有一個 node，表示他沒有 left subtree 跟 right subtree，如果我們沒有 return 這個 root 的話他就會往下去計算 left subtree 的 root，那就會 segmentation fault，所以在 `preLeft == preRight` 的時候要直接 return root。

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

### **範例** 

[[ Leetcode 105 ] Construct Binary Tree from Preorder and Inorder Traversal | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-105/)<br>
[[ Leetcode 106 ] Construct Binary Tree from Inorder and Postorder Traversal | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-106/)<br>
[[ Leetcode 889 ] Construct Binary Tree from Preorder and Postorder Traversal | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-889/)