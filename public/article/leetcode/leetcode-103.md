---
title: "[ Leetcode 103 ] Binary Tree Zigzag Level Order Traversal | 解題思路分享"
date: "2025-10-09"
author: James
tags: Tree,Binary Tree,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 22974b65-037b-441b-90a1-b211010c99d9
---

給一個 Binary Tree，第一層由左到右 traverse，下一層由右到左，再下一層由左到右以此類推，把 traverse 的順序填到 2D array

題目連結 🔗：[https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)

### **問題分析**

這題基本上就是 level order traversal 的小變形，我們知道 level order 就是利用 queue 記錄下一層的每個 nodes，只是題目說要一正一反要怎麼做呢？

其實沒那麼複雜，每一層在 visit 的時候會需要將 node 從 queue 裡面拿出來放進去 result 的 vector 裡面，遇到反的就從後面開始放就好，這樣我們就不用動 traversal 的部分

### **解題思路 - Level Order Traversal**

我們先完成一個 Level Order Traversal

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

return result;
```

再來建立一個 `result` 的 vector，存最後的結果，另外設一個 flag `leftToRight` 來判斷這層是由右到左還是由左到右，再來依照方向把 nodes 填進去 result 就行了

```cpp
queue<TreeNode*>q;
vector<vector<int>>result;
bool leftToRight = true;
q.push(root);

while(!q.empty()){
    int levelSize = q.size();
    vector<int>level(levelSize);

    for(int i = 0; i < levelSize; i++){
        TreeNode* curr = q.front();
        q.pop();

        int idx = leftToRight ? i : levelSize - i - 1; // 由右到左的話就反著填
        level[idx] = curr->val;

        if(curr->left) q.push(curr->left);
        if(curr->right) q.push(curr->right);
    }
    result.push_back(std::move(level));
    leftToRight = !leftToRight;
}

return result;
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(W)`

#### **Implementation**

```cpp
vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    if(!root) return {}; 
    queue<TreeNode*>q;
    vector<vector<int>>result;
    bool leftToRight = true;
    q.push(root);

    while(!q.empty()){
        int levelSize = q.size();
        vector<int>level(levelSize);

        for(int i = 0; i < levelSize; i++){
            TreeNode* curr = q.front();
            q.pop();

            int idx = leftToRight ? i : levelSize - i - 1;
            level[idx] = curr->val;

            if(curr->left) q.push(curr->left);
            if(curr->right) q.push(curr->right);
        }
        result.push_back(std::move(level));
        leftToRight = !leftToRight;
    }

    return result;
}
```
 