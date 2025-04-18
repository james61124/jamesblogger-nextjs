---
title: "[ Leetcode 212 ] Word Search II | 解題思路分享"
date: "2025-04-16"
author: James
tags: Array,String,Backtracking,Trie,Matrix
difficulty: Hard
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
---

給一個 2D Array `board` 跟一個字串陣列 `words`，找出所有在 `board` 出現過的 string。

題目連結 🔗：[https://leetcode.com/problems/word-search-ii/](https://leetcode.com/problems/word-search-ii/)

### **問題分析**

這題可以直接一步一步分析，首先如果要找到 board 中有沒有「一個 word」，直接對每一個 board[i][j] 做 dfs 就可以了，但是如果是要看 words[i] 有沒有在 board 中，在對 board[i][j] 做 dfs 的同時需要很快的可以判斷目前走過的 trajectory 是不是在 words[i] 中，最直覺的做法是 Hash Table，但 Hash Table 其實還不夠好，假設我判斷 "a" 不在 Hash Table 中，“ab” 不在 Hash Table 中，但我們無法判斷 "ab" 是不是其他字的 substring，因為 words[i] 中還是有可能有 "abcde"，所以如果用 Hash Table 就還是得一個一個檢查，因此這裡用 Trie 是最快的。

<figure>
  <img src="/images/leetcode/leetcode-208/trie.png" alt="Trie" />
  <figcaption style="font-size: 0.8em; text-align: center; color: gray; margin-top: 5px; margin-bottom: 10px;">
    Trie 架構圖
  </figcaption>
</figure>

Trie 又叫 Prefix Tree，架構圖大概長這樣，他是一個樹狀的 Data Structure，特別適合用來儲存 string 跟查找 string。所以對於每一個 node 來說，最多會有 26 個 children，而每一條 trajectory 就是一個字。

也就是說我們可以將 words[i] 存到 Trie 中，這樣我們可以解決 substring 的問題，例如說如果 "ab" 不在 Trie 中，那也就不用繼續檢查了，因為絕對不會有任何字 starts with "ab"。

### **解題思路 - Trie + DFS**

思路清晰後這題就不是特別難了，就是實作完了之後需要大量的優化。

首先先定義 TrieNode，最傳統的 TrieNode 其實是這樣定義的。

```cpp
struct TrieNode {
    TrieNode* children[26] = {nullptr};
    bool isEnd = false;
};
```

但想像一下這裡如果這樣定義，當 dfs 到結尾找到 isEnd 之後，我們需要把這條 Trie 的 trajectory push 進去一個 `result` 的 list 中，表示這個字有在 board 裡面，也就是說每一層的 dfs 我們都必須把目前的 word 加上 board[i][j]，一路傳到最後面，跳出 dfs 的時候要再 backtrack 把 board[i][j] 拔掉，c++ 中這種字串的操作很慢，所以比較好的做法是我們在最後一個 node 直接放上這條 trajectory 的 word，這樣就不用一路傳。

```cpp
struct TrieNode {
    TrieNode* children[26] = {nullptr};
    string word = "";
};
```

先看 Trie 的建立，把每一個 `word` 都塞到 Trie 裡面就好了。

```cpp
TrieNode* root = new TrieNode;
for(string word : words){
    TrieNode* node = root;
    for(char c : word){
        int index = c - 'a';
        if(!node->children[index]) node->children[index] = new TrieNode;
        node = node->children[index];
    }
    node->word = word;
}
```

我們會對每一個 board[i][j] 進行 dfs，把答案推到全域變數 `vector<string>result` 中。

```cpp
for(int i=0; i<board.size(); i++){
    for(int j=0; j<board[0].size(); j++){
        dfs(board, i, j, root);
    }
}
```

再來實作 dfs 的細節，對於每一層 dfs 來說，我們要找的是 node 底下的 children 有沒有 board[i][j]，如果有的話表示 board[i][j] 有在 Trie 中，才會繼續找，所以沒有的話就可以直接跳出來了。

```cpp
if(board[i][j] == '#' || !node->children[board[i][j] - 'a']) return;
node = node->children[board[i][j] - 'a'];
```

而對於每一個 node 來說，總會有四個方向的 neighbors，每一個都要看到，有些人會喜歡用一個 `vector<vector<int>>directions = {{0, 1}, ...}` 來紀錄四個方向，其實也可以，不過這題我覺得這樣寫比較簡潔。

```cpp
if (i > 0) dfs(board, i - 1, j, node);
if (j > 0) dfs(board, i, j - 1, node);
if (i < board.size() - 1) dfs(board, i + 1, j, node);
if (j < board[0].size() - 1) dfs(board, i, j + 1, node);
```

再來會遇到一個問題，如果 words[i] 有 "abcda"，但 board 長這樣：

```cpp
board = {
    {'a', 'b'},
    {'d', 'c'}
}
```

這樣是得 return false 的，意思就是說在同一層的 dfs 中，走過的 node 是不能再被走一次的，所以我們需要一個 visit 來紀錄誰被走過，我們也可以直接用 `vector<vector<bool>>visit` 來紀錄，但是在 Matrix 的這種題目有一個方法可以不用多開這個空間，就是我們直接把 visit 過的 node 換成 `#` 就可以了，而 dfs 結束再把他 backtrack 回來，這樣就不用多開一個 2D Array 的空間。

```cpp
char store = board[i][j];
board[i][j] = '#';

if (i > 0) dfs(board, i - 1, j, node);
if (j > 0) dfs(board, i, j - 1, node);
if (i < board.size() - 1) dfs(board, i + 1, j, node);
if (j < board[0].size() - 1) dfs(board, i, j + 1, node);

board[i][j] = store;
```

最後當 dfs 走到 Trie 的底時，我們要把 word 推進去 result 中，但是如果沒有做特殊處理，word 可能會被重複推進去，舉例來說：

```cpp
board = {
    {'o', 'a', 'o', 'a'}
}
words = ['oa']
```

這樣很明顯我們會找到兩個 `oa`，但我們只能推進去一個，所以我們只要把 TrieNode* 中的 word 設成空字串，就代表我們已經找過這個字了，非常高效，不用再開什麼 unordered_set 去除 duplicate 再轉回 vector。

```cpp
if(node->word != ""){
    result.push_back(node->word);
    node->word = "";
}
```

**Time Complexity** - `O(m * n * 4^L)`，這只是最壞的情況，`m*n` 是 board size，L 是所有 word 中最長的長度，因為 dfs 有四個方向所以是 `4^L`，不過這只是最壞情況，實際上因為 Trie 的關係會 prune 掉很多所以是很高效的<br>
**Space Complexity** - `O(W * L)`，最壞情況就是每一個字母對應一個 node

#### **Implementation**

```cpp
struct TrieNode {
    TrieNode* children[26] = {nullptr};
    string word = "";
};

vector<string>result;

void dfs(vector<vector<char>>& board, int i, int j, TrieNode* node){ 

    if(board[i][j] == '#' || !node->children[board[i][j] - 'a']) return;
    node = node->children[board[i][j] - 'a'];

    char store = board[i][j];
    board[i][j] = '#';
    if(node->word != ""){
        result.push_back(node->word);
        node->word = ""; // remove duplicate
    }

    if (i > 0) dfs(board, i - 1, j, node);
    if (j > 0) dfs(board, i, j - 1, node);
    if (i < board.size() - 1) dfs(board, i + 1, j, node);
    if (j < board[0].size() - 1) dfs(board, i, j + 1, node);

    board[i][j] = store;
}

vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    TrieNode* root = new TrieNode;
    for(string word : words){
        TrieNode* node = root;
        for(char c : word){
            int index = c - 'a';
            if(!node->children[index]) node->children[index] = new TrieNode;
            node = node->children[index];
        }
        node->word = word;
    }

    for(int i=0; i<board.size(); i++){
        for(int j=0; j<board[0].size(); j++){
            dfs(board, i, j, root);
        }
    }

    return result;
}
```
