---
title: "[ Leetcode 237 ] Delete Node in a Linked List | 解題思路分享"
date: "2025-12-02"
author: James
tags: Linked List,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個要被刪除的 ListNode pointer，刪除這個 node，要注意題目只會給這個 node，並不會給 linked list 的 head

題目連結 🔗：[https://leetcode.com/problems/delete-node-in-a-linked-list/](https://leetcode.com/problems/delete-node-in-a-linked-list/)

### **解題思路**

因為沒有辦法 access `head`，沒有辦法用以前 delete node 的方法，把 prev 指向 next，我們只能 access 題目給的 node 跟往後的所有 node，那我們就把下一個 node 的資訊複製過來，然後把下一個 node 刪除掉就可以了

**Time Complexity** - `O(1)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
void deleteNode(ListNode* node) {
    ListNode* nodeRemove = node->next;
    node->val = nodeRemove->val;
    node->next = nodeRemove->next;
    nodeRemove = nullptr;
}
```
