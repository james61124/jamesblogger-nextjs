---
title: "[ Leetcode 146 ] LRU Cache | 解題思路分享"
date: "2025-06-23"
author: James
tags: Hash Table,Linked List,Double Linked List
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

實作一個 LRU Cache，支援兩種 function：

> `get(int key)` - 如果 key 存在於 cache 中，回傳其 value，並將該項設為最近使用，否則回傳 -1。<br>
> `put(int key, int value)` - 將 key-value 插入 cache 中，若 key 已存在，更新其 value 並視為最近使用，若插入後超出容量（capacity），就移除最久未使用的那一個項目。

題目連結 🔗：[https://leetcode.com/problems/lru-cache/](https://leetcode.com/problems/lru-cache/)

### **問題分析**

不論是 `get` 還是 `put`，看起來只要能快速找到或更新 key-value 就可以了，這部分是 Hash Table 可以做到的事，關鍵在於如果超出 capacity，要可以「刪除近期最沒有被用到的 key」，也就是說我們要可以快速定位 least recently used key，當 key 被使用，可以更新狀態也好，或是更新位置

因此這個時候我們需要一個可以雙向操作的 data structure，當一個 key 被使用，就將它搬到最前面，最後面留下來的就是最少用到的 key，那也因此我們要可以快速定位 key 在甚麼位置，這樣才可以進行搬運，而 Hash Table + Double Linked List 可以完美解決這件事，Hash Table 儲存 key 跟 Double Linked List 的 iterator，這樣從 Hash Table 可以快速定位 key 在哪裡，然後利用 Double Linked List 可以從頭或是尾巴進行操作。 

### **解題思路 - Hash Table + Double Linked List**

Double Linked List 可以自己寫，不過 c++ 有內建 Double Linked List 的 STL - list 可以直接用，我們直接用 list 寫，首先我們需要一個 double linked list 跟 hash table

```cpp
list<pair<int, int>>lruList;
unordered_map<int, list<pair<int, int>>::iterator>umap;
```

為什麼 double linked list 裡面需要存 `pair<int, int>` 呢？這是因為我們除了 `get` 的時候會需要從 hash map 裡找到對應的 value，當超過 capacity 需要把 least recently used key 從 hash map 移除時，會先在 double linked list 裡找最尾巴的那個 key，再來再到 hash map 刪除，所以 double linked list 裡面除了要存 value 也要存 key。

`get` 就是如果 cache 裡面有 key 了，回傳 key 的 value，同時因為操作過了這個 key，就要把 key 丟到 double linked list 的頭，代表這是最近期被操作的 key，所以我們會先找到 double linked list 裡 key 的位置，erase 掉之後再重新插到 front，最後更新 unordered_map。

```cpp
int get(int key) {
    int value = umap[key]->second;
    lruList.erase(umap[key]);
    lruList.push_front({key, value});
    umap[key] = lruList.begin();
    return value;
}
```

以上是 key 存在的情況，如果 key 不存在，就要回傳 -1。

```cpp
int get(int key) {
    if(umap.find(key) == umap.end()) return -1; // key 不存在
    int value = umap[key]->second;
    lruList.erase(umap[key]);
    lruList.push_front({key, value});
    umap[key] = lruList.begin();
    return value;
}
```

`put` 分成幾種情況，如果 key 存在，就要更新 value 同時更新 `lruList`，所以事實上就是要 erase 原本在 `lruList` 的 key-value，重新推一個到前面，然後用 hash table 記起來。

```cpp
void put(int key, int value) {  
    if (umap.find(key) != umap.end()) {
        lruList.erase(umap[key]);
        lruList.push_front({key, value});
        umap[key] = lruList.begin();
    }
}
```

那如果這個 key 不存在，就不用 erase 原本在 `lruList` 的 key-value，但還是必須推一個 key-value 到 lruList，所以其實可以這樣寫

```cpp
void put(int key, int value) {  
    if (umap.find(key) != umap.end()) {
        lruList.erase(umap[key]);
    }
    lruList.push_front({key, value});
    umap[key] = lruList.begin();
}
```

最後如果超過 capacity，要把 least recently used key 拔掉，hash table 裡面也要 erase。

```cpp
void put(int key, int value) {  
    if (umap.find(key) != umap.end()) {
        lruList.erase(umap[key]);
    } else if(lruList.size() == capacity) {
        int oldKey = lruList.back().first;
        lruList.pop_back();
        umap.erase(oldKey);
    }
    lruList.push_front({key, value});
    umap[key] = lruList.begin();
}
```

以上是利用 c++ 內建 STL `list` 的寫法，當然如果不曉得這個 STL，實作一個 double linked list 也不會很複雜，主要可以注意一個小技巧，如果再 double linked list 的前後建一個 dummy head 跟 dummy tail，這樣就不用處理 pointer 跑到 nullptr 的問題，實作起來會比較簡單。

```cpp
struct Node {
    int key;
    int value;
    Node* prev;
    Node* next;
    Node(int k, int v) : key(k), value(v), prev(nullptr), next(nullptr) {}
};

class LRUCache {
private:
    Node* head;
    Node* tail;
    unordered_map<int, Node*>umap;
    int capacity;
    int size;
public:
    LRUCache(int capacity) {
        this->capacity = capacity;
        this->size = 0;
        this->head = new Node(0, 0);
        this->tail = new Node(0, 0);
        this->head->next = this->tail;
        this->tail->prev = this->head;
    }

    void erase(Node* node) {
        Node* prev = node->prev;
        Node* next = node->next;
        prev->next = next;
        next->prev = prev;
        this->size--;
    }

    Node* push_front(int key, int value) {
        Node* node = new Node(key, value);
        Node* next = head->next;
        head->next = node;
        node->prev = head;
        node->next = next;
        next->prev = node;
        this->size++;
        return node;
    }

    void pop_back() {
        erase(tail->prev);
    }
    
    int get(int key) {
        if(umap.find(key) == umap.end()) return -1;
        int value = umap[key]->value;
        erase(umap[key]);
        umap[key] = push_front(key, value);
        return value;
    }
    
    void put(int key, int value) {  
        if(umap.find(key) != umap.end()) {
            erase(umap[key]);
        } else if (size == capacity) {
            int oldKey = tail->prev->key;
            pop_back();
            umap.erase(oldKey);
        }
        umap[key] = push_front(key, value);
    }
};

```

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

### **Implementation**
```cpp
class LRUCache {
private:
    list<pair<int, int>>lruList;
    unordered_map<int, list<pair<int, int>>::iterator>umap;
    int capacity;
public:
    LRUCache(int capacity) {
        this->capacity = capacity;
    }
    
    int get(int key) {
        if(umap.find(key) == umap.end()) return -1;
        int value = umap[key]->second;
        lruList.erase(umap[key]);
        lruList.push_front({key, value});
        umap[key] = lruList.begin();
        return value;
    }
    
    void put(int key, int value) {  
        if (umap.find(key) != umap.end()) {
            lruList.erase(umap[key]);
        } else if (lruList.size() == capacity) {
            int oldKey = lruList.back().first;
            lruList.pop_back();
            umap.erase(oldKey);
        }
        lruList.push_front({key, value});
        umap[key] = lruList.begin();
    }
};
```