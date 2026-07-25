---
title: "[ Leetcode 349 ] Intersection of Two Arrays | 解題思路分享"
date: "2025-02-23"
author: James
tags: Array,Hash Table
difficulty: Easy
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 5
readTime: 3
id: 6c61fd2e-2333-4f7d-a632-bb6f4960e47f
---

給兩個整數陣列 `nums1` 和 `nums2`，找出它們的交集，並且結果中每個元素只能出現一次。

題目連結 🔗：[https://leetcode.com/problems/intersection-of-two-arrays/](https://leetcode.com/problems/intersection-of-two-arrays/)

### **解題思路 - Hash Table**

這題想法很簡單，因為要找交集，所以 iterate 一個陣列的時候，查找另一個陣列有沒有這個元素就可以了，但是如果要使「查找」這件事情是 O(1)，我們可以先將 `nums1` 轉成 unordered_set，也就是 hash table，這樣查找 `nums2` 的元素時，就可以用 O(1) 快速判斷是否存在。

如果 `nums2` 中的元素在 unordered_set 裡，代表是交集的一部分，就是存入 result 的 vector 中，再來為了要去除結果中的 duplicate，我們在查找到這個元素之後，要把她從 unordered_set 裡 erase 掉，這樣我們就不會查找到重複的元素，erase 本身也是 O(1)，所以整個的時間複雜度就是 O(m+n)

**Time Complexity** - `O( m + n )`，因為 iterate 兩個 vector。<br>
**Space Complexity** - `O(m)`，因為開了一個 1D unordered_set 還有一個 1D vector。

### **Implementation**

```cpp
vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {

    unordered_set<int> uset(nums1.begin(), nums1.end());
    vector<int> result;

    for( int num : nums2 ) {
        if(uset.count(num) > 0){
            result.push_back(num);
            uset.erase(num);
        }
    }

    return result;
}
```