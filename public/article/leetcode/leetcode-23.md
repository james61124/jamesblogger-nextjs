---
title: "[ Leetcode 23 ] Merge k Sorted Lists | 解題思路分享"
date: "2025-03-27"
author: James
tags: Linked List,Priority Queue,Merge Sort,Google
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給 k 個 sorted linked list，將它們 merge 成一個排序後的 linked list。

題目連結 🔗：[https://leetcode.com/problems/merge-k-sorted-lists/](https://leetcode.com/problems/merge-k-sorted-lists/)

### **問題分析**

這題考的是進階版的 merge sort，假設 lists 中有 i 條 linked list，思路其實非常單純，我們開一個空的 `ListNode* cur`，找到 i 個 node 中最小的，然後接上去，再來繼續比較剩下的 head 中最小的，一直接就可以了，所以這題的關鍵在於我們要如何有效率的從這 i 個 node 中找到最小的。

如果我們可以找到一個 Data Structure，在 push value 進去的時候都可以自動排序，這樣就不用每次都跑 loop 判斷最小的了，而最省空間的這種 Data Structure 就是 priority queue。

### **解題思路 - Priority Queue**

我們需要 MinHeap 版本的 Priority Queue，而且我們放的是 ListNode*，Priority Queue 沒辦法排這種自定義的 class，所以我們必須幫他寫一個 Compare Function，寫起來會長這樣：

```cpp
struct Compare {
    bool operator()(ListNode* a, ListNode* b) {
        return a->val > b->val;
    }
};

priority_queue<ListNode*, vector<ListNode*>, Compare> pq;
```

如果不是要考慮空間最優化的話，我們的 Data Structure 只要可以排序，然後又可以讓我們找到對應的指標就可以了，所以其實也可以考慮這種型態：

```cpp
priority_queue<pair<int, ListNode*>, vector<pair<int, ListNode*>>, greater<pair<int, ListNode*>>> pq;
```

再來應該就可以想像了，先把所有的 head 推進去 priority queue，一個一個 pop 出來找最小的接，在做 merge sort 的時候先開一個空的 `ListNode* cur`，讓他接到我們第一個 head 這樣會比較好做。

```cpp
ListNode* cur = new ListNode(0);
while(!pq.empty()){
    cur->next = pq.top();
    cur = cur->next;
    if(cur->next) pq.push(cur->next);
    pq.pop();
}
```

**Time Complexity** - `O(nlogk)`，n 是 node 數量，k 是 `vector<ListNode*>` 的 size，logk 是因為每 push 進去 priority queue 一次就需要排序一次<br>
**Space Complexity** - `O(k)`，priority queue 的 size

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