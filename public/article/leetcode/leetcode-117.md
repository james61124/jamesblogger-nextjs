---
title: "[ Leetcode 117 ] Populating Next Right Pointers in Each Node II | 解題思路分享"
date: "2025-09-25"
author: James
tags: Linked List,Tree,Binary Tree,BFS,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 3804de0f-f2fb-49a5-8085-1984db9a8ee7
---

給一個 Binary Tree，每一個 node 都有一個 `next` pointer，目標是讓每個 node 的 `next` pointer 指向該層的右邊那個 node，如果已經是最右邊的 node 就指向 `nullptr`。

題目連結 🔗：[https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/)

## 問題分析

這題最直覺的做法就是一層一層 iterate，然後按照順序把他們接起來就好，而 level order traversal 有點像是 bfs，利用一個 queue 就可以完成，這樣也可以，但是需要花到 O(n) 的空間，事實上這題可以用 O(1) 的空間就解決。

## 解題思路

這題我們其實不用把每一層的 node 都先推到 queue 裡面，我們可以在 iterate 一層時把下一層的 children 都連起來，這樣就不用靠 queue 就可以知道該層的 node 有哪些，有點繞但我舉個例子

```
       1
     /   \
    2     3
   / \     \
  4   5     7
```

iterate 1 的時候就可以把 2 -> 3 接起來，這邊沒有問題。

再來從 2 開始 iterate，就把他的小孩接起來，所以現在 4 -> 5，再來 iterate 到 3，就接續剛剛把小孩接上去，所以現在是 4 -> 5 -> 7，以此類推就可以用同樣的方式也把接下來每一層都接起來，所以關鍵在於因為每一層我們都已經用 `next` 接起來了，所以就不用都先把他們丟進去 queue 裡面再把同一層的東西按照順序拔出來。

所以我們需要兩個 pointers，一個 `curr` 在上面那層，也就是原本就已經接好的那層移動，另一個 `tail` 負責接下面那層的 node，寫起來會像這樣

```cpp
while(curr) {
    if(curr->left) {
        tail->next = curr->left;
        tail = tail->next;
    }
    if(curr->right) {
        tail->next = curr->right;
        tail = tail->next;
    }
    curr = curr->next;
}
```

再來的問題是我們要讓 `curr` 可以完美的移到下一層，所以我們在 iterate 的時候可以在下一層設個 `dummy` head，然後他就不要動，iterate 結束就可以直接定位下一層的開頭讓 `curr` 指過去

```cpp
while(curr) {
    Node dummy(0);
    Node* tail = &dummy;
    while(curr) {
        if(curr->left) {
            tail->next = curr->left;
            tail = tail->next;
        }
        if(curr->right) {
            tail->next = curr->right;
            tail = tail->next;
        }
        curr = curr->next;
    }
    curr = dummy.next;
}
```

這樣就差不多完成了，完整程式碼在下面

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
Node* connect(Node* root) {
    Node* curr = root;
    while(curr) {
        Node dummy(0);
        Node* tail = &dummy;
        while(curr) {
            if(curr->left) {
                tail->next = curr->left;
                tail = tail->next;
            }
            if(curr->right) {
                tail->next = curr->right;
                tail = tail->next;
            }
            curr = curr->next;
        }
        curr = dummy.next;
    }
    return root;
}
```
