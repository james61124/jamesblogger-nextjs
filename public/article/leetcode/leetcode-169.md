---
title: "[ Leetcode 169 ] Majority Element | 解題思路分享"
date: "2025-08-30"
author: James
tags: Array,Boyer-Moore Voting Algorithm,Top Interview,Google,Meta
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 3
id: ee1982a3-f015-478d-92f5-95f8caac4a41
---

給一個 nums[i]，其中有一個 element 總數大於二分之一，找出這個 element

題目連結 🔗：[https://leetcode.com/problems/majority-element/](https://leetcode.com/problems/majority-element/)

## 題目分析

這題最直覺的做法是建立一個 Hash Table 並計算每個數字出現的次數即可，但這樣會多耗一個 O(n) 的空間，因此這裡可以運用一個很厲害的演算法 - Boyer-Moore Voting Algorithm。

## 解題思路 - Boyer-Moore Voting Algorithm

在這個演算法中我們需要兩個變數，候選人 `candidate` 跟計數器 `count`。當遇到 `candidate` 時 `count` 就加一，當遇到不是 `candidate` 時 `count` 就減一，而當 `count == 0` 時就重設 `candidate`，表示目前所有的元素占的比重是一樣的，可以全部重新計算。

Boyer-Moore Voting Algorithm 的核心觀念就是

> majority element 總數大於二分之一，所以怎麼抵銷都不會消失，後面總會再出現

因此最後剩下的 `candidate` 就是答案，底下直接來實作

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

### Implementation

```cpp
int majorityElement(vector<int>& nums) {
    int count = 0;
    int candidate = 0;

    for(int num : nums){
        if(count == 0) candidate = num;
        if(candidate == num) count++;
        else count--;
    }

    return candidate;
}
```