---
title: "[ Leetcode 2 ] Add Two Numbers | 解題思路分享"
date: "2025-05-23"
author: James
tags: Linked List,Math,Recursion,Google,Meta
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 3
readTime: 2
---

給兩個 Linked List，代表兩個整數，只是是以 reverse order 的方式儲存，要回傳這兩個整數的總和，一樣要以 Linked List + reverse order 的方式儲存。

題目連結 🔗：[https://leetcode.com/problems/add-two-numbers/](https://leetcode.com/problems/add-two-numbers/)

### **問題分析**

題目的 node 是 reverse order，也就是說我們如果按照順序加總每一個 node，就等於是按照個位數 -> 十位數 -> 百位數這個正確的順序計算了，再來只要處理好進位就沒問題了。

### **解題思路 - Linked List**

總共分三個步驟：

> 1. `l1`, `l2` 都還有數字時
> 2. `l1`, `l2` 剩一條還有數字
> 3. `l1`, `l2` 都加完了

當 `l1`, `l2` 都還有數字時，我們要將兩邊的數字相加，計算出進位之後丟給下一個數字，寫起來會像這樣：

```cpp
int carry = 0;
while(l1 && l2) {
    int num = l1->val + l2->val + carry;
    carry = num / 10;
    num = num % 10;
    result->next = new ListNode(num);
    result = result->next;
    l1 = l1->next;
    l2 = l2->next;
}
```

`l1`, `l2` 剩一條還有數字時就會跳出迴圈，再來要就是處理剩下那一條的數字跟進位即可

```cpp
if(!l1) swap(l1, l2);
while(l1) {
    int num = l1->val + carry;
    carry = num / 10;
    num = num % 10;
    result->next = new ListNode(num);
    result = result->next;
    l1 = l1->next;
}
```

最後 `l1` 如果也加完了，再把最後的進位加上去

```cpp
if(carry) result->next = new ListNode(carry);
```

所以完整程式碼如下：

```cpp
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode* dummy = new ListNode(-1);
    ListNode* result = dummy;
    int carry = 0;

    while(l1 && l2) {
        int num = l1->val + l2->val + carry;
        carry = num / 10;
        num = num % 10;
        result->next = new ListNode(num);
        result = result->next;
        l1 = l1->next;
        l2 = l2->next;
    }

    if(!l1) swap(l1, l2);
    while(l1) {
        int num = l1->val + carry;
        carry = num / 10;
        num = num % 10;
        result->next = new ListNode(num);
        result = result->next;
        l1 = l1->next;
    }

    if(carry) result->next = new ListNode(carry);
    return dummy->next;
}
```

從時間複雜度跟空間複雜度來說這樣寫是沒有問題的，但是有很多重複的思路其實可以優化，會分成三個步驟的原因就是因為我們有三個東西需要相加 `l1`, `l2`, `carry`，那我們是不是可以理解為，三個東西都有的時候就一起加，剩兩個就加兩個，剩一個就加那一個，最後都沒有就是結束，這樣就可以把所有 function 寫在一個 while loop 內。

```cpp
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode* dummy = new ListNode(-1);
    ListNode* result = dummy;
    int carry = 0;

    while(l1 || l2 || carry) {
        int num1 = l1 ? l1->val : 0;
        int num2 = l2 ? l2->val : 0;
        int sum = num1 + num2 + carry;
        carry = sum / 10;
        sum %= 10;

        result->next = new ListNode(sum);
        result = result->next;
        if(l1) l1 = l1->next;
        if(l2) l2 = l2->next;
    }

    return dummy->next;
}
```

所以如果 `l1` 沒有值 `num1` 就設 0，如果 `l2` 沒有值 `num2` 就設 0，這樣直接把 `num1` + `num2` + carry 寫在一起就好了。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode* dummy = new ListNode(-1);
    ListNode* result = dummy;
    int carry = 0;

    while(l1 || l2 || carry) {
        int num1 = l1 ? l1->val : 0;
        int num2 = l2 ? l2->val : 0;
        int sum = num1 + num2 + carry;
        carry = sum / 10;
        sum %= 10;

        result->next = new ListNode(sum);
        result = result->next;
        if(l1) l1 = l1->next;
        if(l2) l2 = l2->next;
    }

    return dummy->next;
}
```
