---
title: "[ Leetcode 92 ] Reverse Linked List II | 解題思路分享"
date: "2025-09-03"
author: James
tags: Linked List,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
---

給一個 Linked List，再給兩個整數 `left`, `right`，把 index `left` ~ `right` 中間的 node reverse。 

題目連結 🔗：[https://leetcode.com/problems/reverse-linked-list-ii/](https://leetcode.com/problems/reverse-linked-list-ii/)

### **問題分析**

題目說把 left ~ right 中間的 node 進行 reverse，沒什麼特別的技巧，用頭插法就可以解決了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
ListNode* reverseBetween(ListNode* head, int left, int right) {
    ListNode* dummy = new ListNode(-1);
    dummy->next = head;
    ListNode* groupHead = dummy;

    for(int i = 0; i < left - 1; i++) groupHead = groupHead->next;
    ListNode* prev = groupHead->next;
    ListNode* curr = prev->next;
    
    for(int i = 0; i < right - left; i++){
        prev->next = curr->next;
        curr->next = groupHead->next;
        groupHead->next = curr;
        curr = prev->next;
    }

    return dummy->next;
}
```