---
title: "[ Leetcode 173 ] Binary Search Tree Iterator | 解題思路分享"
date: "2025-09-27"
author: James
tags: Tree,Binary Tree,Morris Traversal,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
id: 01f8f663-6642-4676-bba5-0f9f423d152f
---

給一個 Binary Tree，當呼叫 `next()` 要回傳下一個 in-order 順序的 node，呼叫 `hasNext()` 要判斷 in-order traversal 中還有沒有下一個 node

題目連結 🔗：[https://leetcode.com/problems/binary-search-tree-iterator/](https://leetcode.com/problems/binary-search-tree-iterator/)

### **問題分析**

題目說要 in-order，最直接的方式就是把整顆 Tree 都先照反的順序 dump 到 stack 中，再來就一個一個 pop 出來即可。這我覺得沒有什麼好講的，直接給程式碼

```cpp
class BSTIterator {
private:
    stack<int>st;
public:
    BSTIterator(TreeNode* root) {
        dfs(root);
    }

    void dfs(TreeNode* root) {
        if(!root) return;
        dfs(root->right);
        st.push(root->val);
        dfs(root->left);
    }   
    
    int next() {
        int val = st.top();
        st.pop();
        return val;
    }
    
    bool hasNext() {
        return !st.empty();
    }
};
```

但如果題目沒有說不可以破壞原本 Tree Structure 的情況下，其實有另一個解法可以不用開 O(n) 的空間，那就是 Morris Traversal

### **解題思路 - Morris Traversal**

Morris Traversal 是一種「不透過遞迴及 stack 的情況，暫時改動 Tree Structure 來完成 in order traversal」的方法。

先來複習一下 in-order traversal，dump 出來順序是這樣

```
[left subtree][root][right subtree]
```

因為他是 iterator，目標是 O(1) 的時間找到下一個 node，而初始化的時候 `curr` 是在 root 身上，換句話說 `curr` 這個 node 是還沒有被 visit 過的 node，所以如果 `curr` 沒有 left subtree，表示下一個 node 就是他自己，所以輸出之後 `curr = cur->right`，這應該比較沒有問題，關鍵在於有 left subtree 的情況。

```cpp
if(!curr->left) {
    result = curr->val;
    curr = curr->right;
}
```

先抓住一個核心概念，我們要用 pointer 來接回 recursion 後需要回溯的部分，舉下面這個例子

```
       1
     /   \
    2     3
   / \     \
  4   5     7
```

這題在走完 4 要回溯到 2，所以我們會暫時讓 4->right = 2，走完 5 會需要回到 1，所以我們會暫時讓 5->right = 1，簡單來說

> `curr` left subtree 的最右邊那個 node 要指回 `curr` 自己

利用下面這段 code 可以找到 left subtree 的最右邊那個 node

```cpp
TreeNode* pre = curr->left;
while(pre->right && pre->right != curr) pre = pre->right;
```

現在知道這個觀念後一個一個來看，當 `curr` = 1，left subtree 最右邊的 node = 5，先讓 5->right 指向 1，再來 curr 就左邊走走到 2

再來 `curr` = 2，left subtree 最右邊的 node = 4，所以讓 4->right 指向 2，curr 往左邊走走到 4

再來 `curr` = 4，沒有 left subtree，前面說過沒有 left subtree 就回傳自己並往 right 走，而 right 剛剛已經指到 2 了，所以先回傳自己，然後 `curr` 回到 2，這樣就完成一次 `next()`

剛剛這段簡單寫出來是這樣

```cpp
while(curr) {
    if(!curr->left) {
        result = curr->val;
        curr = curr->right;
        break;
    }

    TreeNode* pre = curr->left;
    while(pre->right && pre->right != curr) pre = pre->right;

    if(!pre->right) {
        pre->right = curr;
        curr = curr->left;
    }
}
```

再來 `curr` 回到 2，我們發現他 left subtree 最右邊的 node 的 right 不是 nullptr，表示剛剛已經處理過這個 node 了，也就是說這個 `curr` 的 left subtree 已經處理完畢，那我們就要把這個 right pointer 復原，然後回傳 `curr` 自己並往右邊走，所以現在 `next()` 回傳 2 自己，然後往右邊走到 5，寫成程式碼就是多加一段

```cpp
while(curr) {
    if(!curr->left) {
        result = curr->val;
        curr = curr->right;
        break;
    }

    TreeNode* pre = curr->left;
    while(pre->right && pre->right != curr) pre = pre->right;

    if(!pre->right) {
        pre->right = curr;
        curr = curr->left;
    } else {
        result = curr->val;
        pre->right = nullptr;
        curr = curr->right;
        break;
    }
}
```

到這邊就幾乎完成了，繼續 trace 下去就會發現，5->right 剛剛也指回 1，所以 5 完就會跑到 1，然後再把 5->right 指回 nullptr，重複這個過程就可以了，這樣我們就可以不用開 stack 跟 recursion 完成 in-order 的 traversal，下面附上完整程式碼

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
class BSTIterator {
private:
    TreeNode* curr;
public:
    BSTIterator(TreeNode* root) {
        curr = root;
    }
    
    int next() {
        int result = 0;
        while(curr) {
            if(!curr->left) {
                result = curr->val;
                curr = curr->right;
                break;
            }

            TreeNode* pre = curr->left;
            while(pre->right && pre->right != curr) pre = pre->right;

            if(!pre->right) {
                pre->right = curr;
                curr = curr->left;
            } else {
                result = curr->val;
                pre->right = nullptr;
                curr = curr->right;
                break;
            }
        }

        return result;
    }
    
    bool hasNext() {
        return curr != nullptr;
    }
};
```
