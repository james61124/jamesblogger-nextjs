---
title: "[ Algorithm ] Two Pointers - Linked List | 核心概念與 Leetcode 題型解析"
date: "2025-04-23"
author: James
tags: Algorithm,Linked List,Two Pointers
image: /images/program/algorithm.png
description: "Two Pointers 中，原本是分三種 : 1. Opposite Direction Two Pointers - 一頭一尾方向不同 2. Fast and Slow Pointers - 同方向"
readTime: 2
---

Two Pointers 中，原本是分三種 : 

> 1. **Opposite Direction Two Pointers** - 一頭一尾方向不同<br>
> 2. **Fast and Slow Pointers** - 同方向<br>
> 3. **Seperate Two Pointers** - 在不同 array 上

但在 Linked List 中，因為是單向的，所以不會有 Opposite Direction Two Pointers，下面就來細講 Linked List 的 Two Pointers 分類。

### **Fast and Slow Pointers**

主要用途：尋找倒數第 n 個 node、判斷 cycle、判斷 middle 等等

實作上會需要兩個 pointers `fast` 跟 `slow`，再細分的話還會分兩類：

> fast 會先到他的 starting point，再來 fast 跟 slow 會用相同的速度移動

尋找倒數第 n 個 node 可以這樣解，例如說 [ Leetcode 19 ] Remove Nth Node From End of List，就是利用 fast, slow 兩個 pointers 來找倒數第 n 個 node 的，fast 先移到第 n 個 node，再來兩個 pointers 用相同的速度移動，最後 fast 碰到底的時候 slow 就會落在倒數第 n 個 node 身上。

#### **Template**

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

> fast 跟 slow 會用不同速度前進，判斷 cycle、判斷 middle 就是這種類型的題目

[ Leetcode 141 ] Linked List Cycle 就是一個判斷 cycle 的例子，讓 fast pointer 的速度用 slow pointer 的兩倍跑，如果有 cycle 的話最後 fast 一定會追上 slow，這是一個非常持用的技巧。

[ Leetcode 876 ] Middle of the Linked List 就是找 middle 的範例題，讓 fast 用 slow 兩倍的速度往前走，fast 走到底的時候 slow 就會在 middle 的位置了。

#### **Template**

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

[[ Leetcode 19 ] Remove Nth Node From End of List | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-19)<br>
[[ Leetcode 141 ] Linked List Cycle | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-141)<br>
[[ Leetcode 876 ] Middle of the Linked List | 解題思路分享](https://www.jamesblogger.com/leetcode/articles/leetcode-876)

### **Seperate Two Pointers**

主要用途：不同 linked list 的 intersection, merge, comparison 等等

#### **Template**

```cpp
ListNode* left_1 = list1;
ListNode* left_2 = list2;

while(left_1 && left_2){
    if( condition 1 ) {
        left_1 = left_1->next;
        left_2 = left_2->nextl
    } else if( condition 2 ) {
        left_1 = left_1->next;
    } else {
        left_2 = left_2->next;
    }
}
```

#### **範例**

[[ Leetcode 21 ] Merge Two Sorted Lists | 解題思路分享](https://www.jamesblogger.com/leetcode/articles/leetcode-21)