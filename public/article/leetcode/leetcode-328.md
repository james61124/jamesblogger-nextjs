---
title: "[ Leetcode 328 ] Odd Even Linked List | 解題思路分享"
date: "2025-12-02"
author: James
tags: Linked List,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: a6d2a93e-c4aa-4cba-8110-d8d5f9093db4
---

給一條 linked list，重新 reorder，其中單數 index 的 node 要放前面，雙數 index 的 node 要放後面

題目連結 🔗：[https://leetcode.com/problems/odd-even-linked-list/](https://leetcode.com/problems/odd-even-linked-list/)

## 問題分析

這題沒什麼特別的，用兩個 pointers 把兩條 linked list 串起來就好了

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
ListNode* oddEvenList(ListNode* head) {
    if(!head || !head->next) return head;
    ListNode* odd = head;
    ListNode* even = head->next;
    ListNode* evenHead = even;

    while(even && even->next) {
        odd->next = even->next;
        odd = odd->next;

        even->next = odd->next;
        even = even->next;
    }

    odd->next = evenHead;
    return head;
}
```
