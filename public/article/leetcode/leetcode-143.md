---
title: "[ Leetcode 143 ] Reorder List | 解題思路分享"
date: "2025-06-18"
author: James
tags: Linked List,Two Pointers
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 2
readTime: 2
id: a25344c6-7b1e-44f7-b5cc-e6a0ba1d10c7
---

給一組 Linked List

> L0 -> L1 -> ... -> Ln-1 -> Ln

想辦法重組成這樣

> L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 > ...

題目連結 🔗：[https://leetcode.com/problems/copy-list-with-random-pointer/](https://leetcode.com/problems/copy-list-with-random-pointer/)

### **問題分析**

這題沒有辦法像 array 的處理一樣，用 two pointers 讓 `right` 從後面更新回來插入 `left`，因為 linked list 沒有辦法從後面 iterate，所以最效率的方法是想辦法利用 node 之間重新排列組合來達成目的。

### **解題思路 - Linked List**

所以這題總共需要三個步驟：

> 1. 找到 middle<br>
> 2. reverse 後半的 list<br>
> 3. 將後半的 list 穿插進前半的 list

我們分單數跟雙數來舉例，以單數的 linked list 來說 :

```python
list = [1, 2, 3, 4, 5, 6, 7]
```

我們選擇將後半段 reverse

```python
list = [1, 2, 3, 4, 7, 6, 5]
```

這邊要注意的是所謂後半段是不包含 middle 的，原因是因為 middle 在穿插的過程不會被動到，他的 next 不用被放任何 node，他也不需要插入別人，所以就不用動他，最後把後半段插入到前半段。

```python
list = [1, 7, 2, 6, 3, 5, 4]
```

再來看雙數的例子 :

```python
list = [1, 2, 3, 4, 5, 6]
```

一樣後半段做 reverse，因為用 fast and slow pointers 算出來的 middle 會落在中間偏右的 node 上，也就是 4 號的位置，這邊同樣是做 middle 後的部分即可

```python
list = [1, 2, 3, 4, 6, 5]
```

再來一樣穿插

```python
list = [1, 6, 2, 5, 3, 4]
```

我們一步一步實作，首先利用 fast and slow pointers 可以找到 linked list 中 middle 的 node，`slow` 會落在 middle 的位置上。

```cpp
ListNode* slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
}
```

再來我們要將後半段的位置 reverse，而因為 reverse 是不包含 middle 的，所以利用 Head Insertion Method 做 reverse 時，可以讓 middle 作為 `groupHead`，往後 iterate 把 `curr` 插入 `groupHead` 後面即可。

```cpp
ListNode* groupHead = slow;
ListNode* prev = slow->next;
ListNode* curr = prev ? prev->next : nullptr;
while(curr) {
    prev->next = curr->next;
    curr->next = groupHead->next;
    groupHead->next = curr;
    curr = prev->next;
}
```

最後兩段 linked list 做左右穿插，這邊可以注意到，因為剛剛後半段的 list 是不包含 middle 的，所以 `right` 碰到 nullptr 就表示穿插結束了，如果我們 reverse 是有包含 middle 在內的，edge case 就會變得有點複雜，如果 `right` 碰到 nullptr 才結束穿插的話就會多做一次，因此 reverse 不含 middle 的做法是最好實作的。

```cpp
ListNode* left = head;
prev = groupHead;
ListNode* right = groupHead->next;
while(right){
    prev->next = right->next;
    right->next = left->next;
    left->next = right;
    left = right->next;
    right = prev->next;
}
```

最後處理一下 linked list 的 edge case 即可。

```cpp
if (!head || !head->next) return;
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
void reorderList(ListNode* head) {
    if (!head || !head->next) return;

    ListNode* slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }

    ListNode* groupHead = slow;
    ListNode* prev = slow->next;
    ListNode* curr = prev ? prev->next : nullptr;
    while(curr) {
        prev->next = curr->next;
        curr->next = groupHead->next;
        groupHead->next = curr;
        curr = prev->next;
    }

    ListNode* left = head;
    prev = groupHead;
    ListNode* right = groupHead->next;
    while(right){
        prev->next = right->next;
        right->next = left->next;
        left->next = right;
        left = right->next;
        right = prev->next;
    }
}
```
