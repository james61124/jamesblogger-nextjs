---
title: "[ Data Structure ] Binary Tree - Traversal | 核心概念與 Leetcode 題型解析"
date: "2025-02-27"
author: James
tags: Data Structure,Binary Tree
image: /images/program/data-structure.jpeg
description: "Binary Tree 的定義就是在一個 tree 中，每一個 node 的 children 數量不能超過兩個，所以如果寫成一個 class 的話可以這樣表示"
readTime: 2
---

Binary Tree 的定義就是在一個 tree 中，每一個 node 的 children 數量不能超過兩個，所以如果寫成一個 class 的話可以這樣表示

```cpp
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
};
```

Binary Tree 最重要的就是三種 traverse 的方法：Preorder Traversal, Inorder Traversal, Postorder Traversal，從 root 開始依照特定的順序 visit 每一個 node 一次，最後把 traverse 的順序輸出成一個 array，下面就來一個一個討論。

### **Preorder Traversal**

簡單來說就是先看自己，再看左邊的 Subtree，再看右邊的 Subtree，往下看 Subtree 時也是一樣的模式，所以生成的 Array 就會長這樣

```
[Root][Left Subtree][Right Subtree]
```

#### **Template**

```cpp
void preorder(vector<int>& result, TreeNode* node){
    if(!node) return;
    result.push_back(node->val);
    preorder(result, node->left);
    preorder(result, node->right);
}
```

#### **範例**

[[ Leetcode 144 ] Binary Tree Preorder Traversal | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-144/)

### **Inorder Traversal**

簡單來說就是先看左邊的 Subtree，再看自己，再看右邊的 Subtree，往下看 Subtree 時也是一樣的模式，所以生成的 Array 就會長這樣

```
[Left Subtree] [Root] [Right Subtree]
```

#### **Template**

```cpp
void inorder(vector<int>& result, TreeNode* node){
    if(!node) return;
    inorder(result, node->left);
    result.push_back(node->val);
    inorder(result, node->right);
}
```

#### **範例**

[[ Leetcode 94 ] Binary Tree Inorder Traversal | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-94/)

### **Postorder Traversal**

簡單來說就是先看左邊的 Subtree，再看右邊的 Subtree，再看自己，往下看 Subtree 時也是一樣的模式，所以生成的 Array 就會長這樣

```
[Left Subtree] [Right Subtree] [Root]
```

#### **Template**

```cpp
void postorder(vector<int>& result, TreeNode* node){
    if(!node) return;
    postorder(result, node->left);
    postorder(result, node->right);
    result.push_back(node->val);
}
```

#### **範例**

[[ Leetcode 145 ] Binary Tree Postorder Traversal | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-145/)

### **Level Order Traversal**

將 traverse 的結果由左到右由上到下一層一層放到 array 裡，每一層都是一個 subarray，所以最後的結果是一個 2D Array，有點像這樣

```
[ [Level 1], [Level 2], [Level 3] ]
```

因為要一層一層看的原因，所以直接用 BFS 去想，BFS 就是當我看完一個 node，我就把我的 children push 進去 queue 裡，然後每拿出一個 node 就一樣找他的 children 再推進去 queue 裡，這裡只需要解決一個問題，就是只要分辨哪些 node 是同一層就行了，因為同一層的 node 要放在同一個 subarray 裡。

這個問題也很好解決，當一層處理完要處理下一層的時候，表示現在 queue 裡只會有下一層的 node，所以 queue 的 size 就是下一層的 node 的數量，紀錄這個數字 `currentSize`，我們只要 pop `currentSize` 個 node 就是處理完下一層了。

#### **Template**

```cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    queue<TreeNode*>q;
    vector<vector<int>>result;
    if(root) q.push(root);
    while(!q.empty()){
        int currentSize = q.size();
        vector<int>level;
        for(int i=0; i<currentSize; i++){
            level.push_back(q.front()->val);
            if(q.front()->left) q.push(q.front()->left);
            if(q.front()->right) q.push(q.front()->right);
            q.pop();
        }
        result.push_back(level);
    }
    return result;
}
```

#### **範例**

[[ Leetcode 102 ] Binary Tree Level Order Traversal | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-102/)