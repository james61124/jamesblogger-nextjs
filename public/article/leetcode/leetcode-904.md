---
title: "[ Leetcode 904 ] Fruit Into Baskets | 解題思路分享"
date: "2025-11-21"
author: James
tags: Array,Sliding Window,Hash Table,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: 25c0f6de-6424-40e6-9133-86759919d608
---

給 nums[i]，找到一個最長的 subarray，裡面只包含兩種數字，回傳 subarray 長度

題目連結 🔗：[https://leetcode.com/problems/fruit-into-baskets/](https://leetcode.com/problems/fruit-into-baskets/)

### **問題分析**

要找 subarray，我們可以直接往 sliding window 想想看，維護一個裡面只包含兩種數字的 sliding window，可以建立一個 Hash Table 紀錄 sliding window 內每個字母出現的數量，當 sliding window 內出現第三種字母表示 sliding window 太長了，`left` 就縮進來，如果不是的話就一直擴展 `right`，這樣就可以了

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
int totalFruit(vector<int>& fruits) {
    unordered_map<int, int>count;
    int left = 0;
    int right = 0;
    int result = 0;

    while(right < fruits.size()){
        count[fruits[right]]++;
        while(count.size() > 2){
            count[fruits[left]]--;
            if(count[fruits[left]] == 0) count.erase(fruits[left]);
            left++;
        }
        result = max(result, right - left + 1);
        right++;
    }

    return result;
}
```
