---
title: "[ Data Structure ] Hash Table | 核心概念與 Leetcode 題型解析"
date: "2025-03-30"
author: James
tags: Data Structure,Hash Table,Unordered Set,Unordered Map,Unordered Multiset,Unordered Multimap
image: /images/program/data-structure.jpeg
description: "Hash Table 是一種基於 key-value pair 的 data structure，主要目的就是要讓 search, delete, insert 這些操作都是 O(1)，他利用一個 Hash Function 將 Key 映射到一個 index，然後再把 value 填進來，所以才可以用極短的時間就做到 searching 的動作。常見的 C++ Hash Table 包括下面幾種："
readTime: 2
---

Hash Table 是一種基於 key-value pair 的 data structure，主要目的就是要讓 search, delete, insert 這些操作都是 O(1)，他利用一個 Hash Function 將 Key 映射到一個 index，然後再把 value 填進來，所以才可以用極短的時間就做到 searching 的動作。常見的 C++ Hash Table 包括下面幾種：

### **Unordered Set**

Unordered Set 有兩個特色：

1. 不允許重複的 element，如果 insert 相同的 value，會覆蓋舊的 value
2. insert 的時候不用排序，所以 insert 是 O(1)

#### **宣告**

`unordered_set<int> uset;`

#### **常用 function**

| Function | Description | Time Complexity |
|-------------|----------------|---------------------|
| uset.insert(value); | 插入元素 | O(1) |
| uset.find(value); | 確認 value 是否存在，回傳 iterator 或 `uset.end()` | O(1) |
| uset.count(value); | 計算某值的數量（0 或 1） | O(1) |
| uset.erase(value); | 刪除特定元素 | O(1) |
| uset.empty(); | 檢查 set 是否為空 | O(1) |
| uset.clear(); | 清空所有元素 | O(n) |
| uset.size(); | 返回元素數量 | O(1) |
| for(auto& x : uset) | iterate unordered_set | O(n) |

常常用在一些像是檢查元素是否存在、去除 duplicate 等等的地方。

Unordered Set 之所有也算是 Hash Table，是因為他的 key-value pair 隱藏了 value 只留下 key，他的 value 只用來標示這個 element 存不存在而已。

### **Unordered Map**

Unordered Map 是一個 key-value 的結構，有點像 dictionary 的感覺。

Unordered Map 有幾個特色：

1. Key 不允許重複，如果插入相同的 Key，會覆蓋舊的 Value
2. insert / search / erase 操作的 time complexity 為 O(1)，因為 insert 的時候不用排序

#### **宣告**

`unordered_map<int, int> umap;`

#### **常用 function**

| Function | Description | Time Complexity |
|-------------|----------------|---------------------|
| umap[key] = value; | 插入或更新 Key 對應的 Value | O(1) |
| umap.insert({key, value}); | 插入 Key-Value pair | O(1) |
| umap.find(key); | 查找 Key，回傳 Iterator 或 `umap.end()` | O(1) |
| umap.count(key); | 判斷 Key 是否存在（0 或 1） | O(1) |
| umap.erase(key); | 刪除指定 Key | O(1) |
| umap.empty(); | 判斷是否為空 | O(1) |
| umap.clear(); | 清空 Map | O(n) |
| umap.size(); | 返回元素數量 | O(1) |
| for (auto& [k, v] : umap) | iterate Map | O(n) |

常常用在一些像是統計元素出現次數、建立 key-value 關係、快速查詢/更新 key 等等地方。

這邊可以注意一件事情，如果 key 原本不在 unordered_map 中，但是只要寫到 umap[key]，就算是在 if 的 condition 中沒有賦值給他他也會自動把 key 放到 umap 中並初始化為 ０，所以如果要查詢一個 key 是不是在 unordered_map 中盡量用 count 或是 find，不要直接 umap[key] == 0。

### **Unordered Multiset**

跟 set 幾乎一樣，唯一不一樣就是他可以允許 duplicate。

#### **宣告**

`unordered_multiset<int> umset;`

#### **常用 function**

| Function | Description | Time Complexity |
|-------------|----------------|---------------------|
| umset.insert(value); | 插入元素（可重複） | O(1) |
| umset.count(value); | 計算某個值的出現次數 | O(n) |
| umset.find(value); | 返回第一個匹配的 Iterator | O(1) |
| umset.equal_range(value); | 返回所有匹配的範圍 | O(n) |
| umset.erase(value); | 刪除所有匹配的元素 | O(n) |

因為他允許 duplicate 的關係，所以我們可以用 `equal_range` 找到所有 value，然後 iterate 所有的值，像這樣：

```cpp
pair<unordered_multiset<int>::iterator, unordered_multiset<int>::iterator> range = umset.equal_range(10);
for (unordered_multiset<int>::iterator it = range.first; it != range.second; ++it) {
    cout << *it << " ";
}
```

### **Unordered Multimap**

當一個 key 需要對應多個 value 的時候就可以用這個，換句話說他的 key 不是唯一。

#### **宣告**

`unordered_multimap<Key, Value> ummap;`

#### **常用 function**

| **Function** | **Description** | **Time Complexity** |
|-------------|----------------|---------------------|
| ummap.insert({key, value}); | 插入 Key-Value pair（允許多個相同 Key） | O(1) |
| ummap.find(key); | 返回第一個匹配 Key 的 Iterator | O(1) |
| ummap.count(key); | 回傳 Key 出現次數 | O(n) |
| ummap.equal_range(key); | 返回所有匹配 Key 的範圍 | O(n) |
| ummap.erase(key); | 刪除所有匹配 Key 的元素 | O(n) |

因為一個 key 可以對應到多個 value，所以我們一樣可以用 equal_range 找到所有 value，最後 iterate 所有的值，像這樣：

```cpp
pair<unordered_multimap<int, string>::iterator, unordered_multimap<int, string>::iterator> range = ummap.equal_range(1);
for (unordered_multimap<int, string>::iterator it = range.first; it != range.second; ++it) {
    cout << it->first << " => " << it->second << endl;
}
```

### **範例**

[[ Leetcode 20 ] Valid Parentheses | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-20/)<br>
[[ Leetcode 227 ] Basic Calculator II | 解題思路分享](https://jamesblogger.com/leetcode/articles/leetcode-227/)