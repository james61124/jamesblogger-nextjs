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

| **Function** | **Description** | **Time Complexity** |
|-------------|----------------|---------------------|
| `unordered_set<int> uset;` | 宣告 unordered_set | - |
| `uset.insert(value);` | 插入元素 | O(1) |
| `uset.find(value);` | 確認 value 是否存在，回傳 iterator 或 `uset.end()` | O(1) |
| `uset.count(value);` | 計算某值的數量（0 或 1） | O(1) |
| `uset.erase(value);` | 刪除特定元素 | O(1) |
| `uset.empty();` | 檢查 set 是否為空 | O(1) |
| `uset.clear();` | 清空所有元素 | O(n) |
| `uset.size();` | 返回元素數量 | O(1) |
| `for(auto& x : uset)` | 遍歷 unordered_set | O(n) |

常常用在一些像是檢查元素是否存在、去除 duplicate 等等的地方。

### **unordered_map**

unordered_map 是一個 key-value 的結構，有點像 dictionary 的感覺。

unordered_map 有幾個特色：

1. Key 不允許重複，如果插入相同的 Key，會覆蓋舊的 Value
2. insert / search / erase 操作的 time complexity 為 O(1)，因為 insert 的時候不用排序

常用 function :

| **Function** | **Description** | **Time Complexity** |
|-------------|----------------|---------------------|
| `unordered_map<int, int> umap;` | 宣告 unordered_map | - |
| `umap[key] = value;` | 插入或更新 Key 對應的 Value | O(1) |
| `umap.insert({key, value});` | 插入 Key-Value pair | O(1) |
| `umap.find(key);` | 查找 Key，回傳 Iterator 或 `umap.end()` | O(1) |
| `umap.count(key);` | 判斷 Key 是否存在（0 或 1） | O(1) |
| `umap.erase(key);` | 刪除指定 Key | O(1) |
| `umap.empty();` | 判斷是否為空 | O(1) |
| `umap.clear();` | 清空 Map | O(n) |
| `umap.size();` | 返回元素數量 | O(1) |
| `for (auto& [k, v] : umap)` | 遍歷 Map | O(n) |

常常用在一些像是統計元素出現次數、建立 key-value 關係、快速查詢/更新 key 等等地方。

### **unordered_multiset**

跟 set 幾乎一樣，唯一不一樣就是他可以允許 duplicate。

常用 function :

| **Function** | **Description** | **Time Complexity** |
|-------------|----------------|---------------------|
| `unordered_multiset<int> umset;` | 宣告 unordered_multiset | - |
| `umset.insert(value);` | 插入元素（可重複） | O(1) |
| `umset.count(value);` | 計算某個值的出現次數 | O(n) |
| `umset.find(value);` | 返回第一個匹配的 Iterator | O(1) |
| `umset.equal_range(value);` | 返回所有匹配的範圍 | O(n) |
| `umset.erase(value);` | 刪除所有匹配的元素 | O(n) |

### **unordered_multimap**

當一個 key 需要對應多個 value 的時候就可以用這個，換句話說他的 key 不是唯一。

常用 function :

| **Function** | **Description** | **Time Complexity** |
|-------------|----------------|---------------------|
| `unordered_multimap<Key, Value> ummap;` | 宣告 unordered_multimap | - |
| `ummap.insert({key, value});` | 插入 Key-Value pair（允許多個相同 Key） | O(1) |
| `ummap.find(key);` | 返回第一個匹配 Key 的 Iterator | O(1) |
| `ummap.count(key);` | 回傳 Key 出現次數 | O(n) |
| `ummap.equal_range(key);` | 返回所有匹配 Key 的範圍 | O(n) |
| `ummap.erase(key);` | 刪除所有匹配 Key 的元素 | O(n) |




##### **範例**

[[ Leetcode 20 ] Valid Parentheses | 解題思路分享](https://jamesblogger.com/zh/program/leetcode-20/)

[[ Leetcode 227 ] Basic Calculator II | 解題思路分享](https://jamesblogger.com/zh/program/leetcode-227/)