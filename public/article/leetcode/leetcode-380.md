---
title: "[ Leetcode 380 ] Insert Delete GetRandom O(1) | 解題思路分享"
date: "2025-08-31"
author: James
tags: Array,Hash Table,Top Interview
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 2
---

實作一個 class，裡面有三個 function，`insert(val)` 要可以插入 `val`，但裡面如果已經有 `val` 就不要再插入了，`remove(val)` 要可以移除 `val`，但如果裡面本來就沒有 `val` 也不要動作，最後要 `getRandom()` 要隨機取一個值，其中三個 function 都要在 O(1) 時間內完成。

題目連結 🔗：[https://leetcode.com/problems/insert-delete-getrandom-o1/](https://leetcode.com/problems/insert-delete-getrandom-o1/)

### **問題分析**

這題最大的問題是所有 function 都要在 O(1) 之內完成，先用最直覺的思路想，insert / remove 如果想要在 O(1) 的時間完成可以直接開 unordered_set，但是取 random 就沒有辦法，因為 C++ 取 random 的方式是 `rand()`，也就是說我們可以利用 `rand() % size` 來拿到一個 index 去取裡面的值。

所以問題就來了，要怎麼確保三個 function 都可以 O(1) 呢？

### **解題思路**

因為取 random 的方式比較侷限，如果利用 `rand()` 可以拿到一個隨機的 index，代表所有數字可能都必須要存在 vector 中，如果想要快速 insert，我們必須在 O(1) 時間內判斷 `val` 是不是已經在 vector 裡了，那我們可以額外開一個 Hash Table 儲存 {value, index} 的對應關係，這樣 insert 就可以確保在 O(1) 完成。

這樣還不夠，如果直接從 vector 中 remove element，這樣是 O(n)，我們必須想其他方法。而 vector 中操作 remove 而且是 O(1) 的 function 是 `pop_back()`，也就是說我們只要將需要 remove 的 value 丟到最後面，再把它 pop 掉就好，這樣就都滿足了，這題實作不難就不細講了。

**Time Complexity** - `O(1)`<br>
**Space Complexity** - `O(n)`

### **Implementation**

```cpp
class RandomizedSet {
private:
    unordered_map<int, int>umap;
    vector<int>v;
public:
    RandomizedSet() {
        
    }
    
    bool insert(int val) {
        if(!umap.count(val)) {
            v.push_back(val);
            umap[val] = v.size() - 1;
            return true;
        }
        return false;
    }
    
    bool remove(int val) {
        if(umap.count(val)) {
            int index = umap[val];
            int lastVal = v[v.size() - 1];
            v[index] = lastVal;
            v.pop_back();
            umap[lastVal] = index;
            umap.erase(val);
            return true;
        }
        return false;
    }
    
    int getRandom() {
        return v[rand() % v.size()];
    }
};
```