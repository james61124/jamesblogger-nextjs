---
title: "[ Data Structure ] Binary Tree | 核心概念與 Leetcode 題型解析"
date: "2025-02-27"
author: James
tags: Data Structure,Binary Tree
image: /images/program/data-structure.jpeg
description: ""
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

144

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

94.

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

145.

### **Level Order Traversal**

##### **Template**

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