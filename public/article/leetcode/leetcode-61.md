---
title: "[ Leetcode 61 ] Rotate List | 解題思路分享"
date: "2025-09-16"
author: James
tags: Linked List,Google,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 3
id: e4977433-d64b-4509-bc68-15e6dbf01789
---

給一個 linked list，輸出向右 rotate k 次的結果

題目連結 🔗：[https://leetcode.com/problems/rotate-list/](https://leetcode.com/problems/rotate-list/)

### **問題分析**

第一感其實是 reverse list，先把整個 list reverse，再分兩邊各自 reverse，其實也是 O(n)，不過標準解法更簡潔一點。

這題不用搞這麼複雜，只要找到倒數第 k 個 node，這個是新的 head，然後把最後一個 node 跟原本的 head 接起來變成一個 cycle，最後再把剛剛新的 head 前面的鏈斷掉就好。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
ListNode* rotateRight(ListNode* head, int k) {
    if(!head || !head->next) return head;

    int count = 1;
    ListNode* curr = head;
    while(curr->next) {
        curr = curr->next;
        count++;
    }

    k %= count;
    if(k == 0) return head;

    curr->next = head;
    k = count - k;
    for(int i = 0; i < k; i++){
        curr = curr->next;
    }

    ListNode* newHead = curr->next;
    curr->next = nullptr;

    return newHead;
}
```