---
title: "[ Leetcode 25 ] Reverse Nodes in k-Group | 解題思路分享"
date: "2025-06-09"
author: James
tags: Linked List,Head Insertion Method
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
id: b8f60208-6fd7-42d3-b120-225e925fe369
---

給定一個 linked list `head`，你需要將每 k 個 node 為一組進行反轉，如果最後剩下的 node 數量不足 k，就保留原狀。

題目連結 🔗：[https://leetcode.com/problems/reverse-nodes-in-k-group/](https://leetcode.com/problems/reverse-nodes-in-k-group/)

## 問題分析

遇到 Reverse Linked List，我們可以用一個很有名的演算法 - 頭插法 ( Head Insertion Method )。

## 解題思路 - Head Insertion Method

頭插法的思路其實很簡單，我們需要三個指標：`groupPrev`, `prev`, `curr`，`groupPrev` 會落在要反轉的那段 Linked List 的前面，而 `curr` 是當下需要被反轉的 node，會一直保持在 `prev` 後面。過程中只要一直把 `curr` 插入 `groupPrev` 的後面，然後更新 `curr` 到 `prev`，一直重複這個動作就可以把那段 Linked List 反轉了，圖示如下：

<figure>
  <img src="/images/leetcode/leetcode-25/insert-to-head.png" alt="Linked List" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    Head Insertion Method
  </figcaption>
</figure>

學會怎麼 reverse linked list 後這題就單純很多了，這題會把整條 linked list 每 k 個分一組，也就是說我們只要找到每一組 `groupPrev`, `prev`, `curr` 的位置就可以直接進行頭插法了，做完在找下一組。

首先第一組的 `groupPrev` 會落在 `head` 之前，我們直接開一個 `dummy` 裝在 head 的前面放 `groupPrev`。

```cpp
ListNode* dummy = new ListNode(0);
dummy->next = head;
ListNode* groupPrev = dummy;
```

再來對於每一組來說，`prev` 會落在 `groupPrev` 後面，`curr` 會落在 `prev` 後面，而做完頭插法後 `prev` 會落在下一組的前面一個 node，因此下一組的 `groupPrev` 就是結束後 `prev` 的位置，寫起來會是這樣：

```cpp
ListNode* dummy = new ListNode(0);
dummy->next = head;
ListNode* groupPrev = dummy;
while(true){
    ListNode* prev = groupPrev->next;
    ListNode* curr = prev->next;

    // Head Insertion Method
    for(int j = 0; j < k - 1; j++){
        prev->next = curr->next;
        curr->next = groupPrev->next;
        groupPrev->next = curr;
        curr = prev->next;
    }

    groupPrev = prev;
}
```

但最後一組的數量如果不到 k 個表示不需要進行 reverse，因此我們要能判斷每一組的數量是否足夠，不夠的話就直接跳出就可以了。

```cpp
ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode* dummy = new ListNode(0);
    dummy->next = head;

    ListNode* groupPrev = dummy;
    while(true){

        // 判斷每一組個數是否有 k 個
        ListNode* kth = groupPrev;
        for(int i = 0; i < k && kth; i++){
            kth = kth->next;
        }
        if(!kth) break;

        ListNode* prev = groupPrev->next;
        ListNode* curr = prev->next;

        for(int j = 0; j < k - 1; j++){
            prev->next = curr->next;
            curr->next = groupPrev->next;
            groupPrev->next = curr;
            curr = prev->next;
        }

        groupPrev = prev;
    }

    return dummy->next;
}
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

## Implementation

```cpp
ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode* dummy = new ListNode(0);
    dummy->next = head;

    ListNode* groupPrev = dummy;
    while(true){
        ListNode* kth = groupPrev;
        for(int i = 0; i < k && kth; i++){
            kth = kth->next;
        }
        if(!kth) break;

        ListNode* prev = groupPrev->next;
        ListNode* curr = prev->next;

        for(int j = 0; j < k - 1; j++){
            prev->next = curr->next;
            curr->next = groupPrev->next;
            groupPrev->next = curr;
            curr = prev->next;
        }

        groupPrev = prev;
    }

    return dummy->next;
}
```