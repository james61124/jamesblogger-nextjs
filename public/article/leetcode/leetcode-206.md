---
title: "[ Leetcode 206 ] Reverse Linked List | 解題思路分享"
date: "2025-04-15"
author: James
tags: Linked List,Recursion
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一條 Linked List，return 一條 reverse 過的 Linked List

題目連結 🔗：[https://leetcode.com/problems/reverse-linked-list/](https://leetcode.com/problems/reverse-linked-list/)

### **問題分析**

這題有分 iterate 的解法跟 recursion 的解法，不過 iterate 的解法應該還是比較直覺也比較快。

### **解題思路 - Iterate**

簡單來說如果 A -> B -> C，我們需要三個 pointers，讓 B->next 指向 A，再來 A pointer 跑到 B，B pointer 跑到 C，C 再往後跑，這樣一路做到底就 reverse 完整條了。

那這種 Linked List 的題目 edge case 都要特別小心，稍微注意一下 List 只有一個 node 跟 List 完全沒有 node 的情況就可以了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
ListNode* reverseList(ListNode* head) {

    ListNode* cur = head;
    ListNode* prev = nullptr;

    while(cur){
        ListNode* temp = cur->next;
        cur->next = prev;
        prev = cur;
        cur = temp;
    }

    return prev;
}
```

### **另一種思路 - Recursion**

Recursion 的思路大致上是這樣，對於每一層來說，我們都需要拿到最尾巴的 node 來當我們的 newHead，所以最後可以直接回傳這個 node

```cpp
ListNode* newHead = reverseList(head->next);
```

所以每一層要做的事情就是把 head->next 的 next 指向 head，然後 head->next 指到 nullptr 防止 cycle，再來把 NewHead 回傳回去就可以了，至於怎麼找到 newHead，就是當 Linked List 走到底的時候，直接回傳最後一個 node 就可以了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
ListNode* reverseList(ListNode* head) {
    if(!head || !head->next) return head;
    ListNode* newHead = reverseList(head->next);
    head->next->next = head;
    head->next = nullptr;
    return newHead;
}
```
