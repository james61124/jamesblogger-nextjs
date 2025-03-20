---
title: "[ Leetcode 102 ] Binary Tree Level Order Traversal | 解題思路分享"
date: "2025-03-20"
author: James
tags: BFS,Tree,Binary Tree
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個 Binary Tree，要 return Level Order Traversal 的結果，而每一層的 node 從左到右都是一個 subarray。

題目連結 🔗：[https://leetcode.com/problems/binary-tree-level-order-traversal/](https://leetcode.com/problems/binary-tree-level-order-traversal/)

### **解題思路 - BFS**

因為要一層一層看的原因，所以直接用 BFS 去想，BFS 就是當我看完一個 node，我就把我的 children push 進去 queue 裡，然後每拿出一個 node 就一樣找他的 children 再推進去 queue 裡，這裡只需要解決一個問題，就是只要分辨哪些 node 是同一層就行了，因為同一層的 node 要放在同一個 subarray 裡。

這個問題也很好解決，當一層處理完要處理下一層的時候，表示現在 queue 裡只會有下一層的 node，所以 queue 的 size 就是下一層的 node 的數量，紀錄這個數字 `currentSize`，我們只要 pop `currentSize` 個 node 就是處理完下一層了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

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