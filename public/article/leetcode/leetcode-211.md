---
title: "[ Leetcode 211 ] Design Add and Search Words Data Structure | 解題思路分享"
date: "2025-04-16"
author: James
tags: String,DFS,Trie,Design
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

實作一個 WordDictionary 的 class，要可以支援 insert string 進去，也要可以 search，不過 search 的 `word` 中可能會含有 `.`，代表該位置可以放入任意字母。 

題目連結 🔗：[https://leetcode.com/problems/design-add-and-search-words-data-structure/](https://leetcode.com/problems/design-add-and-search-words-data-structure/)

### **問題分析 - Trie 介紹**

<figure>
  <img src="/images/leetcode/leetcode-208/trie.png" alt="Trie" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    Trie 架構圖
  </figcaption>
</figure>

Trie 又叫 Prefix Tree，架構圖大概長這樣，他是一個樹狀的 Data Structure，特別適合用來儲存 string 跟查找 string。所以對於每一個 node 來說，最多會有 26 個 children，而每一條 trajectory 就是一個字。

而這題其實就是 Leetcode-208 的翻版，底下附上連結供參考，唯一不一樣的是 search 的部分會出現 `.`，而每一層只要遇到 `.`，代表這個位置放什麼字母都可以，所以就要利用 dfs 看過每一個字母。

[[ Leetcode 208 ] Implement Trie (Prefix Tree) | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-208/)

### **解題思路**

所以對於每一個 node 來說，我們需要一個 size 為 26 的 vector 儲存所有可能的 children，當這個 node 有對應的 child 時就接一個 WordDictNode* 上去，然後我們需要一個 `isEnd` 來判斷這個是不是結尾的 node，因為如果今天我們 insert `apple`，search `app` 的時候必須 return false，所以需要判斷這個 node 是不是最後一個。

```cpp
struct WordDictNode {
    vector<WordDictNode*>children = vector<WordDictNode*>(26, nullptr);
    bool isEnd = false;
};
```

有這個框架之後後面的實作都不會很難了，addWord 就是按照順序把 string 中每一個 char 都放到 tree 裡，所以如果 children 裡對應的 node 是 nullptr，表示這個 node 還沒有被塞過這個 child，就直接宣告一個 WordDictNode* 給他就可以了，然後繼續往下接，直到最後一個 node 要把 `isEnd` 設為 true。

```cpp
void addWord(string word) {
    WordDictNode* node = root;
    for(char c : word){
        int index = c - 'a';
        if(!node->children[index]) node->children[index] = new WordDictNode;
        node = node->children[index];
    }
    node->isEnd = true;
}
```

search 的部分就跟前面分析的一樣，只要遇到 `.`，就要看過每一個字母，如果遇到一般字母的話，就按照正常流程繼續往下走。

```cpp
bool dfs(WordDictNode* node, string& word, int i){
    if(i == word.size()) return node->isEnd;

    bool result = false;
    if(word[i] == '.'){
        for(WordDictNode* v : node->children){
            if(v && dfs(v, word, i+1)) return true;
        }
    } else {
        int index = word[i] - 'a';
        if(!node->children[index]) return false;
        result |= dfs(node->children[index], word, i+1);
    }

    return result;
}

bool search(string word) {
    return dfs(root, word, 0);
}
```

#### **Implementation**

```cpp
class WordDictionary {
private:
    struct WordDictNode {
        vector<WordDictNode*>children = vector<WordDictNode*>(26, nullptr);
        bool isEnd = false;
    };
    WordDictNode* root;

public:
    WordDictionary() {
        root = new WordDictNode;
    }
    
    void addWord(string word) {
        WordDictNode* node = root;
        for(char c : word){
            int index = c - 'a';
            if(!node->children[index]) node->children[index] = new WordDictNode;
            node = node->children[index];
        }
        node->isEnd = true;
    }

    bool dfs(WordDictNode* node, string& word, int i){
        if(i == word.size()) return node->isEnd;

        bool result = false;
        if(word[i] == '.'){
            for(WordDictNode* v : node->children){
                if(v && dfs(v, word, i+1)) return true;
            }
        } else {
            int index = word[i] - 'a';
            if(!node->children[index]) return false;
            result |= dfs(node->children[index], word, i+1);
        }

        return result;
    }
    
    bool search(string word) {
        return dfs(root, word, 0);
    }
};
```
