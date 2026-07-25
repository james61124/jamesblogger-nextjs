---
title: "[ Leetcode 219 ] Contains Duplicate II | 解題思路分享"
date: "2025-03-10"
author: James
tags: Array,Hash Table,Sliding Window
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: 4ad1cd5a-84b3-496c-81e7-ff1b60081f63
---

給一個整數 array `nums` 和一個整數 `k`，請判斷是否存在兩個相同的數字，且它們的 index 距離最多為 k。

題目連結 🔗：[https://leetcode.com/problems/contains-duplicate-ii/](https://leetcode.com/problems/contains-duplicate-ii/)

### **解題思路 - Hash Table**

非常的直覺，把數字存進去 Hash Table，檢查數字有沒有在 Hash Table 裡就行了，因為 Hash Table 的 search 是 O(1)，不過除了這樣，這題還需要計算 index 的距離。

#### **index 的計算**

所以我們不能只單純存數字在 Hash Table 中，我們必須把數字跟他的 index 的對應關係都存進去，這樣在我們找到重複的數字後，才可以計算 index 差，所以這裡選擇用 unordered_map 來存這個對應關係。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

#### **Implementation**

```cpp
bool containsNearbyDuplicate(vector<int>& nums, int k) {
    unordered_map<int, int>umap;

    for(int i=0; i<nums.size(); i++){
        if(umap.find(nums[i]) != umap.end() && abs(umap[nums[i]]-i) <= k) return true;
        else umap[nums[i]] = i;
    }

    return false;
}
```

### **空間優化 - Unordered_set + Sliding Window**

unordered_map 應該是最直覺的解，但是他需要儲存 key-value，空間上會比 unordered_set 來的浪費，這題實際上不用儲存 index 也可以解決計算 index 差的問題。

#### **解題思路**

我們一樣把數字 insert 進去 unordered_set，當 unordered_set 的 size > k，表示最早 insert 進來的數字已經沒有用了，因為就算他是重複的數字，index 差計算完也會 > k，所以我們就可以把他從 unordered_set erase 掉，換句話說，我們只要維持 unordered_set 的 size <= k，找到重複的數字的話就一定符合要求，就可以 return true。

**Time Complexity** - O( n )<br>
**Space Complexity** - O( n )

#### **Implementation**

```cpp
bool containsNearbyDuplicate(vector<int>& nums, int k) {
    unordered_set<int>uset;

    for(int i=0; i<nums.size(); i++){
        if(uset.count(nums[i])) return true;
        else uset.insert(nums[i]);

        if(uset.size()>k) uset.erase(nums[i-k]);
    }

    return false;
}
```