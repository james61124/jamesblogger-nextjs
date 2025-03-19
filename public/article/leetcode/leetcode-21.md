---
title: "[ Leetcode 21 ] Merge Two Sorted Lists | 解題思路分享"
date: "2025-03-06"
author: James
tags: Linked List,Two Pointers
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個正整數 array `nums` 和一個正整數 `k`，找出乘積小於 `k` 的 subarray 數量。

題目連結 🔗：[https://leetcode.com/problems/merge-two-sorted-lists/](https://leetcode.com/problems/merge-two-sorted-lists/)

### **問題分析**

這題就是從 seperate two pointers 去想，小心一下誰指向誰然後誰往前就行了。

### **解題思路 - Two Pointers**

我們需要一個 pointer `cur` 指向前一個還沒有被合併的 node，比較 list1 跟 list2 哪一個 val 比較小，就把 cur->next 指過去，這裡會遇到幾個問題：

#### **pointer 起始位置**

cur 要從 list1 還是 list2 開始如果寫 if-else 來判斷不是一個很好的寫法，所以我們可以開一個 ListNode dummy(0) 的空間，cur 先指向這裡，再來直接比較兩條 linked list 的頭就可以開始了。

#### **收尾**

最後只要 list1 或是 list2 指到 null 我們就沒有辦法繼續比較 val 了，所以就可以直接跳出迴圈，但這樣另一條 linked list 會剩下一個 node 還沒有接上，所以 cur 要記得再把最後那個 node 接上。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    ListNode dummy(-1);
    ListNode* cur = &dummy;
    
    while(list1 && list2){
        if(list1->val <= list2->val){
            cur->next = list1; 
            list1 = list1->next;
        } else {
            cur->next = list2;
            list2 = list2->next;
        }
        cur = cur->next;
    }

    cur->next = list1 ? list1 : list2;
    return dummy.next;
}
```