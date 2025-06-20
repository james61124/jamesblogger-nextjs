---
title: "[ Leetcode 138 ] Copy List with Random Pointer | 解題思路分享"
date: "2025-06-18"
author: James
tags: Linked List, Interleaved List
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

給一個特殊的 linked list，裡面有兩個 pointer，`next` 指向下一個，`random` 可能會指向任一個 pointer，包括自己或是 `nullptr`，請回傳一個 deep copy 的 linked list。

題目連結 🔗：[https://leetcode.com/problems/copy-list-with-random-pointer/](https://leetcode.com/problems/copy-list-with-random-pointer/)

### **問題分析**

這題最直覺的解法應該是 hash table，因為要快速找到 random 指向的具體 node 在第幾個，就是直接建立 hash map 就可以了，但是這樣就需要多開 O(n) 的空間，實際上這題可以用 O(1) 就解，但需要用到 Interleaving Node Insertion 的技巧

### **解題思路 - Interleaving Node Insertion**

簡單來說，我們需要快速定位 random 後的 pointer 在哪，但不一定要建立 hash map，可以選擇把 linked list 變成這種型態

```
A -> A' -> B -> B' -> C -> C'
```

只要把新的 node 接在原本的 node 後面就可以了，這樣 node->random 就會變得很好定位，最後都更新完畢再把新的 linked list 拆出來並復原原本的 linked list，簡單來寫一下解題步驟

> 1. iterate 一次 linked list，建立新的 node 接在每一個 node 後面<br>
> 2. 看原本的 node->random 在哪，更新新的 node->random，為什麼他不能跟前面的步驟合併呢？因為有可能新的 node 還沒有被建出來<br>
> 3. 把新的 list 拆出來，並復原原本的 list

一步一步來看，首先建立新的 node 接在每一個 node 後面，這應該還好，就是一般的 insertion

```cpp
Node* curr = head;
while(curr){
    Node* node = new Node(curr->val);
    node->next = curr->next;
    curr->next = node;
    curr = node->next;
}
```

再來更新 random 的指標

```cpp
Node* prev = head;
curr = head->next;
while(prev){
    Node* prevRandom = prev->random;
    if(prevRandom) curr->random = prevRandom->next;
    prev = prev->next->next;
    if(prev) curr = prev->next;
}
```

比較簡易的寫法應該是這樣，讓 `prev` 在舊的 node，`curr` 落在新的 node，直接更新 curr->random 在 prev->random 的下一個就行了，不過我們會發現從頭到尾 curr 都落在 prev 的後面，所以其實我們不用分兩個 pointer 寫，合起來成一個就好

```cpp
curr = head;
while(curr){
    if(curr->random) curr->next->random = curr->random->next;
    curr = curr->next->next;
}
```

最後一步是要把新的 list 拆出來，而且要復原原本的 list

```cpp
curr = head;
head = head->next;
while(curr){
    Node* nextCurr = curr->next->next;
    if(nextCurr) curr->next->next = nextCurr->next;
    curr->next = nextCurr;     
    curr = curr->next;
}
```

推一下應該都推得出來，注意一下最後走到 `nullptr` 的情況就好，不要讓 `nullptr` 去呼叫 next

這個解法如果 trace 一下，整條 list 只有一個 node 也可以完美解，但是如果連 `head` 都是 `nullptr` 就沒辦法了，需要特別處理

```cpp
if(!head) return nullptr;
```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### **Implementation**

```cpp
Node* copyRandomList(Node* head) {
        if(!head) return nullptr;

        Node* curr = head;
        while(curr){
            Node* node = new Node(curr->val);
            node->next = curr->next;
            curr->next = node;
            curr = node->next;
        }

        curr = head;
        while(curr){
            if(curr->random) curr->next->random = curr->random->next;
            curr = curr->next->next;
        }

        curr = head;
        head = head->next;
        while(curr){
            Node* nextCurr = curr->next->next;
            if(nextCurr) curr->next->next = nextCurr->next;
            curr->next = nextCurr;     
            curr = curr->next;
        }

        return head;

    }
```
