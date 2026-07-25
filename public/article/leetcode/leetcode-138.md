---
title: "[ Leetcode 138 ] Copy List with Random Pointer | 解題思路分享"
date: "2025-06-18"
author: James
tags: Linked List, Interleaved List
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 2
id: 78eaf6c5-9f01-4517-8de8-2fa42f100ec9
---

很多人第一個想到的解法都是 Hash Map。

因為 `random` 可以指向任何 node，只要建立 `old node -> new node` 的對應關係，就能很輕鬆完成 deep copy。

但這題真正想考的，其實是 **Interleaving Node Insertion**。只要利用 Linked List 本身，就可以把額外空間從 **O(n)** 降到 **O(1)**。

題目連結 🔗  
https://leetcode.com/problems/copy-list-with-random-pointer/

---

## 為什麼不用 Hash Map？

Hash Map 的做法很直覺，也很好寫。

但缺點就是需要額外的 `O(n)` 空間。

如果希望做到 `O(1)`，就必須換一種思考方式。

---

## 核心想法：Interleaving Node Insertion

先把 Linked List 變成：

```text
A -> A' -> B -> B' -> C -> C'
```

新的 Node 永遠放在舊 Node 後面。

這樣最大的好處就是：

```cpp
curr->next->random = curr->random->next;
```

因為每個新的 Node 都緊跟在舊 Node 後面，所以 `old->random->next` 就一定是新的 random，不需要 Hash Map。

---

## Step 1 — 在每個 Node 後面插入新的 Node

第一步不用管 `random`。

先把整條 Linked List 插成交錯排列。

```cpp
Node* curr = head;
while(curr){
    Node* node = new Node(curr->val);
    node->next = curr->next;
    curr->next = node;
    curr = node->next;
}
```

---

## Step 2 — 更新 random Pointer

等所有新的 Node 都建立完成後，就可以一次更新所有 random。

一開始可能會想到用兩個 pointer：

```cpp
Node* prev = head;
curr = head->next;
...
```

不過仔細觀察會發現，新的 Node 永遠都在舊 Node 後面，因此其實只需要一個 pointer。

```cpp
curr = head;
while(curr){
    if(curr->random)
        curr->next->random = curr->random->next;

    curr = curr->next->next;
}
```

我覺得這也是整題最漂亮的一段。

---

## Step 3 — 拆開兩條 Linked List

最後把交錯排列：

```text
A -> A' -> B -> B' -> C -> C'
```

拆回：

```text
A -> B -> C

A' -> B' -> C'
```

同時也要把原本的 Linked List 復原。

```cpp
curr = head;
head = head->next;
while(curr){
    Node* nextCurr = curr->next->next;
    if(nextCurr) curr->next->next = nextCurr->next;
    curr->next = nextCurr;
    curr = curr->next;
}
```

---

## Corner Case

唯一需要額外處理的是：

```cpp
if(!head) return nullptr;
```

如果只有一個 Node，整個流程仍然可以正常運作。

---

## Complexity

**Time Complexity**

`O(n)`

**Space Complexity**

`O(1)`

---

## Complete Implementation

```cpp
Node* copyRandomList(Node* head) {
    if(!head) return nullptr;

    Node* curr = head;
    while(curr){
        Node* node = new Node(curr->val);
        node->next = curr->next;
        curr->next = node;
        curr = node->next;
    }

    curr = head;
    while(curr){
        if(curr->random)
            curr->next->random = curr->random->next;
        curr = curr->next->next;
    }

    curr = head;
    head = head->next;
    while(curr){
        Node* nextCurr = curr->next->next;
        if(nextCurr)
            curr->next->next = nextCurr->next;

        curr->next = nextCurr;
        curr = curr->next;
    }

    return head;
}
```
