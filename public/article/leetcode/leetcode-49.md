---
title: "[ Leetcode 49 ] Group Anagrams | 解題思路分享"
date: "2025-03-30"
author: James
tags: Array,Hash Table,String,Sorting,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 4
readTime: 2
id: c8da36fd-08ac-4b31-ae3e-e85a2946634b
---

給一個 string vector `strs`，將其中的 Anagrams 分組，Anagrams 是指由相同字母組成但順序不同的 string，例如 "eat", "tea", "ate" 都是 Anagrams。

題目連結 🔗：[https://leetcode.com/problems/group-anagrams/](https://leetcode.com/problems/group-anagrams/)

## 問題分析

這題的關鍵是要把同樣組成的 string 分類，所以我們必須找到一個很效率的方法來判斷哪些 string 是屬於同一個類別的，如果用 string 的 ASCII 總和顯然不太實際，會有很多情況是不同組合但是 ASCII 總和一樣，所以我們可以把 string sorting 過，這樣同樣的組成就會都長一樣了。

再來要判斷不同分類的 string 要放在 `vector<vector<string>>result` 的哪裡，用 Hash Map 來做 searching 是最快的。

## 解題思路 - Hash Table

我們直接把 sorting 過的 string 當作是 unordered_map 的 key，這個分類在 `vector<vector<string>>result` 的 index 當作 value，如果已經出現過這個分類了就直接塞進去他的 index，如果還沒的話就在 unordered_map 裡面建表，然後一樣推進去 result 裡就可以了。

**Time Complexity** - `O(NKlogK)`，N 是 string 數量，K 是 string 最長的長度<br>
**Space Complexity** - `O(N)`

## Implementation

```cpp
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    vector<vector<string>>result;
    unordered_map<string, int>umap;

    for(string str : strs){
        string tmp = str;
        sort(tmp.begin(), tmp.end());
        if(!umap.count(tmp)) {
            umap[tmp] = result.size();
            result.push_back({str});
        } else result[umap[tmp]].push_back(str);
    }
    return result;
}
```