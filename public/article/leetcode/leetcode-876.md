---
title: "[ Leetcode 876 ] Middle of the Linked List | 解題思路分享"
date: "2025-03-03"
author: James
tags: Linked List,Two Pointers
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 linked list，要 return 中間那個 node。

題目連結 🔗：[https://leetcode.com/problems/middle-of-the-linked-list/](https://leetcode.com/problems/middle-of-the-linked-list/)

### **問題分析**

這題就是想辦法找到中間的 node 就可以了。

### **解題思路 - Fast and Slow Pointer**

讓 fast iterate 的速度是 slow 的兩倍，這樣 fast 到底的時候 slow 就會剛好落在 middle 的位置。

#### **Two Pointer 起始位置**

稍微思考一下長度奇偶數的狀況就行，兩個 pointers 都從 head 開始

- 如果 Linked List 長度是偶數，那 `fast->next == nullptr` 的時候 slow 會在 middle
- 如果 Linked List 長度是奇數，`fast == nullptr` 的時候 slow 會在 middle

**Time Complexity** - `O(n)`，每個元素最多被 fast 掃過。<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
ListNode* middleNode(ListNode* head) {
    ListNode* fast = head;
    ListNode* slow = head;

    while(fast && fast->next){
        fast = fast->next->next;
        slow = slow->next;
    }
    return slow;
}
```