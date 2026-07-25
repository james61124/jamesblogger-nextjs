---
title: "[ Leetcode 141 ] Linked List Cycle | 解題思路分享"
date: "2025-03-03"
author: James
tags: Linked List,Two Pointers
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: c1f2c8b8-a5d8-4dff-b674-106cd604deb3
---

給一個 linked list，要判斷有沒有 cycle。

題目連結🔗：[https://leetcode.com/problems/linked-list-cycle/](https://leetcode.com/problems/linked-list-cycle/)

### **解題思路 - Fast and Slow Pointers ( Floyd's Cycle Detection Algorithm )**

這是最經典的 linked list 判斷有沒有 cycle 的題目，讓 fast iterate 的速度是 slow 的兩倍，如果 linked list 有 cycle 的話，fast 最後會追上 slow。

**Time Complexity** - `O(n)`，最多 iterate n 個 node<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
bool hasCycle(ListNode *head) {
    ListNode* fast = head;
    ListNode* slow = head;

    while(fast && fast->next){
        fast = fast->next->next;
        slow = slow->next;
        if(slow == fast) return true;
    }
    return false;
}
```