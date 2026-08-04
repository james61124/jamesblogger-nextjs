---
title: "[ Leetcode 208 ] Implement Trie (Prefix Tree) | 解題思路分享"
date: "2025-04-15"
author: James
tags: Hash Table,Trie,String,Design
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: c5a92c0a-9eb8-4043-a7d4-c1d637ec4c22
---

實作出 Trie 的 insert, search, startsWith

題目連結 🔗：[https://leetcode.com/problems/implement-trie-prefix-tree/](https://leetcode.com/problems/implement-trie-prefix-tree/)

## 問題分析 - Trie 介紹

<figure>
  <img src="/images/leetcode/leetcode-208/trie.png" alt="Trie" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    Trie 架構圖
  </figcaption>
</figure>

Trie 又叫 Prefix Tree，架構圖大概長這樣，他是一個樹狀的 Data Structure，特別適合用來儲存 string 跟查找 string。所以對於每一個 node 來說，最多會有 26 個 children，而每一條 trajectory 就是一個字。

## 解題思路

所以對於每一個 node 來說，我們需要一個 size 為 26 的 vector 儲存所有可能的 children，當這個 node 有對應的 child 時就接一個 TrieNode* 上去，然後我們需要一個 `isEnd` 來判斷這個是不是結尾的 node，因為如果今天我們 insert `apple`，search `app` 的時候必須 return false，所以需要判斷這個 node 是不是最後一個。

```cpp
struct TrieNode {
    vector<TrieNode*> children = vector<TrieNode*>(26, nullptr);
    bool isEnd = false;
};
```

有這個框架之後後面的實作都不會很難了，insert 就是按照順序把 string 中每一個 char 都放到 tree 裡，所以如果 children 裡對應的 node 是 nullptr，表示這個 node 還沒有被塞過這個 child，就直接宣告一個 TrieNode* 給他就可以了，然後繼續往下接，直到最後一個 node 要把 `isEnd` 設為 true。

```cpp
void insert(string word) {
    TrieNode* node = root;
    for(char c : word){
        int index = c - 'a';
        if(!node->children[index]){
            node->children[index] = new TrieNode();
        }
        node = node->children[index];
    }
    node->isEnd = true;
}
```

search 跟 startsWith 基本上意思是一樣的，一路找如果發現 child 變成 nullptr 表示這個字還沒有被 insert 過，當然 search 要再多判斷最後一個 node 的 isEnd 是不是 true。

```cpp
bool search(string word) {
    TrieNode* node = root;
    for(char c : word){
        int index = c - 'a';
        if(!node->children[index]) return false;
        node = node->children[index];
    }
    return node->isEnd;
}

bool startsWith(string prefix) {
    TrieNode* node = root;
    for(char c : prefix){
        int index = c - 'a';
        if(!node->children[index]) return false;
        node = node->children[index];
    }
    return true;
}
```

### Implementation

```cpp
class Trie {
private:
    struct TrieNode {
        vector<TrieNode*> children = vector<TrieNode*>(26, nullptr);
        bool isEnd = false;
    };
    TrieNode* root;
public:
    Trie(){
        root = new TrieNode;
    }
    
    void insert(string word) {
        TrieNode* node = root;
        for(char c : word){
            int index = c - 'a';
            if(!node->children[index]){
                node->children[index] = new TrieNode();
            }
            node = node->children[index];
        }
        node->isEnd = true;
    }
    
    bool search(string word) {
        TrieNode* node = root;
        for(char c : word){
            int index = c - 'a';
            if(!node->children[index]) return false;
            node = node->children[index];
        }
        return node->isEnd;
    }
    
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for(char c : prefix){
            int index = c - 'a';
            if(!node->children[index]) return false;
            node = node->children[index];
        }
        return true;
    }
};
```
