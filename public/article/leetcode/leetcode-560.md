---
title: "[ Leetcode 560 ] Subarray Sum Equals K | 解題思路分享"
date: "2025-09-20"
author: James
tags: Array,Hash Table,Prefix Sum,Google,Meta
difficulty: Medium
image: /images/program/Leetcode.jpeg
description: ""
proficiency: 1
readTime: 2
id: 2609827a-bd0a-4438-97d3-17d4be356639
---

給一個 nums[i]，輸出有多少 subarray 的 sum 為 `k`

題目連結 🔗：[https://leetcode.com/problems/subarray-sum-equals-k/](https://leetcode.com/problems/subarray-sum-equals-k/)

## 問題分析

遇到 subarray 的 sum，可以往 sliding window, two pointers, prefix sum 等方向去想，但是因為這題不是 sorted array，two pointers 執行起來可能有難度，所以試著朝 prefix sum 想想看。

## 解題思路 - Prefix Sum

prefix sum 的核心概念是

> prefix[i] 代表 sum(nums[0...i])，也就是說 prefix[i] - prefix[j] = sum(nums[j+1...i])

這題我們可以先建立一個 prefix[i] 儲存 prefix sum，如果 nums[i] 都是正數，我們可以直接使用 two pointers 解題，`left` 跟 `right` 中間夾著的是目前的 subarray，如果這個 subarray 的 sum 太大，就移動 `left` 縮小 subarray，如果太小就移動 `right` 拉大 subarray，但問題是 nums[i] 並不是都正數，因此 prefix sum 不會是 non-decreasing 的 array。

我們要思考的是，當 iterate 到 i，要找的是以 nums[i] 為結尾有多少 subarray 的 sum 是 k，暴力解就是看有多少小於 `i` 的 `j` 會讓 prefix[i] - k = prefix[j]，而為了解決暴力解帶來的時間複雜度，直接把每一個 prefix[i] 都丟到 Hash Table 就好，這樣就可以直接算裡面有多少個 prefix[i] - k。

實作不難，就是把每一個 prefix[i] 都丟到 Hash Table 就好，這邊就不贅述。

**Time Complexity** - `O(n)`<br>
**Space Complexity** - `O(n)`

## Implementation

```cpp
int subarraySum(vector<int>& nums, int k) {
    int n = nums.size();
    int result = 0, prefix = 0;
    unordered_map<int, int>umap;
    umap[prefix] = 1;

    for(int &num : nums) {
        prefix += num;
        if(umap.count(prefix - k)) result += umap[prefix - k];
        umap[prefix]++;
    }

    return result;
}
```