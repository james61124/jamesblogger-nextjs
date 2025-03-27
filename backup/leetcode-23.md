---
title: "[ Leetcode 23 ] Merge k Sorted Lists | 解題思路分享"
date: "2025-03-27"
author: James
tags: Linked List,Priority Queue,Merge Sort
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---



題目連結 🔗：[https://leetcode.com/problems/merge-k-sorted-lists/](https://leetcode.com/problems/merge-k-sorted-lists/)

### **問題分析**


### **解題思路**



**Time Complexity** - ``<br>
**Space Complexity** - ``

#### **Implementation**

```cpp
struct Compare {
    bool operator()(ListNode* a, ListNode* b) {
        return a->val > b->val;
    }
};

ListNode* mergeKLists(vector<ListNode*>& lists) {
    priority_queue<ListNode*, vector<ListNode*>, Compare> pq;
    for(int i=0; i<lists.size(); i++){
        if(lists[i]) pq.push(lists[i]);
    }

    ListNode* cur = new ListNode(0);
    ListNode* dummy = cur;
    while(!pq.empty()){
        cur->next = pq.top();
        cur = cur->next;
        if(cur->next) pq.push(cur->next);
        pq.pop();
    }
    return dummy->next;

}
```