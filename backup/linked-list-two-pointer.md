---
title: "[ Algorithm ] Sliding Window | 核心概念與 Leetcode 題型解析"
date: 2025-03-05
draft: false
author: "James"
tags:
  - Sliding Window
  - Algorithms
  - Leetcode
image: /images/program/Algorithm.webp
description: ""
toc: 
categories:
  - Algorithm
---

Two Pointers 中，原本是分三種 : 

1. 一頭一尾方向不同就是 Opposite Direction Two Pointers
2. 同方向但是速度不同就是 Fast and Slow Pointers
3. 不同 array 上就是 Seperate Two Pointers

在 Linked List 中，因為是單向的，所以不會有 Opposite Direction Two Pointers，下面就來細講 Linked List 的 Two Pointers

### **Fast and Slow Pointers**

主要用途：尋找倒數第 n 個 node、判斷 cycle、判斷 middle 等等

總共需要兩個 pointers **fast** 跟 **slow**，再細分的話還會分兩類：

1. fast 會先到他的 starting point，再來 fast 跟 slow 會用相同的速度移動，尋找倒數第 n 個 node 可以這樣解

##### **Template**

```cpp
ListNode* fastAndSlowPointer(ListNode* head) {
    ListNode* fast;
    ListNode* slow;

    for(int i=0; i<n; i++){
        fast = fast->next;
    }

    while(fast && fast->next){
        slow = slow->next;
        fast = fast->next;
    }

    return ...
}
```

2. fast 跟 slow 會用不同速度前進，判斷 cycle、判斷 middle 就是這種類型的題目

##### **Template**

```cpp
ListNode* fastAndSlowPointer(ListNode* head) {
    ListNode* fast;
    ListNode* slow;

    while(fast){

        if(...){
            slow = slow->next;
        }
        
        fast = fast->next;
    }

    return ...
}
```

#### **範例**

[19. Remove Nth Node From End of List](https://jamesblogger.com/zh/program/leetcode-19/)
[141. Linked List Cycle](https://jamesblogger.com/zh/program/leetcode-141/)

### **Seperate Two Pointers**

主要用途：不同 linked list 的 intersection, merge, comparison 等等