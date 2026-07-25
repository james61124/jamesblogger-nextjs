---
title: "[ Leetcode 334 ] Increasing Triplet Subsequence | 解題思路分享"
date: "2025-12-02"
author: James
tags: Array,Greedy,Google
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
readTime: 3
id: ee953dc3-5a37-4113-908e-8b9a920677da
---

給 nums[i]，判斷有沒有三個數字 (i, j, k) 使得 nums[i] < nums[j] < nums[k]

題目連結 🔗：[https://leetcode.com/problems/increasing-triplet-subsequence/](https://leetcode.com/problems/increasing-triplet-subsequence/)

### **問題分析**

這題我們只要維護 (i, j, k) 裡面的 (i, j) 就可以解決了，我們紀錄「目前」的 (i, j)，所以只要找到比 j 還要大的，就可以直接 return true，但我們要怎麼紀錄「目前」的 (i, j) 呢？

舉例來說，nums = [5, 4, 6, 3, 5, 7]，iterate 整個 nums，首先 i = 5，我們知道 j 一定要比 i 還要大，所以當 visit 到 4 他沒有比 5 大，但是後面 visit 到的數字如果比 5 大，那一定會比 4 大，所以要把 i 替換成 4，換句話說，如果目前的數字 `num` 比 i 小，那就直接替換 i，所以目前 (i, j) = (4, INT_MAX)

再來如果 `num` 比 i 還要大，但是比 j 小，那就替換 j，(i, j) = (4, 6)

下一個數字是 3，一樣可以看到，後面的數字如果比 4 大，那一定也會比 3 大，所以可以直接將 i 替換掉，(i, j) = (3, 6)

下一個數字是 5，一樣後面數字如果比 6 大，那一定會比 5 大，所以 (i, j) = (3, 5)，最後 7 > 5，所以 return true

簡單來說，(i, j) 紀錄的不是真正的 (i, j, k) 的組合，他只是我們拿來判斷是不是存在這個 valid 的 k 的依據而已

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(1)`

#### **Implementation**

```cpp
bool increasingTriplet(vector<int>& nums) {
    int n = nums.size();
    int first = INT_MAX;
    int second = INT_MAX;

    for(int &num : nums){
        if(num <= first) first = num;
        else if(num <= second) second = num;
        else return true;
    }

    return false;
}
```
