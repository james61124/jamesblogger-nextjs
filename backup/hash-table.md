---
title: "Hash Table | 解題思路分享"
date: 2025-03-10
draft: false
author: "James"
tags:
  - Hash Table
  - Leetcode
image: /images/program/Leetcode.jpeg
description: ""
toc: 
categories:
  - Algorithm
---

Hash Table 是一種基於 key-value pair 的 data structure，主要目的就是要讓 search, delete, insert 這些操作都是 O(1)。常見的 C++ Hash Table 包括下面幾種：

### **unordered_set**

unordered_set 有兩個特色：

1. 不允許重複的 element，如果 insert 相同的 value，會覆蓋舊的 value
2. insert 的時候不用排序，所以 insert 是 O(1)

常用 function :

- **unordered_set**<**int**>**uset;** - 宣告
- **uset.insert(value);** - 在 unordered_set 中插入元素, O(1)
- **uset.find(value);**	- 確認 value 是不是在 unordered_set 中，沒有的話會 return uset.end(), O(1)
- **uset.count(value)**	- 計算 value 的數量，只會 return 0 或 1，因為 unordered_set 不允許重複的 element, O(1)
- **uset.erase(value);** - 刪除特定元素, O(1)
- **uset.empty();** - 檢查 unordered_set 是否為 empty (回傳 true/false), O(1)
- **uset.clear();**, O(n)
- **uset.size()**, O(1)
- **for(auto& x : uset)** - iterate 整個 unordered_set, O(n)

常常用在一些像是檢查元素是否存在、去除 duplicate 等等的地方。

### **unordered_map**

unordered_map 是一個 key-value 的結構，有點像 dictionary 的感覺。

unordered_map 有幾個特色：

1. Key 不允許重複，如果插入相同的 Key，會覆蓋舊的 Value
2. insert / search / erase 操作的 time complexity 為 O(1)，因為 insert 的時候不用排序

常用 function :

- **unordered_map<**int, int**> umap;** - 宣告
- **umap[key] = value;** - 插入或更新 Key 對應的 Value
- **umap.insert({key, value});** - 插入 Key-Value pair
- **umap.find(key);** - return Iterator，若找不到則 return umap.end()
- **umap.count(key);** - 判斷 Key 是否存在（回傳 0 或 1）
- **umap.erase(key);** - 刪除指定 Key
- **umap.empty();** - 判斷是否為空
- **umap.clear();** - 清空 Map
- **umap.size();** - 回傳元素數量
- **for (auto& [k, v] : umap)** - iterate Map

常常用在一些像是統計元素出現次數、建立 key-value 關係、快速查詢/更新 key 等等地方。

### **unordered_multiset**

跟 set 幾乎一樣，唯一不一樣就是他可以允許 duplicate。

常用 function :

- **unordered_multiset<**int**> umset;** - 宣告
- **umset.insert(value);** - 插入元素（可重複）
- **umset.count(value);** - 計算某個值的出現次數
- **umset.find(value);** - 返回第一個匹配的 Iterator
- **umset.equal_range(value);** - 返回一個範圍，表示所有匹配的元素
- **umset.erase(value);** - 刪除所有匹配的元素

### **unordered_multimap**

當一個 key 需要對應多個 value 的時候就可以用這個，換句話說他的 key 不是唯一。

常用 function :

- **unordered_multimap<**Key, Value**> ummap;** - 宣告
- **ummap.insert({key, value});** - 插入 Key-Value pair（允許多個相同 Key）
- **ummap.find(key);** - 返回第一個匹配 Key 的 Iterator
- **ummap.count(key);** - 回傳 Key 出現次數
- **ummap.equal_range(key);** - 返回一個範圍 (pair<iterator, iterator>)，表示所有匹配 Key 的範圍
- **ummap.erase(key);** - 刪除所有匹配 Key 的元素




##### **範例**

[[ Leetcode 20 ] Valid Parentheses | 解題思路分享](https://jamesblogger.com/zh/program/leetcode-20/)

[[ Leetcode 227 ] Basic Calculator II | 解題思路分享](https://jamesblogger.com/zh/program/leetcode-227/)